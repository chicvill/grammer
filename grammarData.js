// 중1 기초 영문법 퀴즈 데이터베이스 (선택형 / 무보기 말하기 / 듣고 답하기)
const GRAMMAR_QUESTIONS = [
// ==========================================
// [유형 1: 선택형 + 영어 발음 직접 입력 가능]
// ==========================================
{
  id: "choice-1",
  type: "choice",
  category: "Be동사 현재형 [AI/컴퓨팅 💻]",
  sentence: "Python and JavaScript _____ powerful programming languages.",
  translation: "파이썬과 자바스크립트는 강력한 프로그래밍 언어들이다.",
  options: ["is", "are", "am", "be"],
  answer: 1, // "are"
  answerWord: "are",
  acceptableAnswers: ["are", "ah", "our", "2번", "이번"],
  explanation: "주어 'Python and JavaScript'는 2개의 프로그래밍 언어(복수 주어)이므로 복수형 Be동사 'are'를 씁니다."
},
{
  id: "choice-2",
  type: "choice",
  category: "Be동사 현재형 [인공지능 🤖]",
  sentence: "An AI assistant _____ very helpful in our science lab.",
  translation: "AI 어시스턴트는 우리 과학 연구실에서 매우 유용하다.",
  options: ["am", "are", "is", "be"],
  answer: 2, // "is"
  answerWord: "is",
  acceptableAnswers: ["is", "east", "it", "3번", "삼번"],
  explanation: "주어 'An AI assistant'가 3인칭 단수이므로 Be동사 'is'를 씁니다."
},
{
  id: "choice-3",
  type: "choice",
  category: "일반동사 3인칭 단수 [데이터 분석 📊]",
  sentence: "The smart algorithm _____ big data every second.",
  translation: "그 스마트 알고리즘은 매초마다 빅데이터를 분석한다.",
  options: ["analyze", "analyzes", "analyzing", "analyzed"],
  answer: 1, // "analyzes"
  answerWord: "analyzes",
  acceptableAnswers: ["analyzes", "analyze", "2번", "이번"],
  explanation: "주어 'The smart algorithm'이 3인칭 단수이므로 동사 끝에 -(e)s를 붙인 'analyzes'를 씁니다."
},
{
  id: "choice-4",
  type: "choice",
  category: "인칭대명사 (소유격) [소프트웨어 💾]",
  sentence: "This is not my code. It is _____ program.",
  translation: "이것은 내 코드가 아니다. 그것은 그의 프로그램이다.",
  options: ["he", "his", "him", "he's"],
  answer: 1, // "his"
  answerWord: "his",
  acceptableAnswers: ["his", "he's", "hiss", "2번", "이번"],
  explanation: "명사(program) 앞에는 '~의'라는 뜻의 소유격 인칭대명사 'his'를 씁니다."
},
{
  id: "choice-5",
  type: "choice",
  category: "조동사 + 동사원형 [양자컴퓨팅 ⚛️]",
  sentence: "Quantum computers can _____ complex equations very quickly.",
  translation: "양자 컴퓨터는 복잡한 수학 방정식을 매우 빠르게 풀 수 있다.",
  options: ["solve", "solves", "solving", "solved"],
  answer: 0, // "solve"
  answerWord: "solve",
  acceptableAnswers: ["solve", "solves", "1번", "일번"],
  explanation: "조동사(can) 바로 뒤에는 시제나 인칭과 상관없이 언제나 '동사원형(solve)'을 씁니다."
},

// ==========================================
// [유형 2: 보기가 없는 주관식 구술형 (Free Speaking)]
// ==========================================
{
  id: "speak-1",
  type: "speaking",
  category: "과거시제 불규칙 [우주 과학 🚀]",
  sentence: "The rover _____ to Mars last year.",
  translation: "그 탐사선(rover)은 작년에 화성에 갔다.",
  hint: "힌트: go의 과거형 (w _ _ _)",
  answerWord: "went",
  acceptableAnswers: ["went", "when", "wend", "want", "윈트", "웬트"],
  explanation: "과거 시점인 'last year'가 있으므로 go의 불규칙 과거형인 'went'를 말해야 합니다."
},
{
  id: "speak-2",
  type: "speaking",
  category: "일반동사 3인칭 불규칙 [로봇공학 🤖]",
  sentence: "The humanoid robot _____ an advanced optical sensor.",
  translation: "그 휴머노이드 로봇은 첨단 광학 센서를 가지고 있다.",
  hint: "힌트: have의 3인칭 단수형 (h _ _)",
  answerWord: "has",
  acceptableAnswers: ["has", "have", "had", "해즈", "헤즈"],
  explanation: "주어가 3인칭 단수(The humanoid robot)일 때 have의 불규칙 3인칭 단수형인 'has'를 씁니다."
},
{
  id: "speak-3",
  type: "speaking",
  category: "일반동사 부정문 [자율주행 🚗]",
  sentence: "An autonomous vehicle _____ collide with obstacles.",
  translation: "자율주행 자동차는 장애물과 충돌하지 않는다.",
  hint: "힌트: 3인칭 단수 부정 조동사 (d _ _ _ _ _ _)",
  answerWord: "doesn't",
  acceptableAnswers: ["doesn't", "does not", "doesnt", "더즌트", "더슨트"],
  explanation: "3인칭 단수 주어(An autonomous vehicle) 뒤의 일반동사 부정문에는 'doesn't(does not)'를 씁니다."
},
{
  id: "speak-4",
  type: "speaking",
  category: "인칭대명사 소유대명사 [AI 알고리즘 🧠]",
  sentence: "This neural network is mine, and that algorithm is _____.",
  translation: "이 인공신경망은 내 것이고, 저 알고리즘은 너의 것이다.",
  hint: "힌트: '너의 것'에 해당하는 단어 (y _ _ _ _)",
  answerWord: "yours",
  acceptableAnswers: ["yours", "your", "유어스", "유어즈"],
  explanation: "'너의 것(your algorithm)'을 대신하는 소유대명사는 'yours'입니다."
},
{
  id: "speak-5",
  type: "speaking",
  category: "기본 전치사 [로켓 발사 🛰️]",
  sentence: "The rocket launch begins _____ 9 o'clock.",
  translation: "로켓 발사는 9시에 시작된다.",
  hint: "힌트: 시각(9시) 앞에 쓰는 전치사 (a _)",
  answerWord: "at",
  acceptableAnswers: ["at", "act", "ad", "앳", "엣"],
  explanation: "구체적인 시각 앞에는 시간 전치사 'at'을 씁니다."
},

// ==========================================
// [유형 3: 듣고 답하는 리스닝 평가 (Listening & Answer)]
// ==========================================
{
  id: "listen-1",
  type: "listening",
  category: "듣기 평가 [슈퍼컴퓨터 ⚡]",
  audioText: "The supercomputer was very fast yesterday.",
  displaySentence: "The supercomputer _____ very fast yesterday.",
  translation: "소리를 잘 듣고 빠진 과거형 Be동사를 영어로 말하세요.",
  missingWord: "was",
  acceptableAnswers: ["was", "what's", "words", "워즈", "워스"],
  explanation: "음성에서 'The supercomputer was very fast yesterday'라고 발음했습니다. 정답은 'was'입니다."
},
{
  id: "listen-2",
  type: "listening",
  category: "듣기 평가 [AI 엔지니어 🔬]",
  audioText: "Where does the AI engineer work?",
  displaySentence: "Where _____ the AI engineer work?",
  translation: "소리를 잘 듣고 빠진 의문문 조동사를 영어로 말하세요.",
  missingWord: "does",
  acceptableAnswers: ["does", "dust", "the", "더즈", "더스"],
  explanation: "음성에서 'Where does the AI engineer work?'라고 발음했습니다. 정답은 'does'입니다."
},
{
  id: "listen-3",
  type: "listening",
  category: "듣기 평가 [우주 천문학 🔭]",
  audioText: "The astronomer saw a new galaxy yesterday.",
  displaySentence: "The astronomer _____ a new galaxy yesterday.",
  translation: "소리를 잘 듣고 빠진 동사의 과거형을 영어로 말하세요.",
  missingWord: "saw",
  acceptableAnswers: ["saw", "so", "sore", "쏘", "서"],
  explanation: "음성에서 see의 과거형인 'saw'를 발음했습니다. 정답은 'saw'입니다."
},
{
  id: "listen-4",
  type: "listening",
  category: "듣기 평가 [미래 로봇 발명 💡]",
  audioText: "Who is the inventor of this smart robot?",
  displaySentence: "_____ is the inventor of this smart robot?",
  translation: "소리를 잘 듣고 문장 맨 앞의 의문사를 영어로 말하세요.",
  missingWord: "Who",
  acceptableAnswers: ["who", "hoo", "whose", "후"],
  explanation: "음성에서 'Who is the inventor of this smart robot?'라고 발음했습니다. 정답은 'Who'입니다."
},
{
  id: "listen-5",
  type: "listening",
  category: "듣기 평가 [수학 문제 해결 📐]",
  audioText: "The AI system assisted me with the math problem.",
  displaySentence: "The AI system assisted _____ with the math problem.",
  translation: "소리를 잘 듣고 빠진 목적격 대명사를 영어로 말하세요.",
  missingWord: "me",
  acceptableAnswers: ["me", "mi", "미"],
  explanation: "음성에서 'The AI system assisted me with the math problem'라고 발음했습니다. 정답은 'me'입니다."
}
];

if (typeof window !== 'undefined') {
  window.GRAMMAR_QUESTIONS = GRAMMAR_QUESTIONS;
}
