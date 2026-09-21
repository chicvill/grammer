// 초등 3학년 ~ 고등 3학년(수능) 전 학년 맞춤형 무한 영문법 생성기
class MultiGradeGrammarGenerator {
  constructor() {
    this.currentGrade = 'mid-1'; // 기본: 중1 ('elem-low', 'elem-high', 'mid-1', 'mid-2', 'mid-3', 'high')

    // 학년별 메타데이터
    this.gradeConfigs = {
      'elem-low': { label: '초등 3~4학년', badge: '초등 기초', color: '#00ffcc' },
      'elem-high': { label: '초등 5~6학년', badge: '초등 심화', color: '#00d2ff' },
      'mid-1': { label: '중학 1학년', badge: '중등 기초', color: '#ffc800' },
      'mid-2': { label: '중학 2학년', badge: '중등 발전', color: '#ff9900' },
      'mid-3': { label: '중학 3학년', badge: '중등 완성', color: '#ff007f' },
      'high': { label: '고등 1~3 / 수능', badge: '수능 어법', color: '#b800ff' }
    };
  }

  pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  makeHintMask(word) {
    if (word.length <= 2) return `${word[0]} _`;
    const dashes = Array(word.length - 1).fill('_').join(' ');
    return `${word[0]} ${dashes}`;
  }

