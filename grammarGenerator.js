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
  // 1. [초등 3~4학년] Be동사 기초 & 지시대명사
  // ========================================================
  genElemLow(type) {
    const templates = [
      // Be동사 현재형
      () => {
        const items = [
          { sub: "I", ans: "am", comp: "a student", ko: "나는 학생이다" },
          { sub: "You", ans: "are", comp: "tall", ko: "너는 키가 크다" },
          { sub: "He", ans: "is", comp: "my best friend", ko: "그는 내 가장 친한 친구이다" },
          { sub: "She", ans: "is", comp: "a nice teacher", ko: "그녀는 좋은 선생님이다" },
          { sub: "We", ans: "are", comp: "happy today", ko: "우리는 오늘 행복하다" },
          { sub: "They", ans: "are", comp: "good singers", ko: "그들은 노래를 잘하는 가수들이다" },
          { sub: "This", ans: "is", comp: "an apple", ko: "이것은 사과이다" },
          { sub: "That", ans: "is", comp: "a cute cat", ko: "저것은 귀여운 고양이이다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.comp}.`;
        const full = `${item.sub} ${item.ans} ${item.comp}.`;
        const options = this.shuffle(["am", "are", "is", "be"]);
        return {
          category: "초등 3~4 Be동사",
          sentence, full, ko: item.ko, ans: item.ans, options,
          tip: `주어 '${item.sub}' 뒤에 오는 알맞은 짝꿍 Be동사는 '${item.ans}'입니다.`
        };
      },
      // 지시대명사 This / These / That / Those
      () => {
        const items = [
          { sub: "This", verb: "is", obj: "my pencil", ko: "이것은 내 연필이다", options: ["is", "are", "am", "be"], ans: "is" },
          { sub: "These", verb: "are", obj: "my books", ko: "이것들은 내 책들이다", options: ["are", "is", "am", "be"], ans: "are" },
          { sub: "That", verb: "is", obj: "a big tree", ko: "저것은 큰 나무이다", options: ["is", "are", "am", "be"], ans: "is" },
          { sub: "Those", verb: "are", obj: "yellow flowers", ko: "저것들은 노란 꽃들이다", options: ["are", "is", "am", "be"], ans: "are" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.obj}.`;
        const full = `${item.sub} ${item.ans} ${item.obj}.`;
        return {
          category: "초등 3~4 지시대명사",
          sentence, full, ko: item.ko, ans: item.ans, options: this.shuffle(item.options),
          tip: `'${item.sub}'는 ${item.sub.endsWith('e') || item.sub === 'These' ? '복수' : '단수'}이므로 '${item.ans}'를 씁니다.`
        };
      }
    ];
    return this.wrapQuestion(this.pickRandom(templates)(), type, 'elem-low');
  }

  // ========================================================
  // 2. [초등 5~6학년] 현재진행형(be + ing) & 조동사 can
  // ========================================================
  genElemHigh(type) {
    const templates = [
      // 현재진행형 (be + -ing)
      () => {
        const items = [
          { sub: "He is", base: "listen", ing: "listening", obj: "to music now", ko: "그는 지금 음악을 듣고 있다" },
          { sub: "She is", base: "read", ing: "reading", obj: "a comic book", ko: "그녀는 만화책을 읽고 있다" },
          { sub: "They are", base: "play", ing: "playing", obj: "soccer in the park", ko: "그들은 공원에서 축구를 하고 있다" },
          { sub: "We are", base: "eat", ing: "eating", obj: "dinner together", ko: "우리는 함께 저녁을 먹고 있다" },
          { sub: "I am", base: "watch", ing: "watching", obj: "TV right now", ko: "나는 지금 TV를 보고 있다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.obj}.`;
        const full = `${item.sub} ${item.ing} ${item.obj}.`;
        const options = this.shuffle([item.ing, item.base, `${item.base}s`, `${item.base}ed`]);
        return {
          category: "초등 5~6 현재진행형",
          sentence, full, ko: item.ko, ans: item.ing, options,
          tip: "'지금 ~하는 중이다'라는 현재진행형은 be동사 + 동사-ing 형태를 씁니다."
        };
      },
      // 조동사 can + 동사원형
      () => {
        const items = [
          { sub: "She can", base: "swim", s: "swims", obj: "very fast", ko: "그녀는 아주 빠르게 수영할 수 있다" },
          { sub: "He can", base: "speak", s: "speaks", obj: "English well", ko: "그는 영어를 잘 말할 수 있다" },
          { sub: "They can", base: "play", s: "plays", obj: "the guitar", ko: "그들은 기타를 칠 수 있다" },
          { sub: "My brother can", base: "ride", s: "rides", obj: "a bicycle", ko: "내 남동생은 자전거를 탈 수 있다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.obj}.`;
        const full = `${item.sub} ${item.base} ${item.obj}.`;
        const options = this.shuffle([item.base, item.s, `${item.base}ing`, `${item.base}ed`]);
        return {
          category: "초등 5~6 조동사 can",
          sentence, full, ko: item.ko, ans: item.base, options,
          tip: "조동사 can 뒤에는 언제나 '동사원형'을 씁니다."
        };
      }
    ];
    return this.wrapQuestion(this.pickRandom(templates)(), type, 'elem-high');
  }

  // ========================================================
  // 3. [중학 1학년] 3인칭 단수, Be/일반과거, do/does
  // ========================================================
  genMid1(type) {
    const templates = [
      () => {
        const subjects = [
          { name: "My sister", isThird: true, ko: "내 여동생은" },
          { name: "Tom", isThird: true, ko: "톰은" },
          { name: "She", isThird: true, ko: "그녀는" },
          { name: "They", isThird: false, ko: "그들은" },
          { name: "The students", isThird: false, ko: "학생들은" }
        ];
        const verbs = [
          { base: "play", s: "plays", obj: "soccer every Sunday", ko: "매주 일요일에 축구를 한다" },
          { base: "watch", s: "watches", obj: "TV in the evening", ko: "저녁에 TV를 본다" },
          { base: "have", s: "has", obj: "a cute puppy", ko: "귀여운 강아지를 가지고 있다" },
          { base: "study", s: "studies", obj: "English every day", ko: "매일 영어를 공부한다" }
        ];
        const sub = this.pickRandom(subjects);
        const v = this.pickRandom(verbs);
        const ans = sub.isThird ? v.s : v.base;
        const sentence = `${sub.name} _____ ${v.obj}.`;
        const full = `${sub.name} ${ans} ${v.obj}.`;
        const options = this.shuffle([v.base, v.s, `${v.base}ing`, `${v.base}ed`]);
        return {
          category: "중1 일반동사 현재형",
          sentence, full, ko: `${sub.ko} ${v.ko}.`, ans, options,
          tip: sub.isThird ? `주어 '${sub.name}'가 3인칭 단수이므로 동사에 -s/-es를 붙인 '${ans}'가 정답입니다.` : `주어가 복수/1,2인칭이므로 동사원형 '${ans}'를 씁니다.`
        };
      },
      () => {
        const pasts = [
          { sub: "We", base: "go", ans: "went", obj: "to the zoo last weekend", ko: "우리는 지난 주말에 동물원에 갔다" },
          { sub: "I", base: "see", ans: "saw", obj: "an interesting movie yesterday", ko: "나는 어제 흥미로운 영화를 보았다" },
          { sub: "He", base: "buy", ans: "bought", obj: "a new bike two days ago", ko: "그는 이틀 전에 새 자전거를 샀다" },
          { sub: "She", base: "eat", ans: "ate", obj: "pizza for dinner last night", ko: "그녀는 어젯밤에 저녁으로 피자를 먹었다" }
        ];
        const item = this.pickRandom(pasts);
        const sentence = `${item.sub} _____ ${item.obj}.`;
        const full = `${item.sub} ${item.ans} ${item.obj}.`;
        const options = this.shuffle([item.base, item.ans, `${item.base}s`, `${item.base}ing`]);
        return {
          category: "중1 불규칙 과거시제",
          sentence, full, ko: item.ko, ans: item.ans, options,
          tip: `과거 표현이 있으므로 '${item.base}'의 불규칙 과거형인 '${item.ans}'를 씁니다.`
        };
      }
    ];
    return this.wrapQuestion(this.pickRandom(templates)(), type, 'mid-1');
  }

  // ========================================================
  // 4. [중학 2학년] to부정사, 동명사, 수동태(be p.p.), 비교급
  // ========================================================
  genMid2(type) {
    const templates = [
      // 동명사만을 목적어로 취하는 동사 (enjoy, finish, practice, avoid, mind)
      () => {
        const items = [
          { v: "enjoy", ing: "reading", to: "to read", obj: "comic books", ko: "나는 만화책 읽는 것을 즐긴다" },
          { v: "finish", ing: "doing", to: "to do", obj: "my homework", ko: "나는 내 숙제하는 것을 끝마쳤다" },
          { v: "practice", ing: "playing", to: "to play", obj: "the piano every day", ko: "그녀는 매일 피아노 치는 것을 연습한다" },
          { v: "keep", ing: "running", to: "to run", obj: "in the playground", ko: "그들은 운동장에서 계속 달렸다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `I ${item.v} _____ ${item.obj}.`;
        const full = `I ${item.v} ${item.ing} ${item.obj}.`;
        const options = this.shuffle([item.ing, item.to, item.ing.replace('ing', ''), `${item.ing.replace('ing', '')}ed`]);
        return {
          category: "중2 동명사 목적어",
          sentence, full, ko: item.ko, ans: item.ing, options,
          tip: `'${item.v}' 동사 뒤에는 to부정사가 아닌 '동명사(-ing)'를 목적어로 씁니다.`
        };
      },
      // 수동태 (be + 과거분사 p.p.)
      () => {
        const items = [
          { sub: "The window", be: "was", pp: "broken", base: "break", by: "by Tom", ko: "그 창문은 톰에 의해 깨졌다" },
          { sub: "This book", be: "was", pp: "written", base: "write", by: "by a famous writer", ko: "이 책은 유명한 작가에 의해 쓰였다" },
          { sub: "The cake", be: "was", pp: "made", base: "make", by: "my grandmother", ko: "그 케이크는 할머니에 의해 만들어졌다" },
          { sub: "English", be: "is", pp: "spoken", base: "speak", by: "many people", ko: "영어는 많은 사람들에 의해 쓰인다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} ${item.be} _____ ${item.by}.`;
        const full = `${item.sub} ${item.be} ${item.pp} ${item.by}.`;
        const options = this.shuffle([item.pp, item.base, `${item.base}s`, `${item.base}ing`]);
        return {
          category: "중2 수동태 (be + p.p.)",
          sentence, full, ko: item.ko, ans: item.pp, options,
          tip: "수동태는 'be동사 + 과거분사(p.p.)' 형태이며 '~에 의해 되다'라는 뜻입니다."
        };
      },
      // 비교급 (than)
      () => {
        const items = [
          { sub: "Tom is", ans: "taller", base: "tall", than: "than Minho", ko: "톰은 민호보다 키가 더 크다" },
          { sub: "Summer is", ans: "hotter", base: "hot", than: "than spring", ko: "여름은 봄보다 더 덥다" },
          { sub: "This book is", ans: "easier", base: "easy", than: "than that one", ko: "이 책은 저 책보다 더 쉽다" },
          { sub: "A train is", ans: "faster", base: "fast", than: "a bus", ko: "기차는 버스보다 더 빠르다" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.than}.`;
        const full = `${item.sub} ${item.ans} ${item.than}.`;
        const options = this.shuffle([item.ans, item.base, `${item.base}est`, `more ${item.base}`]);
        return {
          category: "중2 비교급",
          sentence, full, ko: item.ko, ans: item.ans, options,
          tip: "뒤에 '~보다'를 뜻하는 than이 있으므로 형용사의 비교급(-er)을 씁니다."
        };
      }
    ];
    return this.wrapQuestion(this.pickRandom(templates)(), type, 'mid-2');
  }

  // ========================================================
  // 5. [중학 3학년] 현재완료(have p.p.), 관계대명사(who/which/that)
  // ========================================================
  genMid3(type) {
    const templates = [
      // 현재완료 시제 (have/has + p.p.)
      () => {
        const items = [
          { sub: "I have", ans: "lived", base: "live", obj: "in Seoul for five years", ko: "나는 5년 동안 서울에서 살아왔다 (계속)" },
          { sub: "She has", ans: "visited", base: "visit", obj: "Paris twice", ko: "그녀는 파리를 두 번 방문해 본 적이 있다 (경험)" },
          { sub: "They have", ans: "finished", base: "finish", obj: "their lunch already", ko: "그들은 이미 점심 식사를 마쳤다 (완료)" },
          { sub: "He has", ans: "lost", base: "lose", obj: "his smartphone", ko: "그는 스마트폰을 잃어버렸다 (결과)" }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.obj}.`;
        const full = `${item.sub} ${item.ans} ${item.obj}.`;
        const options = this.shuffle([item.ans, item.base, `${item.base}s`, `${item.base}ing`]);
        return {
          category: "중3 현재완료 (have + p.p.)",
          sentence, full, ko: item.ko, ans: item.ans, options,
          tip: "과거부터 현재까지의 경험/계속/완료를 나타내는 현재완료는 have/has + 과거분사(p.p.)를 씁니다."
        };
      },
      // 관계대명사 (who vs which)
      () => {
        const items = [
          { ant: "The boy", ans: "who", wrong: "which", rest: "is standing over there is my cousin", ko: "저기 서 있는 그 소년은 내 사촌이다", tip: "선행사가 사람(The boy)이므로 관계대명사 'who'를 씁니다." },
          { ant: "The girl", ans: "who", wrong: "which", rest: "won the gold medal is Jane", ko: "금메달을 딴 그 소녀는 제인이다", tip: "선행사가 사람(The girl)이므로 주격 관계대명사 'who'를 씁니다." },
          { ant: "I like the movie", ans: "which", wrong: "who", rest: "was released last week", ko: "나는 지난주에 개봉한 그 영화를 좋아한다", tip: "선행사가 사물(the movie)이므로 관계대명사 'which'를 씁니다." },
          { ant: "This is the computer", ans: "which", wrong: "who", rest: "my father bought for me", ko: "이것은 아버지가 나에게 사주신 컴퓨터이다", tip: "선행사가 사물(the computer)이므로 'which'를 씁니다." }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.ant} _____ ${item.rest}.`;
        const full = `${item.ant} ${item.ans} ${item.rest}.`;
        const options = this.shuffle([item.ans, item.wrong, "what", "where"]);
        return {
          category: "중3 관계대명사",
          sentence, full, ko: item.ko, ans: item.ans, options, tip: item.tip
        };
      }
    ];
    return this.wrapQuestion(this.pickRandom(templates)(), type, 'mid-3');
  }

  // ========================================================
  // 6. [고등 1~3 / 수능] 수능 어법 5대 유형 (수일치, what vs that, 가정법, 분사구문)
  // ========================================================
  genHigh(type) {
    const templates = [
      // 수능 1순위: 복잡한 주어-동사 수일치 (수식어 거품 걷어내기)
      () => {
        const items = [
          { sub: "The number of students in this school", ans: "is", wrong: "are", rest: "increasing every year", ko: "이 학교의 학생 수는 매년 증가하고 있다", tip: "'The number of(~의 수)'가 핵심 주어이므로 단수동사 'is'를 씁니다." },
          { sub: "A number of volunteers", ans: "are", wrong: "is", rest: "helping the poor people", ko: "많은 자원봉사자들이 가난한 사람들을 돕고 있다", tip: "'A number of(많은)'는 복수 취급하므로 복수동사 'are'를 씁니다." },
          { sub: "The discovery of new treatments for diseases", ans: "requires", wrong: "require", rest: "deep scientific research", ko: "질병 치료법의 발견은 깊은 과학적 연구를 필요로 한다", tip: "주어의 핵(head)은 단수명사 'The discovery'이므로 단수동사 'requires'가 정답입니다." },
          { sub: "Reading books written by great thinkers", ans: "broadens", wrong: "broaden", rest: "our perspectives", ko: "위대한 사상가들의 책을 읽는 것은 우리의 시야를 넓혀준다", tip: "동명사구(Reading ~)가 주어일 때는 단수 취급하므로 'broadens'를 씁니다." }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.sub} _____ ${item.rest}.`;
        const full = `${item.sub} ${item.ans} ${item.rest}.`;
        const options = this.shuffle([item.ans, item.wrong, "being", "been"]);
        return {
          category: "수능 어법: 주어-동사 수일치",
          sentence, full, ko: item.ko, ans: item.ans, options, tip: item.tip
        };
      },
      // 수능 2순위: 관계사 what vs 접속사 that
      () => {
        const items = [
          { lead: "She told me", ans: "what", wrong: "that", rest: "she experienced in France", ko: "그녀는 자신이 프랑스에서 겪었던 것을 내게 말했다", tip: "experienced의 목적어가 빠진 불완전한 문장이며 선행사가 없으므로 선행사를 포함한 관계대명사 'what'이 정답입니다." },
          { lead: "We must focus on", ans: "what", wrong: "that", rest: "is really important for our future", ko: "우리는 우리 미래에 정말 중요한 것에 집중해야 한다", tip: "전치사 on의 목적어 자리이며 주어가 없는 불완전한 절이므로 'what'을 씁니다." },
          { lead: "I believe", ans: "that", wrong: "what", rest: "honesty is the best policy", ko: "나는 정직이 최선의 방책이라는 것을 믿는다", tip: "뒤에 완전한 절(주어+동사+보어)이 이어지므로 명사절 접속사 'that'을 씁니다." }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.lead} _____ ${item.rest}.`;
        const full = `${item.lead} ${item.ans} ${item.rest}.`;
        const options = this.shuffle([item.ans, item.wrong, "which", "how"]);
        return {
          category: "수능 어법: that vs what 구별",
          sentence, full, ko: item.ko, ans: item.ans, options, tip: item.tip
        };
      },
      // 수능 3순위: 가정법 과거 및 과거완료
      () => {
        const items = [
          { ifClause: "If I", ans: "were", wrong: "am", main: "in your shoes, I would accept the proposal", ko: "내가 네 입장이라면, 나는 그 제안을 수락할 텐데", tip: "현재 사실의 반대를 나타내는 가정법 과거에서는 be동사로 인칭에 관계없이 'were'를 씁니다." },
          { ifClause: "If he had known the truth, he", ans: "would have told", wrong: "will tell", main: "us about it", ko: "만약 그가 진실을 알았더라면, 우리에게 말해주었을 텐데", tip: "과거 사실의 반대를 나타내는 가정법 과거완료 귀결절은 '조동사 과거 + have p.p.'를 씁니다." }
        ];
        const item = this.pickRandom(items);
        const sentence = `${item.ifClause} _____ ${item.main}.`;
        const full = `${item.ifClause} ${item.ans} ${item.main}.`;
        const options = this.shuffle([item.ans, item.wrong, "was", "would tell"]);
        return {
          category: "고등 어법: 가정법",
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
