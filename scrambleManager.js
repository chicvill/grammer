// ========================================================
// ScrambleManager - 단어 어순 배열 '블록 자리바꾸기(Swap & Slide)' 엔진
// 마우스 드래그 & 드롭 스왑과 리모컨 D-Pad Lift & Swap 인터랙션을 완벽하게 지원합니다.
// ========================================================

class ScrambleManager {
  constructor() {
    this.currentTokens = [];     // 현재 화면에 나열된 단어 배열
    this.correctSentence = "";   // 정답 원문 (공백 제외/소문자 기준 정규화 비교)
    this.correctTokens = [];     // 정답 순서 단어 배열
    this.focusedIndex = 0;       // 리모컨 포커스 위치
    this.liftedIndex = null;     // 리모컨으로 집어 든(Lifted) 단어 인덱스
    this.draggedIndex = null;    // 마우스 드래그 중인 인덱스
    this.onCompleteCallback = null; // 정답 확인 콜백
    this.isLocked = false;       // 문제 완료 후 조작 잠금
  }

  // 문장을 어순 배열용 토큰 덩어리로 분할 (3~6 덩어리)
  tokenizeSentence(sentence) {
    // 마침표, 물음표 등 구두점 분리 보존
    let clean = sentence.trim();
    if (clean.endsWith('.') || clean.endsWith('?')) {
      clean = clean.slice(0, -1);
    }
    const rawWords = clean.split(/\s+/);

    // 단어가 너무 많으면(7개 이상) 의미 단위로 2단어씩 묶어서 4~5개 블록으로 최적화
    if (rawWords.length <= 5) {
      return rawWords;
    }

    const tokens = [];
    let i = 0;
    while (i < rawWords.length) {
      // 주어구나 동사구 등 자연스러운 덩어리 형성
      if (i === 0 && (rawWords[0] === 'Tom' && rawWords[1] === 'and' && rawWords[2] === 'Jerry')) {
        tokens.push('Tom and Jerry');
        i += 3;
      } else if (i === 0 && (rawWords[0] === 'My' && (rawWords[1] === 'brother' || rawWords[1] === 'sister'))) {
        tokens.push(`${rawWords[0]} ${rawWords[1]}`);
        i += 2;
      } else if (rawWords.length - i >= 2 && Math.random() < 0.35 && tokens.length < 4) {
        tokens.push(`${rawWords[i]} ${rawWords[i + 1]}`);
        i += 2;
      } else {
        tokens.push(rawWords[i]);
        i++;
      }
    }
    return tokens;
  }

  // 문제 세팅 및 셔플 초기화
  initQuestion(question, onComplete) {
    this.onCompleteCallback = onComplete;
    this.isLocked = false;
    this.liftedIndex = null;
    this.focusedIndex = 0;

    const fullText = question.audioText || question.full || question.sentence.replace('_____', question.answerWord);
    this.correctSentence = fullText.replace(/[.?!]/g, '').trim().toLowerCase();
    
    const baseTokens = this.tokenizeSentence(fullText);
    this.correctTokens = [...baseTokens];

    // 무작위로 섞되, 처음부터 정답과 같지 않도록 셔플
    let shuffled = [...baseTokens].sort(() => Math.random() - 0.5);
    let attempts = 0;
    while (shuffled.join(' ') === baseTokens.join(' ') && attempts < 10) {
      shuffled = [...baseTokens].sort(() => Math.random() - 0.5);
      attempts++;
    }
    // 그래도 같으면 앞뒤 두 단어 강제 교체
    if (shuffled.join(' ') === baseTokens.join(' ') && shuffled.length > 1) {
      const tmp = shuffled[0];
      shuffled[0] = shuffled[1];
      shuffled[1] = tmp;
    }

    this.currentTokens = shuffled;
    this.renderTrack();
  }

