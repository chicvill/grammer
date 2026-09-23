// ========================================================
// ShadowingManager - 문장 전체 섀도잉 및 발음 정확도 평가 전용 모듈
// MediaRecorder 오디오 캡처, Web Speech API 음성 대조, 원어민 발음 비교를 독립적으로 관리합니다.
// ========================================================

class ShadowingManager {
  constructor() {
    this.panel = document.getElementById('shadowingPanel');
    this.listenBtn = document.getElementById('shadowListenBtn');
    this.recordBtn = document.getElementById('shadowRecordBtn');
    this.resultBox = document.getElementById('shadowResultBox');
    this.scoreStars = document.getElementById('shadowScoreStars');
    this.scoreNumber = document.getElementById('shadowScoreNumber');
    this.heardText = document.getElementById('shadowHeardText');
    this.playUserVoiceBtn = document.getElementById('playUserVoiceBtn');
    this.playNativeCompareBtn = document.getElementById('playNativeCompareBtn');
    this.playUserVoiceText = document.getElementById('playUserVoiceText');

    this.isRecording = false;
    this.currentUserAudioUrl = null;
    this.currentUserAudio = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.shadowStream = null;
    this.shadowRecognizer = null;

    this.bindEvents();
  }

  bindEvents() {
    if (this.listenBtn) {
      this.listenBtn.addEventListener('click', () => {
        if (window.gameApp) window.gameApp.playListeningAudio();
      });
    }

    if (this.recordBtn) {
      this.recordBtn.addEventListener('click', () => {
        if (this.isRecording) {
          this.stopRecording();
        } else {
          this.startRecording();
        }
      });
    }

    if (this.playUserVoiceBtn) {
      this.playUserVoiceBtn.addEventListener('click', () => this.playUserVoice());
    }

    if (this.playNativeCompareBtn) {
      this.playNativeCompareBtn.addEventListener('click', () => this.playNativeCompare());
    }
  }

  // Aliases for seamless backward compatibility
  startShadowRecording(targetText) {
    return this.startRecording(targetText);
  }

  stopShadowRecording(score, heard) {
    return this.stopRecording(score, heard);
  }

  playUserRecordedVoice() {
    return this.playUserVoice();
  }

  playNativeComparisonVoice(targetText) {
    return this.playNativeCompare(targetText);
  }

  // 새 문제 로드 시 이전 녹음 및 오디오 메모리 해제
  resetUI() {
    this.cleanupAudio();
    if (this.resultBox) {
      this.resultBox.style.display = 'none';
    }
    if (this.recordBtn) {
      this.recordBtn.classList.remove('recording');
      this.recordBtn.innerHTML = '<span>🎙️ 따라 말하기 시작</span>';
    }
    if (this.playUserVoiceBtn) {
      this.playUserVoiceBtn.classList.remove('playing', 'ready');
    }
    if (this.playUserVoiceText) {
      this.playUserVoiceText.textContent = '내 목소리 다시 듣기';
    }
    const clinicPanel = document.getElementById('pronunciationClinicPanel');
    if (clinicPanel) {
      clinicPanel.style.display = 'none';
      clinicPanel.innerHTML = '';
    }
  }