  // ========================================================
  // 1. [초등 3~4학년] Be동사 기초 & 지시대명사 (AI & 미래 기술)
  // ========================================================
  genElemLow(type) {
    const templates = [
      // Be동사 현재형
      () => {
        const items = [
          { sub: "I", ans: "am", comp: "a future AI programmer", ko: "나는 미래의 AI 프로그래머이다" },
          { sub: "You", ans: "are", comp: "a young scientist", ko: "너는 어린 과학자이다" },
          { sub: "Python", ans: "is", comp: "a powerful coding language", ko: "파이썬은 강력한 코딩 언어이다" },
          { sub: "Robots", ans: "are", comp: "helpful assistants", ko: "로봇들은 유용한 조수들이다" },
          { sub: "We", ans: "are", comp: "future space explorers", ko: "우리는 미래의 우주 탐험가들이다" },
          { sub: "This computer", ans: "is", comp: "very fast", ko: "이 컴퓨터는 매우 빠르다" },
          { sub: "Smart algorithms", ans: "are", comp: "everywhere", ko: "스마트 알고리즘은 어디에나 있다" },
          { sub: "Data", ans: "is", comp: "important for science", ko: "데이터는 과학에 중요하다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.comp}.`;
        const full = `${item.sub} ${item.ans} ${item.comp}.`;
        const options = this.shuffle(["am", "are", "is", "be"]);
        return {
          category: "초등 3~4 Be동사 [미래 테크 💻]",
          sentence, full, ko: item.ko, ans: item.ans, options,
          tip: `주어 '${item.sub}' 뒤에 오는 알맞은 짝꿍 Be동사는 '${item.ans}'입니다.`
        };
      },
      // 지시대명사 This / These / That / Those
      () => {
        const items = [
          { sub: "This", verb: "is", obj: "a new microchip", ko: "이것은 새로운 마이크로칩이다", options: ["is", "are", "am", "be"], ans: "is" },
          { sub: "These", verb: "are", obj: "solar panels", ko: "이것들은 태양광 패널들이다", options: ["are", "is", "am", "be"], ans: "are" },
          { sub: "That", verb: "is", obj: "a space satellite", ko: "저것은 우주 인공위성이다", options: ["is", "are", "am", "be"], ans: "is" },
          { sub: "Those", verb: "are", obj: "quantum computers", ko: "저것들은 양자 컴퓨터들이다", options: ["are", "is", "am", "be"], ans: "are" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.obj}.`;
        const full = `${item.sub} ${item.ans} ${item.obj}.`;
        return {
          category: "초등 3~4 지시대명사 [과학 장비 🔬]",
          sentence, full, ko: item.ko, ans: item.ans, options: this.shuffle(item.options),
          tip: `'${item.sub}'는 ${item.sub.endsWith('e') || item.sub === 'These' ? '복수' : '단수'}이므로 '${item.ans}'를 씁니다.`
        };
      }
    ];
    return this.wrapQuestion(this.pickRandom(templates)(), type, 'elem-low');
  }

  // ========================================================
  // 2. [초등 5~6학년] 현재진행형(be + ing) & 조동사 can (AI & 로봇)
  // ========================================================
  genElemHigh(type) {
    const templates = [
      // 현재진행형 (be + -ing)
      () => {
        const items = [
          { sub: "The robot is", base: "clean", ing: "cleaning", obj: "the science lab now", ko: "그 로봇은 지금 과학 연구실을 청소하고 있다" },
          { sub: "The scientist is", base: "test", ing: "testing", obj: "the flying drone", ko: "그 과학자는 비행 드론을 테스트하고 있다" },
          { sub: "The AI system is", base: "analyze", ing: "analyzing", obj: "big data in real time", ko: "AI 시스템은 실시간으로 빅데이터를 분석하고 있다" },
          { sub: "We are", base: "code", ing: "coding", obj: "a new space game together", ko: "우리는 함께 새 우주 게임을 코딩하고 있다" },
          { sub: "The astronomer is", base: "observe", ing: "observing", obj: "Mars right now", ko: "천문학자는 지금 화성을 관측하고 있다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.obj}.`;
        const full = `${item.sub} ${item.ing} ${item.obj}.`;
        const options = this.shuffle([item.ing, item.base, `${item.base}s`, `${item.base}ed`]);
        return {
          category: "초등 5~6 현재진행형 [스마트 연구소 🤖]",
          sentence, full, ko: item.ko, ans: item.ing, options,
          tip: "'지금 ~하는 중이다'라는 현재진행형은 be동사 + 동사-ing 형태를 씁니다."
        };
      },
      // 조동사 can + 동사원형
      () => {
        const items = [
          { sub: "AI can", base: "solve", s: "solves", obj: "complex math puzzles", ko: "AI는 복잡한 수학 퍼즐을 풀 수 있다" },
          { sub: "The drone can", base: "fly", s: "flies", obj: "autonomously in the sky", ko: "드론은 하늘을 자율 비행할 수 있다" },
          { sub: "Robots can", base: "assist", s: "assists", obj: "doctors in smart hospitals", ko: "로봇은 스마트 병원에서 의사를 보조할 수 있다" },
          { sub: "Supercomputers can", base: "process", s: "processes", obj: "huge data at light speed", ko: "슈퍼컴퓨터는 거대한 데이터를 빛의 속도로 처리할 수 있다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.obj}.`;
        const full = `${item.sub} ${item.base} ${item.obj}.`;
        const options = this.shuffle([item.base, item.s, `${item.base}ing`, `${item.base}ed`]);
        return {
          category: "초등 5~6 조동사 can [미래 컴퓨팅 ⚡]",
          sentence, full, ko: item.ko, ans: item.base, options,
          tip: "조동사 can 뒤에는 언제나 '동사원형'을 씁니다."
        };
      }
    ];
    return this.wrapQuestion(this.pickRandom(templates)(), type, 'elem-high');
  }

  // ========================================================
  // 3. [중학 1학년] 3인칭 단수, Be/일반과거, do/does (알고리즘 & 우주과학)
  // ========================================================
  genMid1(type) {
    const templates = [
      () => {
        const subjects = [
          { name: "The algorithm", isThird: true, ko: "그 알고리즘은" },
          { name: "The robotic arm", isThird: true, ko: "그 로봇 팔은" },
          { name: "The space probe", isThird: true, ko: "그 우주 탐사선은" },
          { name: "The AI engineers", isThird: false, ko: "AI 엔지니어들은" },
          { name: "The scientists", isThird: false, ko: "과학자들은" }
        ];
        const verbs = [
          { base: "analyze", s: "analyzes", obj: "data accurately", ko: "데이터를 정확하게 분석한다" },
          { base: "build", s: "builds", obj: "electric cars in the factory", ko: "공장에서 전기차를 조립한다" },
          { base: "calculate", s: "calculates", obj: "complex math formulas", ko: "복잡한 수학 공식을 계산한다" },
          { base: "explore", s: "explores", obj: "deep space every year", ko: "매년 심우주를 탐사한다" }
        ];
        const sub = this.pickRandom(subjects);
        const v = this.pickRandom(verbs);
        const ans = sub.isThird ? v.s : v.base;
        const sentence = `${sub.name} _____ ${v.obj}.`;
        const full = `${sub.name} ${ans} ${v.obj}.`;
        const options = this.shuffle([v.base, v.s, `${v.base}ing`, `${v.base}ed`]);
        return {
          category: "중1 일반동사 현재형 [빅데이터 & AI 📈]",
          sentence, full, ko: `${sub.ko} ${v.ko}.`, ans, options,
          tip: sub.isThird ? `주어 '${sub.name}'가 3인칭 단수이므로 동사에 -s/-es를 붙인 '${ans}'가 정답입니다.` : `주어가 복수/1,2인칭이므로 동사원형 '${ans}'를 씁니다.`
        };
      },
      () => {
        const pasts = [
          { sub: "The rover", base: "go", ans: "went", obj: "to Mars last year", ko: "그 탐사선은 작년에 화성에 갔다" },
          { sub: "The astronomer", base: "see", ans: "saw", obj: "a new galaxy yesterday", ko: "그 천문학자는 어제 새로운 은하를 관측했다" },
          { sub: "NASA", base: "build", ans: "built", obj: "a quantum satellite two years ago", ko: "NASA는 2년 전에 양자 위성을 건조했다" },
          { sub: "The developer", base: "write", ans: "wrote", obj: "a Python script last night", ko: "그 개발자는 어젯밤에 파이썬 스크립트를 작성했다" }
        ];
        const item = this.pickRandom(pasts);
        const sentence = `${item.sub} _____ ${item.obj}.`;
        const full = `${item.sub} ${item.ans} ${item.obj}.`;
        const options = this.shuffle([item.base, item.ans, `${item.base}s`, `${item.base}ing`]);
        return {
          category: "중1 불규칙 과거시제 [우주 탐사 🚀]",
          sentence, full, ko: item.ko, ans: item.ans, options,
          tip: `과거 표현이 있으므로 '${item.base}'의 불규칙 과거형인 '${item.ans}'를 씁니다.`
        };
      }
    ];
    return this.wrapQuestion(this.pickRandom(templates)(), type, 'mid-1');
  }

  // ========================================================
  // 4. [중학 2학년] to부정사, 동명사, 수동태(be p.p.), 비교급 (소프트웨어 & 물리)
  // ========================================================
  genMid2(type) {
    const templates = [
      // 동명사만을 목적어로 취하는 동사 (enjoy, finish, practice, avoid, mind)
      () => {
        const items = [
          { v: "enjoy", ing: "coding", to: "to code", obj: "Python algorithms", ko: "나는 파이썬 알고리즘 코딩하는 것을 즐긴다" },
          { v: "finish", ing: "training", to: "to train", obj: "the AI neural network", ko: "그녀는 AI 신경망 훈련시키는 것을 끝마쳤다" },
          { v: "practice", ing: "flying", to: "to fly", obj: "autonomous drones every day", ko: "그들은 매일 자율주행 드론 조종을 연습한다" },
          { v: "keep", ing: "calculating", to: "to calculate", obj: "supercomputer climate models", ko: "슈퍼컴퓨터는 기후 시뮬레이션을 계속 계산했다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `I ${item.v} _____ ${item.obj}.`;
        const full = `I ${item.v} ${item.ing} ${item.obj}.`;
        const options = this.shuffle([item.ing, item.to, item.ing.replace('ing', ''), `${item.ing.replace('ing', '')}ed`]);
        return {
          category: "중2 동명사 목적어 [AI 프로그래밍 💾]",
          sentence, full, ko: item.ko, ans: item.ing, options,
          tip: `'${item.v}' 동사 뒤에는 to부정사가 아닌 '동명사(-ing)'를 목적어로 씁니다.`
        };
      },
      // 수동태 (be + 과거분사 p.p.)
      () => {
        const items = [
          { sub: "The satellite", be: "was", pp: "launched", base: "launch", by: "into orbit by the rocket", ko: "그 인공위성은 로켓에 의해 궤도로 발사되었다" },
          { sub: "This code", be: "was", pp: "written", base: "write", by: "by a talented AI engineer", ko: "이 코드는 재능 있는 AI 엔지니어에 의해 작성되었다" },
          { sub: "Solar energy", be: "is", pp: "used", base: "use", by: "by modern electric cars", ko: "태양광 에너지는 현대 전기차들에 의해 사용된다" },
          { sub: "The math formula", be: "was", pp: "discovered", base: "discover", by: "famous physicists", ko: "그 수학 공식은 유명한 물리학자들에 의해 발견되었다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} ${item.be} _____ ${item.by}.`;
        const full = `${item.sub} ${item.be} ${item.pp} ${item.by}.`;
        const options = this.shuffle([item.pp, item.base, `${item.base}s`, `${item.base}ing`]);
        return {
          category: "중2 수동태 (be + p.p.) [과학 기술 🛰️]",
          sentence, full, ko: item.ko, ans: item.pp, options,
          tip: "수동태는 'be동사 + 과거분사(p.p.)' 형태이며 '~에 의해 되다'라는 뜻입니다."
        };
      },
      // 비교급 (than)
      () => {
        const items = [
          { sub: "A quantum computer is", ans: "faster", base: "fast", than: "than a standard PC", ko: "양자 컴퓨터는 일반 PC보다 더 빠르다" },
          { sub: "AI is", ans: "smarter", base: "smart", than: "than old calculator programs", ko: "인공지능은 이전의 계산기 프로그램보다 더 똑똑하다" },
          { sub: "Mars is", ans: "colder", base: "cold", than: "than Earth", ko: "화성은 지구보다 더 춥다" },
          { sub: "Big data is", ans: "larger", base: "large", than: "than traditional spreadsheets", ko: "빅데이터는 기존의 스프레드시트보다 훨씬 방대하다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.than}.`;
        const full = `${item.sub} ${item.ans} ${item.than}.`;
        const options = this.shuffle([item.ans, item.base, `${item.base}est`, `more ${item.base}`]);
        return {
          category: "중2 비교급 [컴퓨팅 성능 🚀]",
          sentence, full, ko: item.ko, ans: item.ans, options,
          tip: "뒤에 '~보다'를 뜻하는 than이 있으므로 형용사의 비교급(-er)을 씁니다."
        };
      }
    ];
    return this.wrapQuestion(this.pickRandom(templates)(), type, 'mid-2');
  }

  // ========================================================
  // 5. [중학 3학년] 현재완료(have p.p.), 관계대명사(who/which/that) (첨단 연구 & AI)
  // ========================================================
  genMid3(type) {
    const templates = [
      // 현재완료 시제 (have/has + p.p.)
      () => {
        const items = [
          { sub: "Scientists have", ans: "explored", base: "explore", obj: "deep space for decades", ko: "과학자들은 수십 년 동안 심우주를 탐사해 오고 있다 (계속)" },
          { sub: "The AI system has", ans: "analyzed", base: "analyze", obj: "millions of medical images", ko: "그 AI 시스템은 수백만 장의 의료 영상을 분석해 냈다 (완료/경험)" },
          { sub: "Engineers have", ans: "designed", base: "design", obj: "autonomous solar drones", ko: "엔지니어들은 자율 비행 태양광 드론을 설계했다 (완료)" },
          { sub: "NASA has", ans: "launched", base: "launch", obj: "new telescopes into deep orbit", ko: "NASA는 심우주 궤도로 새 망원경들을 발사했다 (결과)" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.obj}.`;
        const full = `${item.sub} ${item.ans} ${item.obj}.`;
        const options = this.shuffle([item.ans, item.base, `${item.base}s`, `${item.base}ing`]);
        return {
          category: "중3 현재완료 (have + p.p.) [우주 탐사 역사 🌌]",
          sentence, full, ko: item.ko, ans: item.ans, options,
          tip: "과거부터 현재까지의 경험/계속/완료를 나타내는 현재완료는 have/has + 과거분사(p.p.)를 씁니다."
        };
      },
      // 관계대명사 (who vs which)
      () => {
        const items = [
          { ant: "The scientist", ans: "who", wrong: "which", rest: "created the neural network won the award", ko: "신경망 모델을 개발한 그 과학자는 상을 받았다", tip: "선행사가 사람(The scientist)이므로 주격 관계대명사 'who'를 씁니다." },
          { ant: "The roboticist", ans: "who", wrong: "which", rest: "designs humanoid robots is my role model", ko: "휴머노이드 로봇을 설계하는 로봇공학자는 나의 롤모델이다", tip: "선행사가 사람(The roboticist)이므로 주격 관계대명사 'who'를 씁니다." },
          { ant: "This is the supercomputer", ans: "which", wrong: "who", rest: "simulates global climate change", ko: "이것은 전 지구 기후 변화를 시뮬레이션하는 슈퍼컴퓨터이다", tip: "선행사가 사물(the supercomputer)이므로 관계대명사 'which'를 씁니다." },
          { ant: "We developed an algorithm", ans: "which", wrong: "who", rest: "solves quantum equations quickly", ko: "우리는 양자 방정식을 빠르게 푸는 알고리즘을 개발했다", tip: "선행사가 사물(an algorithm)이므로 'which'를 씁니다." }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.ant} _____ ${item.rest}.`;
        const full = `${item.ant} ${item.ans} ${item.rest}.`;
        const options = this.shuffle([item.ans, item.wrong, "what", "where"]);
        return {
          category: "중3 관계대명사 [AI 연구진 & 시스템 🤖]",
          sentence, full, ko: item.ko, ans: item.ans, options, tip: item.tip
        };
      }
    ];
    return this.wrapQuestion(this.pickRandom(templates)(), type, 'mid-3');
  }

  // ========================================================
  // 6. [고등 1~3 / 수능] 수능 어법 5대 유형 (수일치, what vs that, 가정법) (미래 과학 철학)
  // ========================================================
  genHigh(type) {
    const templates = [
      // 수능 1순위: 복잡한 주어-동사 수일치
      () => {
        const items = [
          { sub: "The number of parameters in modern AI models", ans: "is", wrong: "are", rest: "increasing exponentially every year", ko: "현대 AI 모델의 파라미터 수는 매년 기하급수적으로 증가하고 있다", tip: "'The number of(~의 수)'가 핵심 주어이므로 단수동사 'is'를 씁니다." },
          { sub: "A number of data scientists", ans: "are", wrong: "is", rest: "researching next-generation quantum neural networks", ko: "많은 데이터 과학자들이 차세대 양자 신경망을 연구하고 있다", tip: "'A number of(많은)'는 복수 취급하므로 복수동사 'are'를 씁니다." },
          { sub: "The development of humanoid robots", ans: "requires", wrong: "require", rest: "precise mathematical calculations and engineering", ko: "휴머노이드 로봇의 개발은 정밀한 수학적 계산과 공학을 필요로 한다", tip: "주어의 핵은 단수명사 'The development'이므로 단수동사 'requires'가 정답입니다." },
          { sub: "Analyzing massive datasets from particle colliders", ans: "broadens", wrong: "broaden", rest: "our scientific perspectives on the cosmos", ko: "입자 가속기의 거대한 데이터 세트를 분석하는 것은 우주에 대한 우리의 과학적 시야를 넓혀준다", tip: "동명사구(Analyzing ~)가 주어일 때는 단수 취급하므로 'broadens'를 씁니다." }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.rest}.`;
        const full = `${item.sub} ${item.ans} ${item.rest}.`;
        const options = this.shuffle([item.ans, item.wrong, "being", "been"]);
        return {
          category: "수능 어법: 주어-동사 수일치 [빅데이터 & 물리 🌌]",
          sentence, full, ko: item.ko, ans: item.ans, options, tip: item.tip
        };
      },
      // 수능 2순위: 관계사 what vs 접속사 that
      () => {
        const items = [
          { lead: "The researcher demonstrated", ans: "what", wrong: "that", rest: "the neural network learned from quantum simulations", ko: "그 연구원은 신경망이 양자 시뮬레이션으로부터 학습한 것을 시연했다", tip: "learned의 목적어가 빠진 불완전한 문장이며 선행사가 없으므로 선행사를 포함한 관계대명사 'what'이 정답입니다." },
          { lead: "Engineers must focus on", ans: "what", wrong: "that", rest: "optimizes energy efficiency in quantum computing", ko: "엔지니어들은 양자 컴퓨팅에서 에너지 효율을 최적화하는 것에 집중해야 한다", tip: "전치사 on의 목적어 자리이며 주어가 없는 불완전한 절이므로 'what'을 씁니다." },
          { lead: "Physicists believe", ans: "that", wrong: "what", rest: "artificial intelligence will accelerate scientific breakthroughs", ko: "물리학자들은 인공지능이 과학적 혁신을 가속화할 것이라 믿는다", tip: "뒤에 완전한 절(주어+동사+목적어)이 이어지므로 명사절 접속사 'that'을 씁니다." }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.lead} _____ ${item.rest}.`;
        const full = `${item.lead} ${item.ans} ${item.rest}.`;
        const options = this.shuffle([item.ans, item.wrong, "which", "how"]);
        return {
          category: "수능 어법: that vs what [AI 과학 연구 🔬]",
          sentence, full, ko: item.ko, ans: item.ans, options, tip: item.tip
        };
      },
      // 수능 3순위: 가정법 과거 및 과거완료
      () => {
        const items = [
          { ifClause: "If quantum computers", ans: "were", wrong: "am", main: "commercially available, scientists could simulate complex molecules instantly", ko: "만약 양자 컴퓨터가 상용화된다면, 과학자들은 복잡한 분자 구조를 즉시 시뮬레이션할 텐데", tip: "현재 사실의 반대를 나타내는 가정법 과거에서는 be동사로 인칭에 관계없이 'were'를 씁니다." },
          { ifClause: "If the space rover had detected the anomaly earlier, it", ans: "would have adjusted", wrong: "will adjust", main: "its orbital path automatically", ko: "만약 그 우주 탐사선이 이상 현상을 더 일찍 감지했더라면, 궤도를 자동으로 조정했을 텐데", tip: "과거 사실의 반대를 나타내는 가정법 과거완료 귀결절은 '조동사 과거 + have p.p.'를 씁니다." }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.ifClause} _____ ${item.main}.`;
        const full = `${item.ifClause} ${item.ans} ${item.main}.`;
        const options = this.shuffle([item.ans, item.wrong, "was", "would adjust"]);
        return {
          category: "고등 어법: 가정법 [양자 & 우주 시뮬레이션 ⚛️]",
          sentence, full, ko: item.ko, ans: item.ans, options, tip: item.tip
        };
      }
    ];
    return this.wrapQuestion(this.pickRandom(templates)(), type, 'high');
  }

  // 공통 래퍼
  wrapQuestion(data, type, grade) {
    const answerIndex = data.options.indexOf(data.ans);
    return {
      id: `gen-${grade}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: type, // 'choice', 'speaking', 'listening'
      grade: grade,
      category: data.category,
      sentence: data.sentence,
      displaySentence: data.sentence,
      audioText: data.full,
      translation: data.ko,
      options: data.options,
      answer: answerIndex,
      answerWord: data.ans,
      missingWord: data.ans,
      hint: `힌트: 정답 단어 (${this.makeHintMask(data.ans)})`,
      acceptableAnswers: [data.ans, `${answerIndex + 1}번`, `${answerIndex + 1}`],
      explanation: data.tip
    };
  }

  // 외부 호출 함수: 학년별 1세트(10문제) 생성
  generateSet(count = 10, priorityWrong = [], grade = 'mid-1') {
    this.currentGrade = grade;
    const questionTypes = ['choice', 'speaking', 'listening'];
    const generated = [];

    // 이전에 틀렸던 문제 중 해당 학년 문제 우선 추가
    if (priorityWrong && priorityWrong.length > 0) {
      const matchWrong = priorityWrong.filter(w => w.grade === grade);
      matchWrong.forEach(mw => generated.push(mw));
    }

    let genFunc;
    switch (grade) {
      case 'elem-low': genFunc = this.genElemLow.bind(this); break;
      case 'elem-high': genFunc = this.genElemHigh.bind(this); break;
      case 'mid-1': genFunc = this.genMid1.bind(this); break;
      case 'mid-2': genFunc = this.genMid2.bind(this); break;
      case 'mid-3': genFunc = this.genMid3.bind(this); break;
      case 'high': genFunc = this.genHigh.bind(this); break;
      default: genFunc = this.genMid1.bind(this);
    }

    let attempts = 0;
    while (generated.length < count && attempts < 50) {
      attempts++;
      const qType = this.pickRandom(questionTypes);
      const newQ = genFunc(qType);
      if (!generated.some(g => g.sentence === newQ.sentence)) {
        generated.push(newQ);
      }
    }

    return this.shuffle(generated.slice(0, count));
  }
}

window.grammarGenerator = new MultiGradeGrammarGenerator();
