// 영어 직접 발음 & 주관식 말하기/듣기 전용 Web Speech API 음성 제어 모듈
class VoiceCommander {
  constructor(onActionCallback) {
    this.onAction = onActionCallback;
    this.recognition = null;
    this.isListening = false;
    this.isSupported = false;
    this.autoRestart = true;
    
    this.statusCard = document.getElementById('voiceStatusCard');
    this.statusText = document.getElementById('voiceStatusText');
    this.heardText = document.getElementById('voiceHeardText');
    this.toggleBtn = document.getElementById('micToggleBtn');
    this.toggleBtnText = document.getElementById('micToggleBtnText');

    this.init();
  }

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API 미지원 브라우저');
      this.isSupported = false;
      this.statusText.textContent = '음성 미지원';
      this.heardText.textContent = '마이크 API가 지원되지 않는 브라우저';
      if (this.toggleBtn) this.toggleBtn.style.display = 'none';
      return;
    }

    this.isSupported = true;
    try {
      this.recognition = new SpeechRecognition();
      // 영어 단어와 한국어 제어어를 모두 인식하기 위해 한국어 설정 상태에서도 영어 발음을 수신하고,
      // maxAlternatives를 5개로 늘려 영어 단어 후보군을 정밀 탐색합니다.
      this.recognition.lang = 'ko-KR';
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 5;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateUI();
      };

      this.recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const result = event.results[lastResultIndex];
        
        // 여러 후보(alternatives) 추출
        const candidateWords = [];
        for (let i = 0; i < result.length; i++) {
          candidateWords.push(result[i].transcript.trim().toLowerCase());
        }

        const primaryWord = candidateWords[0] || '';
        console.log('[Voice Candidates]:', candidateWords);
        this.heardText.textContent = `"${primaryWord}"`;

        // 현재 문제 컨텍스트와 대조
        const action = this.parseCommand(candidateWords);
        if (action) {
          window.soundFx.playVoiceAck();
          this.highlightRecognized();
          if (this.onAction) {
            this.onAction(action);
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('[Voice Error]:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          this.autoRestart = false;
          this.isListening = false;
          this.statusText.textContent = '마이크 권한 필요';
          this.heardText.textContent = '마이크 권한을 허용해주세요';
          this.updateUI();
        }
      };

      this.recognition.onend = () => {
        if (this.isListening && this.autoRestart) {
          try {
            this.recognition.start();
          } catch (e) {}
        } else {
          this.isListening = false;
          this.updateUI();
        }
      };

      if (this.statusCard) {
        this.statusCard.style.cursor = 'pointer';
        this.statusCard.title = '클릭/터치 또는 V키로 마이크 켜기/끄기';
        this.statusCard.addEventListener('click', () => this.toggle());
      }
      this.updateUI();
    } catch (err) {
      console.error('음성 인식 초기화 오류:', err);
      this.isSupported = false;
    }
  }

  // 발화 후보군 -> 게임 액션 변환
  parseCommand(candidates) {
    const currentQ = (window.gameApp && window.gameApp.currentQuestion) ? window.gameApp.currentQuestion : null;

    // 1. [최우선] 현재 문제의 정답/보기 영어 단어 직접 발음 매칭
    if (currentQ) {
      // (1) 문장 전체 섀도잉 문제인 경우: 문장 전체 일치율 비교
      if (currentQ.type === 'shadowing') {
        const fullTarget = (currentQ.audioText || currentQ.full || currentQ.sentence.replace('_____', currentQ.answerWord || '')).toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').trim();
        const targetWords = fullTarget.split(/\s+/).filter(Boolean);

        for (const spoken of candidates) {
          const cleanSpoken = spoken.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').trim();
          const spokenWords = cleanSpoken.split(/\s+/).filter(Boolean);
          let matches = 0;
          spokenWords.forEach(sw => {
            if (targetWords.includes(sw)) matches++;
          });
          const matchRatio = matches / Math.max(1, targetWords.length);
          if (matchRatio >= 0.4 || cleanSpoken.includes(fullTarget) || fullTarget.includes(cleanSpoken)) {
            return {
              type: 'spokenShadowingAnswer',
              spokenSentence: spoken,
              targetSentence: fullTarget,
              similarity: Math.min(100, Math.max(65, Math.round(matchRatio * 100))),
              isCorrect: true
            };
          }
        }

        // 제어 명령어가 아닐 때 오답으로 처리
        if (candidates.length > 0) {
          const first = candidates[0];
          if (!this.isControlWord(first)) {
            return {
              type: 'spokenShadowingAnswer',
              spokenSentence: first,
              targetSentence: fullTarget,
              similarity: 40,
              isCorrect: false
            };
          }
        }
      }

      // (2) 주관식 말하기 / 듣기 문제인 경우: acceptableAnswers 목록과 대조
      if (currentQ.type === 'speaking' || currentQ.type === 'listening') {
        const acceptable = (currentQ.acceptableAnswers || [currentQ.answerWord || currentQ.missingWord || ''])
          .map(a => a.toLowerCase().replace(/\s+/g, ''));

        for (const spoken of candidates) {
          const cleanSpoken = spoken.replace(/[^a-zA-Z0-9가-힣]/g, '');
          for (const ans of acceptable) {
            const cleanAns = ans.replace(/[^a-zA-Z0-9가-힣]/g, '');
            if (cleanSpoken === cleanAns || cleanSpoken.includes(cleanAns) || cleanAns.includes(cleanSpoken)) {
              return {
                type: 'spokenDirectAnswer',
                spokenWord: spoken,
                targetAnswer: currentQ.answerWord || currentQ.missingWord,
                isCorrect: true
              };
            }
          }
        }

        // 특정 오답 단어를 말한 경우라도 일단 발음 입력으로 인정
        if (candidates.length > 0) {
          const first = candidates[0];
          // 제어 명령어가 아닐 때만 주관식 답변으로 제출
          if (!this.isControlWord(first)) {
            return {
              type: 'spokenDirectAnswer',
              spokenWord: first,
              targetAnswer: currentQ.answerWord || currentQ.missingWord,
              isCorrect: false
            };
          }
        }
      }

      // (3) 4지선다형 문제인 경우: 4개 보기의 영어 단어 또는 번호 대조
      if (currentQ.type === 'choice' && currentQ.options) {
        for (let optIdx = 0; optIdx < currentQ.options.length; optIdx++) {
          const optWord = currentQ.options[optIdx].toLowerCase().replace(/\s+/g, '');
          for (const spoken of candidates) {
            const cleanSpoken = spoken.replace(/\s+/g, '');
            if (cleanSpoken === optWord || cleanSpoken.includes(optWord)) {
              return { type: 'selectOption', index: optIdx };
            }
          }
        }
      }
    }

    // 2. 제어 및 네비게이션 명령어 매칭
    for (const spoken of candidates) {
      const clean = spoken.replace(/\s+/g, '');

      // 학년 변경 음성 명령
      if (/^(초등3|초3|초4|초등3학년|초등4학년|초등기초)$/.test(clean) || clean.includes('초3') || clean.includes('초등3')) {
        return { type: 'changeGrade', grade: 'elem-low' };
      }
      if (/^(초등5|초5|초6|초등5학년|초등6학년|초등심화)$/.test(clean) || clean.includes('초5') || clean.includes('초등5')) {
        return { type: 'changeGrade', grade: 'elem-high' };
      }
      if (/^(중1|중학교1|중학교1학년|중1학년)$/.test(clean) || clean.includes('중1')) {
        return { type: 'changeGrade', grade: 'mid-1' };
      }
      if (/^(중2|중학교2|중학교2학년|중2학년)$/.test(clean) || clean.includes('중2')) {
        return { type: 'changeGrade', grade: 'mid-2' };
      }
      if (/^(중3|중학교3|중학교3학년|중3학년)$/.test(clean) || clean.includes('중3')) {
        return { type: 'changeGrade', grade: 'mid-3' };
      }
      if (/^(고등|고1|고2|고3|수능|고등학교|수능어법)$/.test(clean) || clean.includes('수능') || clean.includes('고등')) {
        return { type: 'changeGrade', grade: 'high' };
      }

      // 다시 듣기 (리스닝 문제용)
      if (/^(다시듣기|다시들려줘|듣기|소리|play|listen)$/.test(clean) || clean.includes('다시들')) {
        return { type: 'replayAudio' };
      }

      // 번호 직접 선택
      if (/^(1번|일번|첫번째|one|1)$/.test(clean)) return { type: 'selectOption', index: 0 };
      if (/^(2번|이번|두번째|two|2)$/.test(clean)) return { type: 'selectOption', index: 1 };
      if (/^(3번|삼번|세번째|three|3)$/.test(clean)) return { type: 'selectOption', index: 2 };
      if (/^(4번|사번|네번째|four|4)$/.test(clean)) return { type: 'selectOption', index: 3 };

      // 방향키 이동
      if (/^(위|상|위로|up)$/.test(clean)) return { type: 'nav', dir: 'up' };
      if (/^(아래|하|밑|밑으로|down)$/.test(clean)) return { type: 'nav', dir: 'down' };
      if (/^(왼쪽|좌|좌측|left)$/.test(clean)) return { type: 'nav', dir: 'left' };
      if (/^(오른쪽|우|우측|right)$/.test(clean)) return { type: 'nav', dir: 'right' };

      // 결정 / 다음 / 시작
      if (/^(선택|확인|결정|정답|엔터|select|ok|enter)$/.test(clean) || clean.includes('선택')) return { type: 'confirm' };
      if (/^(다음|다음문제|넘어가|next)$/.test(clean) || clean.includes('다음')) return { type: 'next' };
      if (/^(시작|스타트|게임시작|start)$/.test(clean) || clean.includes('시작')) return { type: 'start' };
      if (/^(다시|다시시작|재시작|restart)$/.test(clean) || clean.includes('다시')) return { type: 'restart' };

      // 조작 및 사용법 도움말 보기 명령
      if (/^(도움말|사용법|조작법|방법|가이드|help|guide)$/.test(clean) || clean.includes('도움말') || clean.includes('사용법')) {
        return { type: 'help' };
      }

      // 문법 개념 / 공식 / 치트시트 보기 명령
      if (/^(설명|문법|개념|힌트|공식|치트시트|grammar|concept|rule)$/.test(clean) || clean.includes('설명') || clean.includes('문법') || clean.includes('개념')) {
        return { type: 'concept' };
      }

      // 모달 닫기
      if (/^(닫기|닫아줘|나가기|취소|close|cancel)$/.test(clean)) {
        return { type: 'closeModal' };
      }

      // 내 목소리 다시 듣기 (섀도잉 녹음 재생)
      if (/^(내목소리|내발음|내소리|들어보기|내목소리듣기)$/.test(clean) || clean.includes('내목소리') || clean.includes('내발음')) {
        return { type: 'replayUserVoice' };
      }

      // 원어민 발음 비교
      if (/^(원어민|원어민발음|원어민소리|비교|발음비교)$/.test(clean) || clean.includes('원어민') || clean.includes('비교')) {
        return { type: 'playNativeCompare' };
      }
    }

    return null;
  }

  // 제어 명령 단어인지 판별
  isControlWord(word) {
    const clean = word.replace(/\s+/g, '');
    return /^(다음|시작|다시|선택|정답|확인|위|아래|왼쪽|오른쪽|1번|2번|3번|4번|설명|문법|개념|힌트|공식|도움말|사용법|조작법|닫기|내목소리|내발음|원어민|비교)$/.test(clean);
  }

  highlightRecognized() {
    this.statusCard.classList.add('listening');
    setTimeout(() => {
      if (!this.isListening) {
        this.statusCard.classList.remove('listening');
      }
    }, 400);
  }

  start() {
    if (!this.isSupported || !this.recognition) return;
    this.autoRestart = true;
    try {
      this.recognition.start();
      this.isListening = true;
      this.updateUI();
    } catch (e) {}
  }

  stop() {
    if (!this.recognition) return;
    this.autoRestart = false;
    this.isListening = false;
    try {
      this.recognition.stop();
    } catch (e) {}
    this.updateUI();
  }

  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }

  updateUI() {
    if (this.isListening) {
      this.statusCard.classList.add('listening');
      this.statusText.textContent = '음성 인식 중... 🎙️';
      if (this.heardText) this.heardText.textContent = '단어를 말씀하세요';
      if (this.toggleBtnText) this.toggleBtnText.textContent = '🔴 마이크 끄기';
    } else {
      this.statusCard.classList.remove('listening');
      this.statusText.textContent = '마이크 꺼짐 (클릭 또는 V)';
      if (this.heardText) this.heardText.textContent = '마이크 버튼 또는 V키로 켜기';
      if (this.toggleBtnText) this.toggleBtnText.textContent = '🎙️ 마이크 켜기 (영어 단어 직접 발음)';
    }
  }
}

window.VoiceCommander = VoiceCommander;