  // 트랙 DOM 렌더링
  renderTrack() {
    const track = document.getElementById('scrambleTrack');
    if (!track) return;

    track.innerHTML = '';

    this.currentTokens.forEach((word, idx) => {
      const block = document.createElement('div');
      block.className = 'scramble-block focusable';
      block.id = `scramble-block-${idx}`;
      block.dataset.index = idx;
      block.draggable = !this.isLocked;

      if (idx === this.focusedIndex) {
        block.classList.add('focused');
      }
      if (idx === this.liftedIndex) {
        block.classList.add('lifted');
      }

      block.innerHTML = `
        <span class="block-num-pill">${idx + 1}</span>
        <span class="block-word-text">${word}</span>
        <span class="block-drag-handle">⠿</span>
      `;

      // 1. 마우스 드래그 앤 드롭 이벤트
      block.addEventListener('dragstart', (e) => this.handleDragStart(e, idx));
      block.addEventListener('dragover', (e) => this.handleDragOver(e, idx));
      block.addEventListener('dragleave', (e) => this.handleDragLeave(e, idx));
      block.addEventListener('drop', (e) => this.handleDrop(e, idx));
      block.addEventListener('dragend', (e) => this.handleDragEnd(e));

      // 2. 마우스 클릭 스왑 이벤트
      block.addEventListener('click', () => this.handleBlockClick(idx));

      track.appendChild(block);
    });

    this.updatePreviewText();
  }

  // 실시간 조립 문장 텍스트 갱신
  updatePreviewText() {
    const preview = document.getElementById('scrambleSentencePreview');
    if (preview) {
      preview.textContent = `"${this.currentTokens.join(' ')}."`;
    }
  }

  // --- 마우스 드래그 & 드롭 스왑 핸들러 ---
  handleDragStart(e, idx) {
    if (this.isLocked) return;
    this.draggedIndex = idx;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx);
    
