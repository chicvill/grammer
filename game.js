// 중1 기초 영문법 TV 퀘스트 - 선택형 + 무보기 말하기 + 듣기 평가 통합 엔진
class GrammarQuestGame {
  constructor() {
    this.TOTAL_QUESTIONS = 10;
    this.QUESTION_TIME = 22; // 문제당 22초 (말하기/듣기 고려)

    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.correctCount = 0;
    this.timeLeft = this.QUESTION_TIME;
    this.timer = null;

    this.focusedOption = 0;
    this.isAnswered = false;
    this.gameState = 'ready'; // 'ready', 'quiz', 'review', 'finished'

    // 현재 선택된 학년 ('elem-low', 'elem-high', 'mid-1', 'mid-2', 'mid-3', 'high')
    this.currentGrade = localStorage.getItem('GRAMMAR_CURRENT_GRADE') || 'mid-1';

    // 학습 상태 영구 보관 (localStorage)
    this.totalSolvedCount = parseInt(localStorage.getItem('GRAMMAR_TOTAL_SOLVED') || '0', 10);
    this.wrongQuestions = this.loadStorageArray('GRAMMAR_WRONG_QUESTIONS'); // 틀린 문제 객체 목록

    // DOM 요소
    this.gradeTabs = document.querySelectorAll('.grade-tab');
    this.qNumText = document.getElementById('qNumText');
    this.masteredProgressText = document.getElementById('masteredProgressText');
    this.scoreText = document.getElementById('scoreText');
    this.streakText = document.getElementById('streakText');
    this.timerBar = document.getElementById('timerBar');
    this.timerNumber = document.getElementById('timerNumber');
    
    this.categoryTag = document.getElementById('categoryTag');
    this.targetSentence = document.getElementById('targetSentence');
    this.sentenceTranslation = document.getElementById('sentenceTranslation');
    this.visualClueStage = document.getElementById('visualClueStage');
    this.heroQuestionShowcase = document.getElementById('heroQuestionShowcase');
    
    // 선택형 2x2 그리드
    this.optionsGrid = document.getElementById('optionsGrid');
    this.optionCards = [
      document.getElementById('opt-0'),
      document.getElementById('opt-1'),
      document.getElementById('opt-2'),
      document.getElementById('opt-3')
    ];
    this.optionTexts = [
      document.getElementById('optText-0'),
      document.getElementById('optText-1'),
      document.getElementById('optText-2'),
      document.getElementById('optText-3')
    ];

    // 주관식 말하기 & 듣기 패널
    this.speechStageWrap = document.getElementById('speechStageWrap');
    this.audioListenBtn = document.getElementById('audioListenBtn');
    this.audioBtnCaption = document.getElementById('audioBtnCaption');
    this.speakingHintBox = document.getElementById('speakingHintBox');
    this.speechInstruction = document.getElementById('speechInstruction');
    this.speechLiveHeard = document.getElementById('speechLiveHeard');

    // 1. 단어 어순 배열 (Scramble) DOM
    this.scrambleStageWrap = document.getElementById('scrambleStageWrap');
    this.scrambleResetBtn = document.getElementById('scrambleResetBtn');
    this.scrambleSubmitBtn = document.getElementById('scrambleSubmitBtn');

    // 2. 2인 가족 대전 모드 DOM 및 상태
    this.modeToggleBtn = document.getElementById('modeToggleBtn');
    this.modeToggleText = document.getElementById('modeToggleText');
    this.battleScoreboard = document.getElementById('battleScoreboard');
    this.p1ScoreEl = document.getElementById('p1Score');
    this.p2ScoreEl = document.getElementById('p2Score');
    this.p1Tag = document.getElementById('p1Tag');
    this.p2Tag = document.getElementById('p2Tag');
    this.isBattleMode = false;
    this.p1Score = 0;
    this.p2Score = 0;
    this.currentTurnPlayer = 1;

    // 3. 문장 전체 섀도잉 DOM 및 상태
    this.shadowingPanel = document.getElementById('shadowingPanel');
    this.shadowListenBtn = document.getElementById('shadowListenBtn');
    this.shadowRecordBtn = document.getElementById('shadowRecordBtn');
    this.shadowResultBox = document.getElementById('shadowResultBox');
    this.shadowScoreStars = document.getElementById('shadowScoreStars');
    this.shadowScoreNumber = document.getElementById('shadowScoreNumber');
    this.shadowHeardText = document.getElementById('shadowHeardText');
    this.playUserVoiceBtn = document.getElementById('playUserVoiceBtn');
    this.playNativeCompareBtn = document.getElementById('playNativeCompareBtn');
    this.playUserVoiceText = document.getElementById('playUserVoiceText');
    this.userAudioWave = document.getElementById('userAudioWave');
    this.isShadowRecording = false;
    this.currentUserAudioUrl = null;
    this.currentUserAudio = null;
    this.mediaRecorder = null;
    this.audioChunks = [];

    // 4. 문법 개념 치트시트 모달 DOM 및 상태
    this.conceptGuideBtn = document.getElementById('conceptGuideBtn');
    this.conceptModalOverlay = document.getElementById('conceptModalOverlay');
    this.conceptCloseBtn = document.getElementById('conceptCloseBtn');
    this.conceptOkBtn = document.getElementById('conceptOkBtn');
    this.conceptGradeBadge = document.getElementById('conceptGradeBadge');
    this.conceptTitle = document.getElementById('conceptTitle');
    this.conceptFormula = document.getElementById('conceptFormula');
    this.conceptUsage = document.getElementById('conceptUsage');
    this.conceptRulesList = document.getElementById('conceptRulesList');
    this.conceptTrapWrong = document.getElementById('conceptTrapWrong');
    this.conceptTrapCorrect = document.getElementById('conceptTrapCorrect');
    this.conceptExamplesList = document.getElementById('conceptExamplesList');
    this.isConceptModalOpen = false;

    this.explanationBox = document.getElementById('explanationBox');
    this.expResultBadge = document.getElementById('expResultBadge');
    this.expContent = document.getElementById('expContent');

    this.gameOverlay = document.getElementById('gameOverlay');
    this.overlayIcon = document.getElementById('overlayIcon');
    this.overlayTitle = document.getElementById('overlayTitle');
    this.overlayDesc = document.getElementById('overlayDesc');
    this.startBtn = document.getElementById('startBtn');
    this.startBtnText = document.getElementById('startBtnText');
    this.micToggleBtn = document.getElementById('micToggleBtn');

    // D-Pad 버튼
    this.btnUp = document.getElementById('btnUp');
    this.btnDown = document.getElementById('btnDown');
    this.btnLeft = document.getElementById('btnLeft');
    this.btnRight = document.getElementById('btnRight');
    this.btnOk = document.getElementById('btnOk');
    this.shortcutChips = [
      document.getElementById('chip-1'),
      document.getElementById('chip-2'),
      document.getElementById('chip-3'),
      document.getElementById('chip-4')
    ];

    // 음성 인식기 초기화
    this.voiceCommander = new VoiceCommander(this.handleVoiceAction.bind(this));

    this.updateProgressHUD();
    this.updateGradeTabsUI();
    this.bindEvents();

    // 초기 화면용 기본 비주얼 단서 렌더링
    if (window.visualClueManager && this.visualClueStage) {
      window.visualClueManager.renderInto(this.visualClueStage, {
        sentence: "Tom and Jerry _____ good friends.",
        translation: "톰과 제리는 좋은 친구들이다.",
        category: "Be동사 현재형"
      });
    }
    
    setTimeout(() => {
      this.startBtn.focus();
    }, 150);
  }

