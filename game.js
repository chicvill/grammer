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

      if (this.gameState === 'ready' || this.gameState === 'finished') {
        if (key === 'Enter' || key === ' ') {
          this.startNewGame();
        }
        return;
      }

      if (this.gameState === 'quiz') {
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
        } else if (q.type === 'listening') {
          // 리스닝 문제일 때 Enter 누르면 다시 듣기 재생
          if (key === 'Enter' || key === ' ') {
            this.playListeningAudio();
          }
        }
      } else if (this.gameState === 'review') {
        if (['Enter', 'ArrowRight', 'ArrowDown', ' '].includes(key)) {
          this.triggerDpadVisual(this.btnOk);
          this.nextQuestion();
        }
      }
    });

    this.btnUp.addEventListener('click', () => this.handleDpadClick('up'));
    this.btnDown.addEventListener('click', () => this.handleDpadClick('down'));
    this.btnLeft.addEventListener('click', () => this.handleDpadClick('left'));
    this.btnRight.addEventListener('click', () => this.handleDpadClick('right'));
    this.btnOk.addEventListener('click', () => this.confirmSelection());

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
    } else if (dir === 'down') {
      if (this.focusedOption === 0) nextIdx = 2;
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
      chip.classList.toggle('active', i === idx);
    });
  }

  confirmSelection() {
    if (this.gameState === 'quiz' && !this.isAnswered) {
      if (this.currentQuestion.type === 'choice') {
        this.selectOption(this.focusedOption);
      } else if (this.currentQuestion.type === 'listening') {
        this.playListeningAudio();
      }
    } else if (this.gameState === 'review') {
      this.nextQuestion();
    }
  }

  // 무한 자동 생성기(grammarGenerator)를 통한 10문제 생성 (학년별 맞춤)
  buildQuestionSet() {
    if (window.grammarGenerator) {
      return window.grammarGenerator.generateSet(this.TOTAL_QUESTIONS, this.wrongQuestions, this.currentGrade);
    }
    return [];
  }

  startNewGame() {
    this.score = 0;
    this.streak = 0;
    this.correctCount = 0;
    this.currentIndex = 0;

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

    // === 유형별 화면 세팅 ===
    if (q.type === 'choice') {
      // 1. 4지선다 선택형
      this.optionsGrid.style.display = 'grid';
      this.speechStageWrap.style.display = 'none';

      q.options.forEach((optText, i) => {
        this.optionTexts[i].textContent = optText;
        this.optionCards[i].className = 'option-card focusable';
      });
      this.setOptionFocus(0);

    } else if (q.type === 'speaking') {
      // 2. 보기가 없는 주관식 말하기형
      this.optionsGrid.style.display = 'none';
      this.speechStageWrap.style.display = 'flex';
      this.audioListenBtn.style.display = 'none';
      this.speakingHintBox.style.display = 'block';
      this.speakingHintBox.textContent = q.hint || '영어 단어를 직접 마이크에 말하세요!';
      this.speechInstruction.textContent = '🎙️ 보기가 없습니다! 정답 단어를 영어로 직접 발음하세요.';
      this.speechLiveHeard.textContent = '마이크에 답을 말해보세요...';

    } else if (q.type === 'listening') {
      // 3. 듣고 답하는 리스닝 평가형
      this.optionsGrid.style.display = 'none';
      this.speechStageWrap.style.display = 'flex';
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
      this.score += earned;

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
      this.expResultBadge.textContent = `정답 발음 성공! 🎙️ (+${earned}점)`;
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
      this.expResultBadge.textContent = `오답! (정답: "${target}") 다음 판에 다시 도전 🔄`;
    }

    this.scoreText.textContent = this.score;
    this.streakText.textContent = `${this.streak} 🔥`;
    this.expContent.textContent = q.explanation;
    this.explanationBox.classList.add('active');
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
      this.score += earned;

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
      this.expResultBadge.textContent = `정답! ✅ (+${earned}점)`;
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
      this.expResultBadge.textContent = `오답! 다음 판에 다시 출제됩니다 🔄`;
    }

    this.scoreText.textContent = this.score;
    this.streakText.textContent = `${this.streak} 🔥`;
    this.expContent.textContent = q.explanation;
    this.explanationBox.classList.add('active');
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
  }

  nextQuestion() {
    this.currentIndex++;
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

    this.startBtnText.textContent = '새로운 문장 생성 & 도전 (OK / "시작")';
    this.gameOverlay.classList.add('active');
    this.startBtn.focus();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new GrammarQuestGame();
});
