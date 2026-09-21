// 중1 기초 영문법 퀴즈 데이터베이스 (선택형 / 무보기 말하기 / 듣고 답하기)
const GRAMMAR_QUESTIONS = [
  // ==========================================
  // [유형 1: 선택형 + 영어 발음 직접 입력 가능]
  // ==========================================
  {
    id: "choice-1",
    type: "choice",
    category: "Be동사 현재형",
    sentence: "Tom and Jerry _____ good friends.",
    translation: "톰과 제리는 좋은 친구들이다.",
    options: ["is", "are", "am", "be"],
    answer: 1, // "are"
    answerWord: "are",
    acceptableAnswers: ["are", "ah", "our", "2번", "이번"],
    explanation: "주어가 'Tom and Jerry'로 2명(복수)이므로 복수형 be동사 'are'를 씁니다."
  },
  {
    id: "choice-2",
    type: "choice",
    category: "Be동사 현재형",
    sentence: "She _____ an English teacher at our school.",
    translation: "그녀는 우리 학교의 영어 선생님이다.",
    options: ["am", "are", "is", "be"],
    answer: 2, // "is"
    answerWord: "is",
    acceptableAnswers: ["is", "east", "it", "3번", "삼번"],
    explanation: "3인칭 단수 주어(She) 뒤에는 be동사 'is'를 씁니다."
  },
  {
    id: "choice-3",
    type: "choice",
    category: "일반동사 3인칭 단수",
    sentence: "My brother _____ soccer every Sunday.",
    translation: "내 남동생은 매주 일요일에 축구를 한다.",
    options: ["play", "plays", "playing", "played"],
    answer: 1, // "plays"
    answerWord: "plays",
    acceptableAnswers: ["plays", "play", "place", "2번", "이번"],
    explanation: "주어 'My brother'가 3인칭 단수이므로 동사에 -s를 붙여 'plays'를 씁니다."
  },
  {
    id: "choice-4",
    type: "choice",
    category: "인칭대명사 (소유격)",
    sentence: "This is not my bag. It is _____ bag.",
    translation: "이것은 내 가방이 아니다. 그것은 그의 가방이다.",
    options: ["he", "his", "him", "he's"],
    answer: 1, // "his"
    answerWord: "his",
    acceptableAnswers: ["his", "he's", "hiss", "2번", "이번"],
    explanation: "명사(bag) 앞에는 '~의'라는 뜻의 소유격 'his'를 씁니다."
  },
  {
    id: "choice-5",
    type: "choice",
    category: "조동사 + 동사원형",
    sentence: "He can _____ English very well.",
    translation: "그는 영어를 아주 잘 말할 수 있다.",
    options: ["speaks", "speak", "speaking", "spoke"],
    answer: 1, // "speak"
    answerWord: "speak",
    acceptableAnswers: ["speak", "speaks", "spike", "2번", "이번"],
    explanation: "조동사(can) 바로 뒤에는 반드시 '동사원형(speak)'을 씁니다."
  },

  // ==========================================
  // [유형 2: 보기가 없는 주관식 구술형 (Free Speaking)]
  // ==========================================
  {
    id: "speak-1",
    type: "speaking",
    category: "과거시제 불규칙 [말하기 🎙️]",
    sentence: "We _____ to the zoo last weekend.",
    translation: "우리는 지난 주말에 동물원에 갔다.",
    hint: "힌트: go의 과거형 (w _ _ _)",
    answerWord: "went",
    acceptableAnswers: ["went", "when", "wend", "want", "윈트", "웬트"],
    explanation: "과거 표현 'last weekend'가 있으므로 go의 불규칙 과거형인 'went'를 말해야 합니다."
  },
  {
    id: "speak-2",
    type: "speaking",
    category: "일반동사 3인칭 불규칙 [말하기 🎙️]",
    sentence: "Minho _____ a cute puppy.",
    translation: "민호는 귀여운 강아지 한 마리를 가지고 있다.",
    hint: "힌트: have의 3인칭 단수형 (h _ _)",
    answerWord: "has",
    acceptableAnswers: ["has", "have", "had", "해즈", "헤즈"],
    explanation: "주어가 3인칭 단수(Minho)일 때 have는 형태가 불규칙하게 'has'로 바뀝니다."
  },
  {
    id: "speak-3",
    type: "speaking",
    category: "일반동사 부정문 [말하기 🎙️]",
    sentence: "She _____ like spicy food.",
    translation: "그녀는 매운 음식을 좋아하지 않는다.",
    hint: "힌트: 3인칭 단수 부정 조동사 (d _ _ _ _ _ _)",
    answerWord: "doesn't",
    acceptableAnswers: ["doesn't", "does not", "doesnt", "더즌트", "더슨트"],
    explanation: "3인칭 단수 주어(She) 뒤의 일반동사 부정문에는 'doesn't(does not)'를 씁니다."
  },
  {
    id: "speak-4",
    type: "speaking",
    category: "인칭대명사 소유대명사 [말하기 🎙️]",
    sentence: "This umbrella is mine, and that one is _____.",
    translation: "이 우산은 내 것이고, 저것은 너의 것이다.",
    hint: "힌트: '너의 것'에 해당하는 단어 (y _ _ _ _)",
    answerWord: "yours",
    acceptableAnswers: ["yours", "your", "유어스", "유어즈"],
    explanation: "'너의 것(your umbrella)'을 대신하는 소유대명사는 'yours'입니다."
  },
  {
    id: "speak-5",
    type: "speaking",
    category: "기본 전치사 [말하기 🎙️]",
    sentence: "School starts _____ 9 o'clock.",
    translation: "학교는 9시에 시작한다.",
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
    category: "듣기 평가 [리스닝 🔊]",
    audioText: "I was very busy yesterday.",
    displaySentence: "I _____ very busy yesterday.",
    translation: "소리를 잘 듣고 빠진 과거형 Be동사를 영어로 말하세요.",
    missingWord: "was",
    acceptableAnswers: ["was", "what's", "words", "워즈", "워스"],
    explanation: "음성에서 'I was very busy yesterday'라고 발음했습니다. 정답은 'was'입니다."
  },
  {
    id: "listen-2",
    type: "listening",
    category: "듣기 평가 [리스닝 🔊]",
    audioText: "Where does your father work?",
    displaySentence: "Where _____ your father work?",
    translation: "소리를 잘 듣고 빠진 의문문 조동사를 영어로 말하세요.",
    missingWord: "does",
    acceptableAnswers: ["does", "dust", "the", "더즈", "더스"],
    explanation: "음성에서 'Where does your father work?'라고 발음했습니다. 정답은 'does'입니다."
  },
  {
    id: "listen-3",
    type: "listening",
    category: "듣기 평가 [리스닝 🔊]",
    audioText: "I saw an interesting movie yesterday.",
    displaySentence: "I _____ an interesting movie yesterday.",
    translation: "소리를 잘 듣고 빠진 동사의 과거형을 영어로 말하세요.",
    missingWord: "saw",
    acceptableAnswers: ["saw", "so", "sore", "쏘", "서"],
    explanation: "음성에서 see의 과거형인 'saw'를 발음했습니다. 정답은 'saw'입니다."
  },
  {
    id: "listen-4",
    type: "listening",
    category: "듣기 평가 [리스닝 🔊]",
    audioText: "Who is your favorite singer?",
    displaySentence: "_____ is your favorite singer?",
    translation: "소리를 잘 듣고 문장 맨 앞의 의문사를 영어로 말하세요.",
    missingWord: "Who",
    acceptableAnswers: ["who", "hoo", "whose", "후"],
    explanation: "음성에서 'Who is your favorite singer?'라고 발음했습니다. 정답은 'Who'입니다."
  },
  {
    id: "listen-5",
    type: "listening",
    category: "듣기 평가 [리스닝 🔊]",
    audioText: "They invited me to the party.",
    displaySentence: "They invited _____ to the party.",
    translation: "소리를 잘 듣고 빠진 목적격 대명사를 영어로 말하세요.",
    missingWord: "me",
    acceptableAnswers: ["me", "mi", "미"],
    explanation: "음성에서 'They invited me to the party'라고 발음했습니다. 정답은 'me'입니다."
  }
];

if (typeof window !== 'undefined') {
  window.GRAMMAR_QUESTIONS = GRAMMAR_QUESTIONS;
}