  // 학년 변경 메소드
  setGrade(grade) {
    if (this.currentGrade === grade && this.gameState === 'quiz') return;
    this.currentGrade = grade;
    localStorage.setItem('GRAMMAR_CURRENT_GRADE', grade);
    this.updateGradeTabsUI();
    window.soundFx.playCorrect();
    this.startNewGame();
  }

  updateGradeTabsUI() {
    if (!this.gradeTabs) return;
    this.gradeTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.grade === this.currentGrade);
    });
  }

  loadStorageArray(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveStorageArray(key, arr) {
    try {
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {}
  }

  updateProgressHUD() {
    if (this.masteredProgressText) {
      this.masteredProgressText.textContent = `${this.totalSolvedCount}개 완료`;
    }
  }

  get currentQuestion() {
    return this.questions[this.currentIndex];
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      const key = e.key;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
        e.preventDefault();
      }

      // 샤오미 리모컨의 메뉴(Menu / ☰) 버튼으로 언제든 개념 카드 열기 / 닫기
      if (key === 'ContextMenu' || key === 'Menu' || e.keyCode === 82 || key === 'F1') {
        e.preventDefault();
        if (this.isConceptModalOpen) {
          this.closeConceptModal();
        } else {
          this.openConceptModal();
        }
        return;
      }

      // 문법 개념 모달이 열려있을 때 리모컨 뒤로가기(Back) / ESC / OK / Space로 닫기
      if (this.isConceptModalOpen) {
        if (['Escape', 'Enter', ' ', 'Backspace', 'GoBack', 'BrowserBack'].includes(key) || e.keyCode === 4) {
          e.preventDefault();
          this.closeConceptModal();
          return;
        }
      }

      if (this.gameState === 'ready' || this.gameState === 'finished') {
        if (key === 'Enter' || key === ' ') {
          this.startNewGame();
        }
        return;
      }

      if (this.gameState === 'quiz') {
        // 단축키 H 또는 C 로 문법 개념 카드 열기
        if (['h', 'H', 'c', 'C'].includes(key)) {
          this.openConceptModal();
          return;
        }

        const q = this.currentQuestion;

        // 선택형 문제인 경우
        if (q.type === 'choice') {
          switch (key) {
            case 'ArrowUp':
              this.triggerDpadVisual(this.btnUp);
              this.navigateOptions('up');
              break;
            case 'ArrowDown':
              this.triggerDpadVisual(this.btnDown);
              this.navigateOptions('down');
              break;
            case 'ArrowLeft':
              this.triggerDpadVisual(this.btnLeft);
              this.navigateOptions('left');
              break;
            case 'ArrowRight':
              this.triggerDpadVisual(this.btnRight);
              this.navigateOptions('right');
              break;
            case '1': this.selectOption(0); break;
            case '2': this.selectOption(1); break;
            case '3': this.selectOption(2); break;
            case '4': this.selectOption(3); break;
            case 'Enter':
            case ' ':
              this.triggerDpadVisual(this.btnOk);
              this.confirmSelection();
              break;
          }
        } else if (q.type === 'scramble') {
          // 어순 배열 문제일 때 방향키로 단어 이동 & OK로 스왑
          switch (key) {
            case 'ArrowLeft':
              this.triggerDpadVisual(this.btnLeft);
              if (window.scrambleManager) window.scrambleManager.navigate('left');
              break;
            case 'ArrowRight':
              this.triggerDpadVisual(this.btnRight);
              if (window.scrambleManager) window.scrambleManager.navigate('right');
              break;
            case 'ArrowDown':
              this.triggerDpadVisual(this.btnDown);
              if (window.scrambleManager) window.scrambleManager.navigate('down');
              break;
            case 'Enter':
            case ' ':
              this.triggerDpadVisual(this.btnOk);
              if (window.scrambleManager) window.scrambleManager.handleOk();
              break;
          }
        } else if (q.type === 'listening') {
          // 리스닝 문제일 때 Enter 누르면 다시 듣기 재생
          if (key === 'Enter' || key === ' ') {
            this.playListeningAudio();
          }
        }
      } else if (this.gameState === 'review') {
        const active = document.activeElement;
        if (active === this.playUserVoiceBtn && (key === 'Enter' || key === ' ')) {
          this.playUserRecordedVoice();
          return;
        }
        if (active === this.playNativeCompareBtn && (key === 'Enter' || key === ' ')) {
          this.playNativeComparisonVoice();
          return;
        }
        if (active === this.shadowRecordBtn && (key === 'Enter' || key === ' ')) {
          this.startShadowRecording();
          return;
        }
        if (active === this.shadowListenBtn && (key === 'Enter' || key === ' ')) {
          this.playListeningAudio();
          return;
        }

        // 방향키로 섀도잉 컨트롤 간 이동 지원
        if (key === 'ArrowLeft') {
          if (active === this.playNativeCompareBtn) this.playUserVoiceBtn.focus();
          else if (active === this.shadowRecordBtn) this.shadowListenBtn.focus();
          return;
        }
        if (key === 'ArrowRight') {
          if (active === this.playUserVoiceBtn) this.playNativeCompareBtn.focus();
          else if (active === this.shadowListenBtn) this.shadowRecordBtn.focus();
          else {
            this.triggerDpadVisual(this.btnOk);
            this.nextQuestion();
          }
          return;
        }

        if (['Enter', 'ArrowDown', ' '].includes(key)) {
          this.triggerDpadVisual(this.btnOk);
          this.nextQuestion();
        }
      }
    });

    if (this.btnUp) this.btnUp.addEventListener('click', () => this.handleDpadClick('up'));
    if (this.btnDown) this.btnDown.addEventListener('click', () => this.handleDpadClick('down'));
    if (this.btnLeft) this.btnLeft.addEventListener('click', () => this.handleDpadClick('left'));
    if (this.btnRight) this.btnRight.addEventListener('click', () => this.handleDpadClick('right'));
    if (this.btnOk) this.btnOk.addEventListener('click', () => this.confirmSelection());

    // 2인 가족 대전 토글
    if (this.modeToggleBtn) {
      this.modeToggleBtn.addEventListener('click', () => this.toggleBattleMode());
    }

    // 단어 어순 배열 버튼 이벤트
    if (this.scrambleResetBtn) {
      this.scrambleResetBtn.addEventListener('click', () => {
        if (window.scrambleManager) window.scrambleManager.resetShuffle();
      });
    }
    if (this.scrambleSubmitBtn) {
      this.scrambleSubmitBtn.addEventListener('click', () => {
        if (window.scrambleManager) window.scrambleManager.submitAnswer();
      });
    }

    // 문장 전체 섀도잉 버튼 이벤트
    if (this.shadowListenBtn) {
      this.shadowListenBtn.addEventListener('click', () => this.playListeningAudio());
    }
    if (this.shadowRecordBtn) {
      this.shadowRecordBtn.addEventListener('click', () => this.startShadowRecording());
    }
    if (this.playUserVoiceBtn) {
      this.playUserVoiceBtn.addEventListener('click', () => this.playUserRecordedVoice());
    }
    if (this.playNativeCompareBtn) {
      this.playNativeCompareBtn.addEventListener('click', () => this.playNativeComparisonVoice());
    }

    // 4. 핵심 문법 개념 치트시트 모달 버튼 이벤트
    if (this.conceptGuideBtn) {
      this.conceptGuideBtn.addEventListener('click', () => this.openConceptModal());
    }
    if (this.conceptCloseBtn) {
      this.conceptCloseBtn.addEventListener('click', () => this.closeConceptModal());
    }
    if (this.conceptOkBtn) {
      this.conceptOkBtn.addEventListener('click', () => this.closeConceptModal());
    }
    if (this.conceptModalOverlay) {
      this.conceptModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.conceptModalOverlay) this.closeConceptModal();
      });
    }

    this.audioListenBtn.addEventListener('click', () => {
      this.playListeningAudio();
    });

    this.optionCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (this.gameState === 'quiz' && !this.isAnswered && this.currentQuestion.type === 'choice') {
          this.setOptionFocus(idx);
          this.selectOption(idx);
        }
      });
    });

    // 학년 탭 클릭 이벤트
    this.gradeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.setGrade(tab.dataset.grade);
      });
    });

    this.startBtn.addEventListener('click', () => this.startNewGame());
    this.micToggleBtn.addEventListener('click', () => {
      this.voiceCommander.toggle();
      window.soundFx.init();
    });
  }

  handleDpadClick(dir) {
    if (this.gameState === 'quiz') {
      if (this.currentQuestion && this.currentQuestion.type === 'choice') {
        this.navigateOptions(dir);
      } else if (this.currentQuestion && this.currentQuestion.type === 'scramble') {
        if (window.scrambleManager) window.scrambleManager.navigate(dir);
      }
    } else if (this.gameState === 'review') {
      this.nextQuestion();
    }
  }

  triggerDpadVisual(btnElement) {
    if (!btnElement) return;
    btnElement.classList.add('active-press');
    setTimeout(() => {
      btnElement.classList.remove('active-press');
    }, 150);
  }

  // 음성 액션 수신 처리 (직접 영어 발음 & 명령어)
  handleVoiceAction(action) {
    console.log('[Voice Action Handled]:', action);
    window.soundFx.init();

    // 학년 변경 음성 명령
    if (action.type === 'changeGrade') {
      this.setGrade(action.grade);
      return;
    }

    // 문법 개념 / 설명 보기 음성 명령 ("설명", "문법", "개념", "공식", "힌트")
    if (action.type === 'concept') {
      this.openConceptModal();
      return;
    }

    // 모달이 열려있을 때 닫기 음성 명령 ("확인", "다음", "선택")
    if (this.isConceptModalOpen) {
      if (action.type === 'confirm' || action.type === 'next') {
        this.closeConceptModal();
        return;
      }
    }

    // 내 목소리 다시 듣기 & 원어민 발음 비교 음성 명령
    if (action.type === 'replayUserVoice') {
      this.playUserRecordedVoice();
      return;
    }
    if (action.type === 'playNativeCompare') {
      this.playNativeComparisonVoice();
      return;
    }

    if (this.gameState === 'ready' || this.gameState === 'finished') {
      if (action.type === 'start' || action.type === 'restart' || action.type === 'confirm') {
        this.startNewGame();
      }
      return;
    }

    if (this.gameState === 'quiz') {
      // 1. 주관식 영어 단어 발음 입력 (스피킹/리스닝 문제)
      if (action.type === 'spokenDirectAnswer') {
        this.submitSpokenAnswer(action.spokenWord, action.isCorrect);
        return;
      }

      // 2. 리스닝 다시 듣기 요청
      if (action.type === 'replayAudio') {
        this.playListeningAudio();
        return;
      }

      // 3. 선택형 문제 보기 선택 (영어 발음 또는 번호)
      if (action.type === 'selectOption') {
        if (this.currentQuestion.type === 'choice') {
          this.setOptionFocus(action.index);
          this.selectOption(action.index);
        }
        return;
      }

      if (action.type === 'nav') {
        if (this.currentQuestion.type === 'choice') {
          this.navigateOptions(action.dir);
        } else if (this.currentQuestion.type === 'scramble') {
          if (window.scrambleManager) window.scrambleManager.navigate(action.dir);
        }
        return;
      }

      if (action.type === 'confirm') {
        this.confirmSelection();
      }
    } else if (this.gameState === 'review') {
      if (action.type === 'next' || action.type === 'confirm') {
        this.nextQuestion();
      }
    }
  }

  navigateOptions(dir) {
    let nextIdx = this.focusedOption;

    if (dir === 'up') {
      if (this.focusedOption === 2) nextIdx = 0;
      else if (this.focusedOption === 3) nextIdx = 1;
      else if (this.focusedOption === 0 || this.focusedOption === 1) nextIdx = -1; // 1번/2번에서 위(▲)로 누르면 상단 [📖 핵심 문법 개념] 버튼으로 이동!
    } else if (dir === 'down') {
      if (this.focusedOption === -1) {
        if (this.currentQuestion && this.currentQuestion.type === 'scramble') {
          this.setOptionFocus(null);
          if (window.scrambleManager) window.scrambleManager.focusCurrentBlock();
          return;
        }
        nextIdx = 0; // 선택형일 때 1번 보기로 복귀!
      }
      else if (this.focusedOption === 0) nextIdx = 2;
      else if (this.focusedOption === 1) nextIdx = 3;
    } else if (dir === 'left') {
      if (this.focusedOption === 1) nextIdx = 0;
      else if (this.focusedOption === 3) nextIdx = 2;
    } else if (dir === 'right') {
      if (this.focusedOption === 0) nextIdx = 1;
      else if (this.focusedOption === 2) nextIdx = 3;
    }

    if (nextIdx !== this.focusedOption) {
      window.soundFx.playMove();
      this.setOptionFocus(nextIdx);
    }
  }

  setOptionFocus(idx) {
    this.focusedOption = idx;
    this.optionCards.forEach((card, i) => {
      card.classList.toggle('focused', i === idx);
    });
    this.shortcutChips.forEach((chip, i) => {
      if (chip) chip.classList.toggle('active', i === idx);
    });

    // 상단 [📖 핵심 문법 개념] 버튼 포커스 스타일 동기화
    if (this.conceptGuideBtn) {
      this.conceptGuideBtn.classList.toggle('focused', idx === -1);
      if (idx === -1) {
        this.conceptGuideBtn.focus();
      }
    }
  }

  confirmSelection() {
    if (this.isConceptModalOpen) {
      this.closeConceptModal();
      return;
    }

    if (this.gameState === 'quiz' && !this.isAnswered) {
      // 상단 [📖 핵심 문법 개념] 버튼에 포커스된 상태에서 리모컨 OK 누르면 모달 열기!
      if (this.focusedOption === -1) {
        this.openConceptModal();
        return;
      }

      if (this.currentQuestion.type === 'choice') {
        this.selectOption(this.focusedOption);
      } else if (this.currentQuestion.type === 'scramble') {
        if (window.scrambleManager) window.scrambleManager.handleOk();
      } else if (this.currentQuestion.type === 'listening') {
        this.playListeningAudio();
      }
    } else if (this.gameState === 'review') {
      this.nextQuestion();
    }
  }

  // 무한 자동 생성기(grammarGenerator)를 통한 10문제 생성 (어순 배열 포함)
  buildQuestionSet() {
    let set = [];
    if (window.grammarGenerator) {
      set = window.grammarGenerator.generateSet(this.TOTAL_QUESTIONS, this.wrongQuestions, this.currentGrade);
    }
    // 첫 번째 문제와 5번째 문제를 'scramble'(어순 배열 블록 스왑)으로 출제하여 바로 테스트 가능하게 함
    if (set.length > 0) {
      set[0].type = 'scramble';
      if (set.length > 4) set[4].type = 'scramble';
    }
    return set;
  }

  startNewGame() {
    this.score = 0;
    this.streak = 0;
    this.correctCount = 0;
    this.currentIndex = 0;
    this.p1Score = 0;
    this.p2Score = 0;
    this.currentTurnPlayer = 1;
    this.updateBattleHUD();

    // 실시간 무한 조합 문제 세트 생성
    this.questions = this.buildQuestionSet();
    this.gameOverlay.classList.remove('active');
    window.soundFx.playCorrect();

    if (this.voiceCommander.isSupported && !this.voiceCommander.isListening) {
      this.voiceCommander.start();
    }

    this.updateProgressHUD();
    this.loadQuestion();
  }

  // 문제 화면 로드
  loadQuestion() {
    this.gameState = 'quiz';
    this.isAnswered = false;
    this.timeLeft = this.QUESTION_TIME;

    const q = this.currentQuestion;
    const isWrongReview = this.wrongQuestions.some(wq => wq.sentence === q.sentence);

    this.qNumText.textContent = `${this.currentIndex + 1} / ${this.questions.length}`;
    this.scoreText.textContent = this.score;
    this.streakText.textContent = `${this.streak} 🔥`;
    this.updateProgressHUD();
    this.updateBattleHUD();

    if (isWrongReview) {
      this.categoryTag.innerHTML = `${q.category} <span style="color: var(--accent-red); font-size: 13px; margin-left: 8px;">[오답 복습 🔄]</span>`;
    } else {
      this.categoryTag.textContent = q.category;
    }

    // 문장 렌더링
    const displaySentence = q.displaySentence || q.sentence;
    const blankHtml = displaySentence.replace('_____', `<span class="blank-box" id="activeBlank">[ ? ]</span>`);
    this.targetSentence.innerHTML = blankHtml;
    this.sentenceTranslation.textContent = `"${q.translation}"`;

    // 비주얼 일러스트 & 상황 단서 렌더링
    if (window.visualClueManager && this.visualClueStage) {
      window.visualClueManager.renderInto(this.visualClueStage, q);
    }

    this.explanationBox.classList.remove('active');
    if (this.shadowResultBox) this.shadowResultBox.style.display = 'none';

    // 이전 녹음 오디오 객체 및 메모리 해제
    if (this.currentUserAudio) {
      try { this.currentUserAudio.pause(); } catch (e) {}
      this.currentUserAudio = null;
    }
    if (this.currentUserAudioUrl) {
      URL.revokeObjectURL(this.currentUserAudioUrl);
      this.currentUserAudioUrl = null;
    }
    if (this.playUserVoiceBtn) {
      this.playUserVoiceBtn.classList.remove('playing', 'ready');
    }
    if (this.playUserVoiceText) {
      this.playUserVoiceText.textContent = '내 목소리 다시 듣기';
    }

    // === 유형별 화면 세팅 ===
    if (q.type === 'choice') {
      // 1. 4지선다 선택형
      if (this.heroQuestionShowcase) this.heroQuestionShowcase.style.display = 'flex';
      this.optionsGrid.style.display = 'grid';
      this.speechStageWrap.style.display = 'none';
      if (this.scrambleStageWrap) this.scrambleStageWrap.style.display = 'none';

      q.options.forEach((optText, i) => {
        this.optionTexts[i].textContent = optText;
        this.optionCards[i].className = 'option-card focusable';
      });
      this.setOptionFocus(0);

    } else if (q.type === 'scramble') {
      // 2. 단어 어순 배열 (Sentence Scramble) 블록 스왑형
      // 상단 정답 노출 방지 및 단어 블록/버튼의 온전한 화면 확보를 위해 쇼케이스 숨김
      if (this.heroQuestionShowcase) this.heroQuestionShowcase.style.display = 'none';
      this.optionsGrid.style.display = 'none';
      this.speechStageWrap.style.display = 'none';
      if (this.scrambleStageWrap) this.scrambleStageWrap.style.display = 'flex';

      if (window.scrambleManager) {
        window.scrambleManager.initQuestion(q, (isCorrect, assembled) => {
          this.handleScrambleComplete(isCorrect, assembled);
        });
      }

    } else if (q.type === 'speaking') {
      // 3. 보기가 없는 주관식 말하기형
      if (this.heroQuestionShowcase) this.heroQuestionShowcase.style.display = 'flex';
      this.optionsGrid.style.display = 'none';
      this.speechStageWrap.style.display = 'flex';
      if (this.scrambleStageWrap) this.scrambleStageWrap.style.display = 'none';
      this.audioListenBtn.style.display = 'none';
      this.speakingHintBox.style.display = 'block';
      this.speakingHintBox.textContent = q.hint || '영어 단어를 직접 마이크에 말하세요!';
      this.speechInstruction.textContent = '🎙️ 보기가 없습니다! 정답 단어를 영어로 직접 발음하세요.';
      this.speechLiveHeard.textContent = '마이크에 답을 말해보세요...';

    } else if (q.type === 'listening') {
      // 4. 듣고 답하는 리스닝 평가형
      if (this.heroQuestionShowcase) this.heroQuestionShowcase.style.display = 'flex';
      this.optionsGrid.style.display = 'none';
      this.speechStageWrap.style.display = 'flex';
      if (this.scrambleStageWrap) this.scrambleStageWrap.style.display = 'none';
      this.audioListenBtn.style.display = 'flex';
      this.speakingHintBox.style.display = 'none';
      this.speechInstruction.textContent = '🔊 원어민 소리를 듣고 빠진 단어를 영어로 말하세요!';
      this.speechLiveHeard.textContent = '마이크에 답을 말해보세요...';

      // 문제 로드 즉시 원어민 TTS 자동 발음 1회 재생!
      setTimeout(() => {
        this.playListeningAudio();
      }, 300);
    }

    this.startTimer();
  }

  // 원어민 영어 TTS 오디오 재생
  playListeningAudio() {
    const q = this.currentQuestion;
    if (!q || !q.audioText) return;

    this.audioListenBtn.classList.add('playing');
    this.audioBtnCaption.textContent = '원어민 발음 재생 중... 🔊';

    window.soundFx.speakEnglish(
      q.audioText,
      null,
      () => {
        this.audioListenBtn.classList.remove('playing');
        this.audioBtnCaption.textContent = '원어민 발음 다시 듣기 (OK / "다시 들려줘")';
      }
    );
  }

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.updateTimerUI();

    this.timer = setInterval(() => {
      this.timeLeft -= 1;
      this.updateTimerUI();

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.timeOut();
      }
    }, 1000);
  }

  updateTimerUI() {
    const percent = Math.max(0, (this.timeLeft / this.QUESTION_TIME) * 100);
    this.timerBar.style.width = `${percent}%`;
    this.timerNumber.textContent = `${this.timeLeft}s`;

    if (this.timeLeft <= 5) {
      this.timerBar.style.backgroundColor = 'var(--accent-red)';
    } else if (this.timeLeft <= 10) {
      this.timerBar.style.backgroundColor = 'var(--accent-gold)';
    } else {
      this.timerBar.style.backgroundColor = 'var(--accent-cyan)';
    }
  }

  // 주관식 말하기/듣기 단어 발음 제출 처리
  submitSpokenAnswer(spokenWord, isCorrect) {
    if (this.isAnswered || this.gameState !== 'quiz') return;
    this.isAnswered = true;
    this.gameState = 'review';
    if (this.timer) clearInterval(this.timer);

    const q = this.currentQuestion;
    const target = q.answerWord || q.missingWord || (q.options ? q.options[q.answer] : '');
    const blank = document.getElementById('activeBlank');

    if (this.speechLiveHeard) {
      this.speechLiveHeard.textContent = `인식된 발음: "${spokenWord}"`;
    }

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      this.totalSolvedCount++;
      // 오답 목록에서 해결된 문제 제거
      this.wrongQuestions = this.wrongQuestions.filter(wq => wq.sentence !== q.sentence);
      this.saveStorageArray('GRAMMAR_WRONG_QUESTIONS', this.wrongQuestions);
      localStorage.setItem('GRAMMAR_TOTAL_SOLVED', this.totalSolvedCount.toString());
      this.updateProgressHUD();

      const timeBonus = this.timeLeft * 5;
      const streakBonus = Math.max(0, (this.streak - 1) * 30);
      const earned = 120 + timeBonus + streakBonus;
      this.addScore(earned);

      if (blank) {
        blank.textContent = target;
        blank.style.color = 'var(--accent-green)';
        blank.style.borderColor = 'var(--accent-green)';
        blank.style.boxShadow = '0 0 20px var(--accent-green)';
      }

      if (window.visualClueManager) {
        window.visualClueManager.triggerSuccessReaction();
      }

      if (this.streak >= 3) {
        window.soundFx.playCombo();
      } else {
        window.soundFx.playCorrect();
      }

      this.expResultBadge.className = 'exp-badge correct';
      const playerText = this.isBattleMode ? `[${this.currentTurnPlayer}P] ` : '';
      this.expResultBadge.textContent = `${playerText}정답 발음 성공! 🎙️ (+${earned}점)`;
    } else {
      this.streak = 0;
      if (!this.wrongQuestions.some(wq => wq.sentence === q.sentence)) {
        this.wrongQuestions.push(q);
      }
      this.saveStorageArray('GRAMMAR_WRONG_QUESTIONS', this.wrongQuestions);
      this.updateProgressHUD();

      if (blank) {
        blank.textContent = target;
        blank.style.color = 'var(--accent-red)';
        blank.style.borderColor = 'var(--accent-red)';
      }

      window.soundFx.playWrong();
      this.expResultBadge.className = 'exp-badge wrong';
      const playerText = this.isBattleMode ? `[${this.currentTurnPlayer}P] ` : '';
      this.expResultBadge.textContent = `${playerText}오답! (정답: "${target}") 다음 판에 다시 도전 🔄`;
    }

    this.scoreText.textContent = this.score;
    this.streakText.textContent = `${this.streak} 🔥`;
    this.expContent.textContent = q.explanation;
    this.explanationBox.classList.add('active');

    // 정답 확인 시 완성 문장 전체를 원어민 음성으로 자동 읽어줌!
    this.speakCorrectSentence(400);
  }

  // 선택형 문제에서 보기 번호/클릭 선택
  selectOption(chosenIndex) {
    if (this.isAnswered || this.gameState !== 'quiz') return;
    this.isAnswered = true;
    this.gameState = 'review';
    if (this.timer) clearInterval(this.timer);

    const q = this.currentQuestion;
    const isCorrect = chosenIndex === q.answer;
    const blank = document.getElementById('activeBlank');

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      this.totalSolvedCount++;
      this.wrongQuestions = this.wrongQuestions.filter(wq => wq.sentence !== q.sentence);
      this.saveStorageArray('GRAMMAR_WRONG_QUESTIONS', this.wrongQuestions);
      localStorage.setItem('GRAMMAR_TOTAL_SOLVED', this.totalSolvedCount.toString());
      this.updateProgressHUD();
      
      const timeBonus = this.timeLeft * 5;
      const streakBonus = Math.max(0, (this.streak - 1) * 30);
      const earned = 100 + timeBonus + streakBonus;
      this.addScore(earned);

      this.optionCards[chosenIndex].classList.add('correct-choice');
      if (blank) {
        blank.textContent = q.options[chosenIndex];
        blank.style.color = 'var(--accent-green)';
        blank.style.borderColor = 'var(--accent-green)';
        blank.style.boxShadow = '0 0 20px var(--accent-green)';
      }

      if (window.visualClueManager) {
        window.visualClueManager.triggerSuccessReaction();
      }

      if (this.streak >= 3) {
        window.soundFx.playCombo();
      } else {
        window.soundFx.playCorrect();
      }

      this.expResultBadge.className = 'exp-badge correct';
      const playerText = this.isBattleMode ? `[${this.currentTurnPlayer}P] ` : '';
      this.expResultBadge.textContent = `${playerText}정답! ✅ (+${earned}점)`;
    } else {
      this.streak = 0;
      if (!this.wrongQuestions.some(wq => wq.sentence === q.sentence)) {
        this.wrongQuestions.push(q);
      }
      this.saveStorageArray('GRAMMAR_WRONG_QUESTIONS', this.wrongQuestions);
      this.updateProgressHUD();

      this.optionCards[chosenIndex].classList.add('wrong-choice');
      this.optionCards[q.answer].classList.add('correct-choice');

      if (blank) {
        blank.textContent = q.options[q.answer];
        blank.style.color = 'var(--accent-red)';
        blank.style.borderColor = 'var(--accent-red)';
      }

      window.soundFx.playWrong();
      this.expResultBadge.className = 'exp-badge wrong';
      const playerText = this.isBattleMode ? `[${this.currentTurnPlayer}P] ` : '';
      this.expResultBadge.textContent = `${playerText}오답! 다음 판에 다시 출제됩니다 🔄`;
    }

    this.scoreText.textContent = this.score;
    this.streakText.textContent = `${this.streak} 🔥`;
    this.expContent.textContent = q.explanation;
    this.explanationBox.classList.add('active');

    // 정답 확인 시 완성 문장 전체를 원어민 음성으로 자동 읽어줌!
    this.speakCorrectSentence(400);
  }

  // 1. 단어 어순 배열 (Sentence Scramble) 완성 결과 처리
  handleScrambleComplete(isCorrect, assembled) {
    if (this.isAnswered || this.gameState !== 'quiz') return;
    this.isAnswered = true;
    this.gameState = 'review';
    if (this.timer) clearInterval(this.timer);

    const q = this.currentQuestion;
    const blank = document.getElementById('activeBlank');

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      this.totalSolvedCount++;
      this.wrongQuestions = this.wrongQuestions.filter(wq => wq.sentence !== q.sentence);
      this.saveStorageArray('GRAMMAR_WRONG_QUESTIONS', this.wrongQuestions);
      localStorage.setItem('GRAMMAR_TOTAL_SOLVED', this.totalSolvedCount.toString());
      this.updateProgressHUD();

      const timeBonus = this.timeLeft * 6;
      const streakBonus = Math.max(0, (this.streak - 1) * 30);
      const earned = 150 + timeBonus + streakBonus;
      this.addScore(earned);

      if (blank) {
        blank.textContent = q.answerWord || '완성';
        blank.style.color = 'var(--accent-green)';
        blank.style.borderColor = 'var(--accent-green)';
        blank.style.boxShadow = '0 0 20px var(--accent-green)';
      }

      if (window.visualClueManager) {
        window.visualClueManager.triggerSuccessReaction();
      }

      window.soundFx.playCorrect();
      this.expResultBadge.className = 'exp-badge correct';
      const playerText = this.isBattleMode ? `[${this.currentTurnPlayer}P] ` : '';
      this.expResultBadge.textContent = `${playerText}어순 완성 대성공! 🧩 (+${earned}점)`;

    } else {
      this.streak = 0;
      if (!this.wrongQuestions.some(wq => wq.sentence === q.sentence)) {
        this.wrongQuestions.push(q);
      }
      this.saveStorageArray('GRAMMAR_WRONG_QUESTIONS', this.wrongQuestions);
      this.updateProgressHUD();

      window.soundFx.playWrong();
      this.expResultBadge.className = 'exp-badge wrong';
      const playerText = this.isBattleMode ? `[${this.currentTurnPlayer}P] ` : '';
      this.expResultBadge.textContent = `${playerText}순서가 틀렸습니다! 🔄 올바른 문장을 확인해보세요.`;
    }

    this.scoreText.textContent = this.score;
    this.streakText.textContent = `${this.streak} 🔥`;
    this.expContent.textContent = q.explanation;
    this.explanationBox.classList.add('active');

    // 정답 확인 시 완성 문장 전체를 원어민 음성으로 자동 읽어줌!
    this.speakCorrectSentence(400);
  }

  // 2. 점수 가산 & 2인 배틀 모드 스코어 관리
  addScore(earned) {
    this.score += earned;
    if (this.isBattleMode) {
      if (this.currentTurnPlayer === 1) {
        this.p1Score += earned;
      } else {
        this.p2Score += earned;
      }
      this.updateBattleHUD();
    }
  }

  updateBattleHUD() {
    if (!this.battleScoreboard) return;
    this.p1ScoreEl.textContent = this.p1Score;
    this.p2ScoreEl.textContent = this.p2Score;
    if (this.isBattleMode) {
      this.p1Tag.classList.toggle('active-turn', this.currentTurnPlayer === 1);
      this.p2Tag.classList.toggle('active-turn', this.currentTurnPlayer === 2);
    }
  }

  toggleBattleMode() {
    this.isBattleMode = !this.isBattleMode;
    this.modeToggleText.textContent = this.isBattleMode ? '2인 대전 ON ⚔️' : '1인 솔로';
    this.battleScoreboard.style.display = this.isBattleMode ? 'flex' : 'none';
    window.soundFx.playCorrect();
    this.startNewGame();
  }

  // 3. 문장 전체 섀도잉 & 발음 점수 평가 엔진 + 학생 실제 음성 녹음 (MediaRecorder)
  async startShadowRecording() {
    // 이미 녹음 중인 상태에서 버튼을 다시 누르면 녹음 완료 처리!
    if (this.isShadowRecording) {
      this.stopShadowRecording();
      return;
    }

    // 전역 음성인식기 일시 중지 (마이크 독점 충돌 방지)
    if (this.voiceCommander) {
      this.voiceCommander.stop();
    }

    const q = this.currentQuestion;
    const targetFull = (q.audioText || q.full || q.sentence.replace('_____', q.answerWord)).replace(/[.?!]/g, '').trim().toLowerCase();

    this.isShadowRecording = true;
    this.audioChunks = [];
    this.shadowRecordBtn.classList.add('recording');
    this.shadowRecordBtn.innerHTML = '<span>⏹️ 녹음 중... (다 읽고 클릭 시 완료)</span>';

    // 1. 마이크 스트림 획득 & MediaRecorder 세팅
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
            if (this.shadowResultBox) {
              this.shadowResultBox.style.display = 'flex';
            }
          }
        };

        this.mediaRecorder.start(100);
      }
    } catch (err) {
      console.warn('MediaRecorder 오디오 녹음 스트림 접근 불가:', err);
    }

    // 2. 음성 인식기 (SpeechRecognition) 시작
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.shadowRecognizer = new SpeechRecognition();
        this.shadowRecognizer.lang = 'en-US';
        this.shadowRecognizer.interimResults = false;
        this.shadowRecognizer.maxAlternatives = 1;

        this.shadowRecognizer.onresult = (e) => {
          const heard = e.results[0][0].transcript.toLowerCase().trim();
          const score = this.calculateSimilarity(heard, targetFull);
          this.stopShadowRecording(score, heard);
        };

        this.shadowRecognizer.onerror = (e) => {
          console.warn('[Shadow STT Error]:', e);
          if (this.isShadowRecording) {
            this.stopShadowRecording();
          }
        };

        this.shadowRecognizer.onend = () => {
          if (this.isShadowRecording) {
            this.stopShadowRecording();
          }
        };

        this.shadowRecognizer.start();
      } catch (e) {
        console.warn('SpeechRecognition 시작 오류:', e);
      }
    }
  }

  // 섀도잉 녹음 종료 처리
  stopShadowRecording(score = null, heard = '') {
    if (!this.isShadowRecording) return;
    this.isShadowRecording = false;

    this.shadowRecordBtn.classList.remove('recording');
    this.shadowRecordBtn.innerHTML = '<span>🎙️ 다시 따라 말하기</span>';

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

    // 4. 전역 음성 인식기 복구
    setTimeout(() => {
      if (this.voiceCommander && !this.voiceCommander.isListening) {
        this.voiceCommander.start();
      }
    }, 400);

    // 5. 결과 UI 표시
    this.shadowResultBox.style.display = 'flex';
    if (score !== null) {
      this.shadowScoreNumber.textContent = `발음 정확도: ${score}점`;
      this.shadowHeardText.textContent = `인식된 발음: "${heard}"`;
      if (score >= 90) {
        this.shadowScoreStars.textContent = '⭐⭐⭐ (원어민 수준!)';
        window.soundFx.playCombo();
      } else if (score >= 70) {
        this.shadowScoreStars.textContent = '⭐⭐ (훌륭해요!)';
        window.soundFx.playCorrect();
      } else {
        this.shadowScoreStars.textContent = '⭐ (조금 더 또박또박!)';
        window.soundFx.playWrong();
      }
    } else {
      this.shadowScoreStars.textContent = '🎙️ 녹음 완료!';
      this.shadowScoreNumber.textContent = '내 목소리 확인';
      this.shadowHeardText.textContent = '녹음이 저장되었습니다. 옆의 [내 목소리 다시 듣기]를 눌러보세요!';
      window.soundFx.playCorrect();
    }

    // 6. [내 목소리 다시 듣기] 버튼으로 자동 포커스
    setTimeout(() => {
      if (this.playUserVoiceBtn) {
        this.playUserVoiceBtn.classList.add('ready');
        this.playUserVoiceBtn.focus();
      }
    }, 300);
  }

  // 방금 녹음된 사용자 실제 목소리 재생
  playUserRecordedVoice() {
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

    const resetBtnState = () => {
      if (this.playUserVoiceBtn) this.playUserVoiceBtn.classList.remove('playing');
      if (this.playUserVoiceText) this.playUserVoiceText.textContent = '내 목소리 다시 듣기';
    };

    this.currentUserAudio.onended = resetBtnState;
    this.currentUserAudio.onerror = resetBtnState;

    this.currentUserAudio.play().catch(e => {
      console.warn('사용자 녹음 오디오 재생 실패:', e);
      resetBtnState();
    });
  }

  // 원어민 발음 비교 재생
  playNativeComparisonVoice() {
    if (this.currentUserAudio) {
      this.currentUserAudio.pause();
      if (this.playUserVoiceBtn) this.playUserVoiceBtn.classList.remove('playing');
      if (this.playUserVoiceText) this.playUserVoiceText.textContent = '내 목소리 다시 듣기';
    }

    const q = this.currentQuestion;
    if (!q) return;

    let fullText = q.audioText || q.full;
    if (!fullText) {
      const ans = q.answerWord || (q.options ? q.options[q.answer] : '');
      fullText = q.sentence.replace('_____', ans);
    }
    fullText = fullText.trim();
    if (!fullText.endsWith('.') && !fullText.endsWith('?') && !fullText.endsWith('!')) {
      fullText += '.';
    }

    if (window.soundFx) {
      window.soundFx.speakEnglish(fullText);
    }
  }

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

  timeOut() {
    if (this.isAnswered) return;
    this.isAnswered = true;
    this.gameState = 'review';
    this.streak = 0;
    this.streakText.textContent = '0 🔥';

    const q = this.currentQuestion;
    if (!this.wrongQuestions.some(wq => wq.sentence === q.sentence)) {
      this.wrongQuestions.push(q);
    }
    this.saveStorageArray('GRAMMAR_WRONG_QUESTIONS', this.wrongQuestions);
    this.updateProgressHUD();

    window.soundFx.playWrong();

    if (q.type === 'choice' && this.optionCards[q.answer]) {
      this.optionCards[q.answer].classList.add('correct-choice');
    }

    const blank = document.getElementById('activeBlank');
    const target = q.answerWord || q.missingWord || (q.options ? q.options[q.answer] : '');
    if (blank) {
      blank.textContent = target;
      blank.style.color = 'var(--accent-green)';
      blank.style.borderBottomColor = 'var(--accent-green)';
    }

    this.expResultBadge.className = 'exp-badge wrong';
    this.expResultBadge.textContent = '시간 초과! ⏰ (다음 판에 다시 복습합니다)';
    this.expContent.textContent = q.explanation;
    this.explanationBox.classList.add('active');

    // 시간 초과 시에도 정답 문장을 원어민 음성으로 읽어주어 귀로 기억하게 함!
    this.speakCorrectSentence(400);
  }

  // ========================================================
  // 핵심 문법 개념 카드 (Grammar Cheat Sheet) 모달 제어
  // ========================================================
  openConceptModal(question) {
    const q = question || this.currentQuestion;
    if (!q) return;

    if (!window.grammarConceptData || !window.grammarConceptData.getConceptForQuestion) {
      console.warn('grammarConceptData가 아직 로드되지 않았습니다.');
      return;
    }

    const data = window.grammarConceptData.getConceptForQuestion(q);
    if (!data) return;

    if (this.conceptGradeBadge) {
      this.conceptGradeBadge.textContent = data.gradeBadge || '문법 핵심';
    }
    if (this.conceptTitle) {
      this.conceptTitle.textContent = data.title;
    }
    if (this.conceptFormula) {
      this.conceptFormula.textContent = data.formula;
    }
    if (this.conceptUsage) {
      this.conceptUsage.textContent = data.usage;
    }

    // 핵심 규칙 리스트
    if (this.conceptRulesList) {
      this.conceptRulesList.innerHTML = '';
      if (Array.isArray(data.rules)) {
        data.rules.forEach(rule => {
          const li = document.createElement('li');
          li.textContent = rule;
          this.conceptRulesList.appendChild(li);
        });
      }
    }

    // 단골 시험 함정
    if (data.trap) {
      if (this.conceptTrapWrong) this.conceptTrapWrong.textContent = data.trap.wrong || '';
      if (this.conceptTrapCorrect) this.conceptTrapCorrect.textContent = data.trap.correct || '';
    }

    // 대표 예문
    if (this.conceptExamplesList) {
      this.conceptExamplesList.innerHTML = '';
      if (Array.isArray(data.examples)) {
        data.examples.forEach(ex => {
          const li = document.createElement('li');
          li.textContent = ex;
          this.conceptExamplesList.appendChild(li);
        });
      }
    }

    if (this.conceptModalOverlay) {
      this.conceptModalOverlay.style.display = 'flex';
    }
    this.isConceptModalOpen = true;

    if (window.soundFx) {
      window.soundFx.playCardFocus();
    }

    // 모달 확인 버튼으로 포커스 이동 (리모컨 OK로 바로 닫을 수 있도록)
    setTimeout(() => {
      if (this.conceptOkBtn) {
        this.conceptOkBtn.focus();
      }
    }, 60);
  }

  closeConceptModal() {
    if (!this.conceptModalOverlay) return;
    this.conceptModalOverlay.style.display = 'none';
    this.isConceptModalOpen = false;

    if (window.soundFx) {
      window.soundFx.playButtonPress();
    }

    // 문제 화면으로 포커스 복귀
    if (this.gameState === 'quiz' && this.currentQuestion) {
      if (this.currentQuestion.type === 'choice') {
        const idx = this.selectedOptionIndex >= 0 ? this.selectedOptionIndex : (this.focusedOption >= 0 ? this.focusedOption : 0);
        this.setOptionFocus(idx);
      } else if (this.currentQuestion.type === 'scramble') {
        if (window.scrambleManager) window.scrambleManager.focusCurrentBlock();
      }
    }
  }

  // ========================================================
  // 정답 확인 시 완성된 영어 문장 전체를 또렷하게 읽어주는 메소드
  // ========================================================
  speakCorrectSentence(delay = 400) {
    const q = this.currentQuestion;
    if (!q) return;

    // 문장의 정답 완성형 텍스트 도출
    let fullText = q.audioText || q.full;
    if (!fullText) {
      const ans = q.answerWord || (q.options ? q.options[q.answer] : '');
      fullText = q.sentence.replace('_____', ans);
    }

    // 마침표나 물음표 등 구두점 정돈
    fullText = fullText.trim();
    if (!fullText.endsWith('.') && !fullText.endsWith('?') && !fullText.endsWith('!')) {
      fullText += '.';
    }

    // 효과음(딩동댕/버저)과 겹치지 않게 약간의 지연 후 낭독!
    setTimeout(() => {
      if (window.soundFx) {
        window.soundFx.speakEnglish(
          fullText,
          () => {
            // 낭독 시작 시 문장에 부드러운 네온 하이라이트 점등
            const targetEl = document.getElementById('targetSentence');
            if (targetEl) targetEl.classList.add('tts-reading');
          },
          () => {
            // 낭독 종료 시 하이라이트 해제
            const targetEl = document.getElementById('targetSentence');
            if (targetEl) targetEl.classList.remove('tts-reading');
          }
        );
      }
    }, delay);
  }

  nextQuestion() {
    this.currentIndex++;
    if (this.isBattleMode) {
      // 턴 교체
      this.currentTurnPlayer = this.currentTurnPlayer === 1 ? 2 : 1;
      this.updateBattleHUD();
    }

    if (this.currentIndex >= this.questions.length) {
      this.showFinalReport();
    } else {
      this.loadQuestion();
    }
  }

  showFinalReport() {
    this.gameState = 'finished';
    if (this.timer) clearInterval(this.timer);

    window.soundFx.playVictory();

    const percent = Math.round((this.correctCount / this.questions.length) * 100);
    const wrongCount = this.wrongQuestions.length;

    let grade = 'A+';
    let icon = '🏆';

    if (this.isBattleMode) {
      const winner = this.p1Score > this.p2Score ? '1P (BLUE)' : (this.p2Score > this.p1Score ? '2P (RED)' : '공동 무승부');
      icon = '⚔️';
      this.overlayIcon.textContent = icon;
      this.overlayTitle.textContent = `2인 대전 종료: ${winner} 승리!`;
      this.overlayDesc.innerHTML = `
        <div style="font-size: 22px; margin-bottom: 12px;">
          <span style="color: var(--accent-cyan); font-weight: 900;">1P: ${this.p1Score}점</span> VS 
          <span style="color: #ff3366; font-weight: 900;">2P: ${this.p2Score}점</span>
        </div>
        온 가족과 함께 총 <strong>${this.questions.length}</strong>문제를 멋지게 완료했습니다!<br>
        누적 해결한 영문법 문제: <strong style="color: var(--accent-cyan); font-size: 20px;">총 ${this.totalSolvedCount}개</strong>
      `;
    } else {
      if (percent >= 90) {
        grade = 'MASTER (A+)';
        icon = '👑';
      } else if (percent >= 70) {
        grade = 'EXCELLENT (A)';
        icon = '🌟';
      } else if (percent >= 50) {
        grade = 'GOOD (B)';
        icon = '👍';
      } else {
        grade = 'TRY AGAIN (C)';
        icon = '💪';
      }

      this.overlayIcon.textContent = icon;
      this.overlayTitle.textContent = `무한 퀘스트 완료: ${grade}`;
      this.overlayDesc.innerHTML = `
        이번 라운드: <strong>${this.questions.length}</strong>문제 중 <strong>${this.correctCount}</strong>문제 정답! (${percent}%)<br>
        누적 해결한 영문법 문제: <strong style="color: var(--accent-cyan); font-size: 20px;">총 ${this.totalSolvedCount}개</strong><br>
        <span style="color: var(--accent-red); font-size: 14px;">
          ${wrongCount > 0 ? `⚠️ 틀린 문제 ${wrongCount}개는 다음 게임에 최우선 다시 출제됩니다.` : '🎉 현재 누적된 오답이 없습니다!'}
        </span><br>
        획득 점수: <span style="color: var(--accent-gold); font-size: 24px; font-weight: 800;">${this.score}점</span>
      `;
    }

    this.startBtnText.textContent = '새로운 문장 생성 & 도전 (OK / "시작")';
    this.gameOverlay.classList.add('active');
    this.startBtn.focus();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new GrammarQuestGame();
});