    const block = document.getElementById(`scramble-block-${idx}`);
    if (block) {
      setTimeout(() => block.classList.add('dragging'), 10);
    }
    if (window.soundFx) window.soundFx.playMove();
  }

  handleDragOver(e, idx) {
    e.preventDefault();
    if (this.isLocked || this.draggedIndex === null || this.draggedIndex === idx) return;
    e.dataTransfer.dropEffect = 'move';

    const targetBlock = document.getElementById(`scramble-block-${idx}`);
    if (targetBlock) {
      targetBlock.classList.add('drag-hover');
    }
  }

  handleDragLeave(e, idx) {
    const targetBlock = document.getElementById(`scramble-block-${idx}`);
    if (targetBlock) {
      targetBlock.classList.remove('drag-hover');
    }
  }

  handleDrop(e, targetIdx) {
    e.preventDefault();
    if (this.isLocked || this.draggedIndex === null) return;

    const fromIdx = this.draggedIndex;
    if (fromIdx !== targetIdx) {
      this.swapTokens(fromIdx, targetIdx);
      if (window.soundFx) window.soundFx.playMove();
    }
    this.clearDragEffects();
  }

  handleDragEnd(e) {
    this.clearDragEffects();
  }

  clearDragEffects() {
    this.draggedIndex = null;
    document.querySelectorAll('.scramble-block').forEach(b => {
      b.classList.remove('dragging', 'drag-hover');
    });
  }

  // --- 마우스 원클릭 스왑 핸들러 ---
  handleBlockClick(idx) {
    if (this.isLocked) return;

    if (this.liftedIndex === null) {
      // 1번째 클릭: 집기(Lift)
      this.liftedIndex = idx;
      this.focusedIndex = idx;
      if (window.soundFx) window.soundFx.playMove();
    } else if (this.liftedIndex === idx) {
      // 같은 블록 다시 클릭: 내려놓기 취소
      this.liftedIndex = null;
      if (window.soundFx) window.soundFx.playMove();
    } else {
      // 다른 블록 클릭: 즉시 맞바꿈(Swap)!
      this.swapTokens(this.liftedIndex, idx);
      this.liftedIndex = null;
      this.focusedIndex = idx;
      if (window.soundFx) window.soundFx.playCorrect();
    }
    this.renderTrack();
  }

  // --- 리모컨 D-Pad 조작 핸들러 ---
  navigate(dir) {
    if (this.isLocked) return;

    if (dir === 'left') {
      if (this.focusedIndex > 0) {
        this.focusedIndex--;
        if (window.soundFx) window.soundFx.playMove();
        this.renderTrack();
      }
    } else if (dir === 'right') {
      if (this.focusedIndex < this.currentTokens.length - 1) {
        this.focusedIndex++;
        if (window.soundFx) window.soundFx.playMove();
        this.renderTrack();
      }
    } else if (dir === 'down') {
      // 아래로 누르면 [완성 확인] 버튼으로 포커스 이동
      const submitBtn = document.getElementById('scrambleSubmitBtn');
      if (submitBtn) submitBtn.focus();
    }
  }

  // 리모컨 [OK] 버튼 클릭: 집기(Lift) 또는 맞바꾸기(Swap)
  handleOk() {
    if (this.isLocked) return;

    if (this.liftedIndex === null) {
      // 현재 포커스된 단어 집어 들기(Lift)
      this.liftedIndex = this.focusedIndex;
      if (window.soundFx) window.soundFx.playMove();
    } else {
      // 이미 집어 든 상태에서 다른 단어 위에서 OK를 누르면 맞바꿈(Swap)!
      if (this.liftedIndex !== this.focusedIndex) {
        this.swapTokens(this.liftedIndex, this.focusedIndex);
        if (window.soundFx) window.soundFx.playCorrect();
      }
      this.liftedIndex = null;
    }
    this.renderTrack();
  }

  // 두 토큰의 위치를 맞바꾸는 핵심 메소드
  swapTokens(idxA, idxB) {
    const temp = this.currentTokens[idxA];
    this.currentTokens[idxA] = this.currentTokens[idxB];
    this.currentTokens[idxB] = temp;
    this.renderTrack();

    // 맞바꾼 직후 정답과 일치하는지 자동 감지
    this.checkAutoMatch();
  }

  // 정답 자동 감지 (맞으면 블록들에 살짝 반짝임 연출)
  checkAutoMatch() {
    const currentSentence = this.currentTokens.join(' ').toLowerCase();
    if (currentSentence === this.correctSentence) {
      const submitBtn = document.getElementById('scrambleSubmitBtn');
      if (submitBtn) {
        submitBtn.classList.add('ready-pulse');
      }
    }
  }

  // 최종 완성 확인 채점
  submitAnswer() {
    if (this.isLocked) return;

    const currentSentence = this.currentTokens.join(' ').toLowerCase();
    const isCorrect = currentSentence === this.correctSentence;

    if (isCorrect) {
      this.isLocked = true;
      document.querySelectorAll('.scramble-block').forEach(b => {
        b.classList.add('correct-glow');
      });
      if (this.onCompleteCallback) {
        this.onCompleteCallback(true, this.currentTokens.join(' '));
      }
    } else {
      // 오답 시 흔들림(Shake) 효과
      const track = document.getElementById('scrambleTrack');
      if (track) {
        track.classList.add('shake-anim');
        setTimeout(() => track.classList.remove('shake-anim'), 600);
      }
      if (window.soundFx) window.soundFx.playWrong();
      if (this.onCompleteCallback) {
        this.onCompleteCallback(false, this.currentTokens.join(' '));
      }
    }
  }

  // 원래대로 다시 섞기
  resetShuffle() {
    if (this.isLocked) return;
    this.currentTokens.sort(() => Math.random() - 0.5);
    this.liftedIndex = null;
    this.focusedIndex = 0;
    this.renderTrack();
    if (window.soundFx) window.soundFx.playMove();
  }
}

window.scrambleManager = new ScrambleManager();