  // 섀도잉 녹음 시작 (마이크 스트림 & 음성인식 병행)
  async startRecording(targetText) {
    if (this.isRecording) return;

    let target = targetText;
    if (!target && window.gameApp && window.gameApp.currentQuestion) {
      const q = window.gameApp.currentQuestion;
      target = (q.audioText || q.full || q.sentence.replace('_____', q.answerWord || ''));
    }
    const targetFull = (target || '').replace(/[.?!]/g, '').trim().toLowerCase();

    this.isRecording = true;
    this.audioChunks = [];

    if (this.recordBtn) {
      this.recordBtn.classList.add('recording');
      this.recordBtn.innerHTML = '<span>⏹️ 녹음 중... (다 읽고 클릭 시 완료)</span>';
    }

    // 1. MediaRecorder 오디오 스트림 녹음
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.shadowStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus') ? 'audio/ogg;codecs=opus' : '');

        this.mediaRecorder = mimeType ? new MediaRecorder(this.shadowStream, { mimeType }) : new MediaRecorder(this.shadowStream);

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          if (this.audioChunks.length > 0) {
            if (this.currentUserAudioUrl) {
              URL.revokeObjectURL(this.currentUserAudioUrl);
            }
            const blob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType || 'audio/webm' });
            this.currentUserAudioUrl = URL.createObjectURL(blob);
            if (this.playUserVoiceBtn) {
              this.playUserVoiceBtn.classList.add('ready');
            }
            if (this.resultBox) {
              this.resultBox.style.display = 'flex';
            }
          }
        };

        this.mediaRecorder.start(100);
      }
    } catch (err) {
      console.warn('MediaRecorder 녹음 스트림 접근 불가:', err);
    }

    // 2. Web Speech API 음성 인식기 시작
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.shadowRecognizer = new SpeechRecognition();
        this.shadowRecognizer.lang = 'en-US';
        this.shadowRecognizer.interimResults = false;
        this.shadowRecognizer.maxAlternatives = 1;

        this.shadowRecognizer.onresult = (e) => {
          const heard = e.results[0][0].transcript.toLowerCase().trim();
          const score = this.calculateSimilarity(heard, targetFull);
          this.stopRecording(score, heard);
        };

        this.shadowRecognizer.onerror = (e) => {
          console.warn('[Shadow STT Error]:', e);
          if (this.isRecording) {
            this.stopRecording();
          }
        };

        this.shadowRecognizer.onend = () => {
          if (this.isRecording) {
            this.stopRecording();
          }
        };

        this.shadowRecognizer.start();
      } catch (e) {
        console.warn('SpeechRecognition 시작 오류:', e);
      }
    }
  }

  // 섀도잉 녹음 종료 및 평가 결과 표시
  stopRecording(score = null, heard = '') {
    if (!this.isRecording) return;
    this.isRecording = false;

    if (this.recordBtn) {
      this.recordBtn.classList.remove('recording');
      this.recordBtn.innerHTML = '<span>🎙️ 다시 따라 말하기</span>';
    }

    // 1. STT 중지
    if (this.shadowRecognizer) {
      try { this.shadowRecognizer.stop(); } catch (e) {}
      this.shadowRecognizer = null;
    }

    // 2. MediaRecorder 중지
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try { this.mediaRecorder.stop(); } catch (e) {}
    }

    // 3. 마이크 트랙 해제
    if (this.shadowStream) {
      try {
        this.shadowStream.getTracks().forEach(t => t.stop());
        this.shadowStream = null;
      } catch (e) {}
    }

    // 4. 결과 UI 업데이트
    if (this.resultBox) {
      this.resultBox.style.display = 'flex';
    }

    if (score !== null) {
      if (this.scoreNumber) this.scoreNumber.textContent = `발음 정확도: ${score}점`;
      if (this.heardText) this.heardText.textContent = `인식된 발음: "${heard}"`;
      if (this.scoreStars) {
        if (score >= 90) {
          this.scoreStars.textContent = '⭐⭐⭐ (원어민 수준!)';
          if (window.soundFx) window.soundFx.playCombo();
        } else if (score >= 70) {
          this.scoreStars.textContent = '⭐⭐ (훌륭해요!)';
          if (window.soundFx) window.soundFx.playCorrect();
        } else {
          this.scoreStars.textContent = '⭐ (조금 더 또박또박!)';
          if (window.soundFx) window.soundFx.playWrong();
        }
      }
    } else {
      if (this.scoreStars) this.scoreStars.textContent = '🎙️ 녹음 완료!';
      if (this.scoreNumber) this.scoreNumber.textContent = '내 목소리 확인';
      if (this.heardText) this.heardText.textContent = '녹음이 저장되었습니다. 옆의 [내 목소리 다시 듣기]를 눌러보세요!';
      if (window.soundFx) window.soundFx.playCorrect();
    }

    // 5. AI 원어민 발음 정밀 클리닉 & 음소 교정 코칭 렌더링
    const clinicPanel = document.getElementById('pronunciationClinicPanel');
    if (clinicPanel && window.pronunciationCoach) {
      let targetSentence = '';
      if (window.gameApp && window.gameApp.currentQuestion) {
        const q = window.gameApp.currentQuestion;
        targetSentence = q.audioText || q.full || q.sentence.replace('_____', q.answerWord || '');
      }
      window.pronunciationCoach.renderClinic(clinicPanel, targetSentence, heard, score || 80);
    }

    // 5. [내 목소리 다시 듣기] 버튼으로 자동 포커스
    setTimeout(() => {
      if (this.playUserVoiceBtn) {
        this.playUserVoiceBtn.classList.add('ready');
        this.playUserVoiceBtn.focus();
      }
    }, 250);
  }

  // 발음 단어 유사도 계산
  calculateSimilarity(s1, s2) {
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    let matches = 0;
    words1.forEach(w => {
      if (words2.includes(w)) matches++;
    });
    const ratio = matches / Math.max(words1.length, words2.length);
    return Math.min(100, Math.max(60, Math.round(ratio * 100)));
  }

  // 사용자 녹음 목소리 재생
  playUserVoice() {
    if (!this.currentUserAudioUrl) {
      alert('🎙️ 먼저 바로 옆의 [따라 말하기 시작] 버튼을 눌러 마이크로 문장을 읽고 녹음해 보세요!');
      return;
    }

    if (this.currentUserAudio) {
      this.currentUserAudio.pause();
      this.currentUserAudio.currentTime = 0;
    }

    this.currentUserAudio = new Audio(this.currentUserAudioUrl);

    if (this.playUserVoiceBtn) {
      this.playUserVoiceBtn.classList.add('playing');
    }
    if (this.playUserVoiceText) {
      this.playUserVoiceText.textContent = '내 목소리 재생 중...';
    }

    const resetBtn = () => {
      if (this.playUserVoiceBtn) this.playUserVoiceBtn.classList.remove('playing');
      if (this.playUserVoiceText) this.playUserVoiceText.textContent = '내 목소리 다시 듣기';
    };

    this.currentUserAudio.onended = resetBtn;
    this.currentUserAudio.onerror = resetBtn;

    this.currentUserAudio.play().catch(e => {
      console.warn('사용자 녹음 오디오 재생 실패:', e);
      resetBtn();
    });
  }

  // 원어민 발음 비교 TTS 재생
  playNativeCompare(targetText) {
    if (this.currentUserAudio) {
      this.currentUserAudio.pause();
      if (this.playUserVoiceBtn) this.playUserVoiceBtn.classList.remove('playing');
      if (this.playUserVoiceText) this.playUserVoiceText.textContent = '내 목소리 다시 듣기';
    }

    let fullText = targetText;
    if (!fullText && window.gameApp && window.gameApp.currentQuestion) {
      const q = window.gameApp.currentQuestion;
      fullText = q.audioText || q.full;
      if (!fullText) {
        const ans = q.answerWord || (q.options ? q.options[q.answer] : '');
        fullText = q.sentence.replace('_____', ans);
      }
    }

    if (!fullText) return;
    fullText = fullText.trim();
    if (!fullText.endsWith('.') && !fullText.endsWith('?') && !fullText.endsWith('!')) {
      fullText += '.';
    }

    if (window.soundFx) {
      window.soundFx.speakEnglish(fullText);
    }
  }

  cleanupAudio() {
    if (this.currentUserAudio) {
      try { this.currentUserAudio.pause(); } catch (e) {}
      this.currentUserAudio = null;
    }
    if (this.currentUserAudioUrl) {
      URL.revokeObjectURL(this.currentUserAudioUrl);
      this.currentUserAudioUrl = null;
    }
    this.audioChunks = [];
  }
}

window.ShadowingManager = ShadowingManager;
