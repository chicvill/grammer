// ========================================================
// GrammarConceptData - 전 학년 핵심 영문법 개념 치트시트 DB
// 문제 풀이 전/후 언제든 열어볼 수 있는 공식, 규칙, 단골 함정, 예문 총정리
// ========================================================

const GRAMMAR_CONCEPT_REGISTRY = {
  // 1. [초등 5~6학년] 현재진행형 (be + -ing)
  'elem-high-progressive': {
    title: '현재진행형 (Present Continuous)',
    gradeBadge: '초등 5~6 필수',
    formula: '주어 + be동사(am / are / is) + 동사-ing',
    usage: '지금 말하고 있는 이 순간에 일어나는 동작("지금 ~하고 있는 중이다")을 나타냅니다.',
    rules: [
      '대부분의 동사: 동사원형 + -ing (play ➔ playing, watch ➔ watching)',
      '-e로 끝나는 동사: e를 빼고 + -ing (make ➔ making, write ➔ writing, ride ➔ riding)',
      '단모음+단자음 동사: 마지막 자음을 한 번 더 쓰고 + -ing (run ➔ running, swim ➔ swimming, sit ➔ sitting)'
    ],
    trap: {
      wrong: 'He listening to music now. (be동사 누락 ❌)',
      correct: 'He is listening to music now. (be동사 + -ing ✅)'
    },
    examples: [
      'He is listening to music right now. (그는 지금 음악을 듣고 있다.)',
      'They are playing soccer in the park. (그들은 공원에서 축구를 하고 있다.)',
      'I am watching TV at home. (나는 집에서 TV를 보고 있다.)'
    ]
  },

  // 2. [초등 5~6학년] 조동사 can
  'elem-high-modal-can': {
    title: '조동사 can (Modal Verb Can)',
    gradeBadge: '초등 5~6 필수',
    formula: '주어 + can + 동사원형 (Base Form)',
    usage: '~할 수 있다(능력) 또는 ~해도 좋다(허가)를 나타내며, 본동사를 도와주는 역할을 합니다.',
    rules: [
      '조동사 can 바로 뒤에는 언제나 동사의 원래 형태인 "동사원형"만 옵니다.',
      '부정문은 can not (줄여서 can\'t), 의문문은 Can을 주어 앞으로 보냅니다. (Can you ~?)'
    ],
    trap: {
      wrong: 'She can swims very fast. (주어가 3인칭 단수여도 -s 금지! ❌)',
      correct: 'She can swim very fast. (can 뒤에는 무조건 동사원형! ✅)'
    },
    examples: [
      'She can swim very fast. (그녀는 아주 빠르게 수영할 수 있다.)',
      'He can speak English well. (그는 영어를 잘 말할 수 있다.)',
      'My brother can ride a bicycle. (내 남동생은 자전거를 탈 수 있다.)'
    ]
  },

  // 3. [초등 3~4학년] Be동사 기초 (am, are, is)
  'elem-low-be': {
    title: 'Be동사 현재형 (am, are, is)',
    gradeBadge: '초등 3~4 기초',
    formula: '주어의 인칭과 수에 따라 알맞은 Be동사 짝꿍 선택',
    usage: '~이다(신분/상태) 또는 ~에 있다(장소)를 나타냅니다.',
    rules: [
      '1인칭 나 (I) ➔ am',
      '2인칭 너 / 복수 (You, We, They, Tom and Jerry) ➔ are',
      '3인칭 단수 (He, She, It, This, That, My friend) ➔ is'
    ],
    trap: {
      wrong: 'Tom and Jerry is good friends. (2명이므로 단수 is 금지! ❌)',
      correct: 'Tom and Jerry are good friends. (2명 복수이므로 are! ✅)'
    },
    examples: [
      'I am a student. (나는 학생이다.)',
      'You are tall. (너는 키가 크다.)',
      'She is a nice teacher. (그녀는 좋은 선생님이다.)'
    ]
  },

  // 4. [초등 3~4학년] 지시대명사 (This, That, These, Those)
  'elem-low-demonstrative': {
    title: '지시대명사 (This / That / These / Those)',
    gradeBadge: '초등 3~4 기초',
    formula: '가까운 것(단수 This / 복수 These) vs 먼 것(단수 That / 복수 Those)',
    usage: '가까이 있거나 멀리 있는 사물/사람을 가리킬 때 씁니다.',
    rules: [
      '가까운 1개 (This is ~) vs 가까운 여러 개 (These are ~)',
      '멀리 있는 1개 (That is ~) vs 멀리 있는 여러 개 (Those are ~)'
    ],
    trap: {
      wrong: 'These is my books. (복수에는 is 금지! ❌)',
      correct: 'These are my books. (복수 These 뒤에는 are! ✅)'
    },
    examples: [
      'This is an apple. (이것은 사과이다.)',
      'Those are yellow flowers. (저것들은 노란 꽃들이다.)'
    ]
  },

  // 5. [중학 1학년] 일반동사 3인칭 단수 현재형
  'mid-1-third-person': {
    title: '일반동사 3인칭 단수 현재형 (-s / -es)',
    gradeBadge: '중1 핵심',
    formula: '3인칭 단수 주어 (He / She / It / 사람1명) + 동사-s / -es',
    usage: '주어가 나(I), 너(You)가 아닌 제3자 단 1명이고 현재의 일상적 사실이나 습관일 때 동사에 -s/-es를 붙입니다.',
    rules: [
      '대부분: 동사 + -s (play ➔ plays, like ➔ likes)',
      '-s, -sh, -ch, -x, -o로 끝날 때: + -es (watch ➔ watches, go ➔ goes)',
      '불규칙 have: have ➔ has'
    ],
    trap: {
      wrong: 'My brother play soccer every Sunday. (단수 주어에 -s 누락 ❌)',
      correct: 'My brother plays soccer every Sunday. (3인칭 단수이므로 plays! ✅)'
    },
    examples: [
      'Minho has a cute puppy. (민호는 귀여운 강아지를 가지고 있다.)',
      'She watches TV in the evening. (그녀는 저녁에 TV를 본다.)'
    ]
  },

  // 6. [중학 1학년] 불규칙 과거시제
  'mid-1-past': {
    title: '불규칙 과거시제 (Irregular Past Tense)',
    gradeBadge: '중1 핵심',
    formula: '과거 시간 부사구(yesterday, last ~, ~ ago) + 과거형 동사',
    usage: '과거에 이미 끝난 동작이나 상태를 나타냅니다.',
    rules: [
      '불규칙 동사는 -ed가 붙지 않고 형태가 완전히 바뀝니다.',
      'go ➔ went / see ➔ saw / buy ➔ bought / eat ➔ ate / have ➔ had / make ➔ made'
    ],
    trap: {
      wrong: 'We goed to the zoo last weekend. (goed라는 단어는 없음! ❌)',
      correct: 'We went to the zoo last weekend. (go의 과거형은 went! ✅)'
    },
    examples: [
      'We went to the zoo last weekend. (우리는 지난 주말에 동물원에 갔다.)',
      'I saw an interesting movie yesterday. (나는 어제 흥미로운 영화를 보았다.)'
    ]
  },

  // 7. [중학 2학년] to부정사 & 동명사 목적어
  'mid-2-gerund': {
    title: '동명사만을 목적어로 취하는 동사',
    gradeBadge: '중2 핵심',
    formula: 'enjoy, finish, practice, avoid, mind + 동명사(-ing)',
    usage: '특정 동사들은 목적어로 to부정사가 아닌 동명사(-ing)만을 짝꿍으로 둡니다.',
    rules: [
      '동명사(-ing)를 좋아하는 동사: enjoy, finish, practice, keep, give up',
      'to부정사를 좋아하는 동사: want, hope, wish, decide, plan'
    ],
    trap: {
      wrong: 'I enjoy to read comic books. (enjoy 뒤에 to부정사 금지! ❌)',
      correct: 'I enjoy reading comic books. (enjoy 뒤에는 동명사 -ing! ✅)'
    },
    examples: [
      'I enjoy reading comic books. (나는 만화책 읽는 것을 즐긴다.)',
      'She finished doing her homework. (그녀는 숙제하는 것을 끝마쳤다.)'
    ]
  },

  // 8. [중학 2학년] 수동태 (Passive Voice)
  'mid-2-passive': {
    title: '수동태 (be동사 + 과거분사 p.p.)',
    gradeBadge: '중2 핵심',
    formula: '주어 + be동사(is/was/are/were) + 과거분사(p.p.) + by 행위자',
    usage: '주어가 행동을 직접 하는 것이 아니라, "~에 의해 되다/당하다"라는 뜻입니다.',
    rules: [
      '시제에 따라 be동사를 변형: 현재는 is/are, 과거는 was/were',
      '동사는 반드시 3번째 형태인 과거분사(p.p.)를 사용: break-broke-broken, write-wrote-written'
    ],
    trap: {
      wrong: 'The window was break by Tom. (원형 금지! ❌)',
      correct: 'The window was broken by Tom. (과거분사 broken! ✅)'
    },
    examples: [
      'The window was broken by Tom. (그 창문은 톰에 의해 깨졌다.)',
      'This book was written by a famous writer. (이 책은 유명 작가에 의해 쓰였다.)'
    ]
  },

  // 9. [중학 2학년] 비교급
  'mid-2-comparative': {
    title: '형용사의 비교급 (-er than)',
    gradeBadge: '중2 핵심',
    formula: '형용사-er (또는 more 형용사) + than (~보다 더 ...한)',
    usage: '두 대상의 성질이나 상태를 비교할 때 씁니다.',
    rules: [
      '대부분의 짧은 단어: 형용사 + -er (tall ➔ taller, fast ➔ faster)',
      '3음절 이상의 긴 단어: more + 형용사 (more beautiful, more expensive)',
      '뒤에 반드시 비교 대상 앞의 \'than\'(~보다)이 짝꿍으로 옵니다.'
    ],
    trap: {
      wrong: 'Tom is more tall than Minho. (tall은 1음절이므로 more 금지! ❌)',
      correct: 'Tom is taller than Minho. (taller than! ✅)'
    },
    examples: [
      'Tom is taller than Minho. (톰은 민호보다 키가 더 크다.)',
      'A train is faster than a bus. (기차는 버스보다 더 빠르다.)'
    ]
  },

  // 10. [중학 3학년] 현재완료 시제
  'mid-3-present-perfect': {
    title: '현재완료 시제 (have / has + p.p.)',
    gradeBadge: '중3 심화',
    formula: '주어 + have / has + 과거분사(p.p.)',
    usage: '과거에 시작된 일이 현재까지 영향을 미칠 때 쓰며 4가지 용법(완료, 경험, 계속, 결과)이 있습니다.',
    rules: [
      '계속 (for ~동안, since ~이래로): 과거부터 지금까지 쭉 살아옴',
      '경험 (ever, never, before, twice): 과거에 ~해 본 적이 있음',
      '완료 (already, just, yet): 방금 막 끝마침'
    ],
    trap: {
      wrong: 'I have live in Seoul for 5 years. (원형 live 금지! ❌)',
      correct: 'I have lived in Seoul for 5 years. (과거분사 lived! ✅)'
    },
    examples: [
      'I have lived in Seoul for five years. (나는 5년 동안 서울에서 살아왔다.)',
      'She has visited Paris twice. (그녀는 파리를 두 번 방문해 본 적이 있다.)'
    ]
  },

  // 11. [고등 / 수능] 어법
  'high-advanced': {
    title: '수능 실전 어법: 가정법 & 접속사',
    gradeBadge: '고등/수능 실전',
    formula: '가정법 과거: If + 주어 + were/과거동사, 주어 + 조동사과거 + 동사원형',
    usage: '현재 사실과 정반대의 가정을 나타낼 때 be동사는 인칭에 무관하게 were를 씁니다.',
    rules: [
      '가정법 과거: 현재 사실 반대 ("만약 ~라면 ...할 텐데")',
      'that vs what: 뒤에 완전한 절이면 that, 불완전하고 선행사 없으면 what'
    ],
    trap: {
      wrong: 'If I was in your shoes... (가정법에서는 were가 원칙! ❌)',
      correct: 'If I were in your shoes, I would accept it. (were + would + 동사원형! ✅)'
    },
    examples: [
      'If I were in your shoes, I would accept the proposal. (내가 네 입장이라면 수락할 텐데.)',
      'We must focus on what is really important. (우리는 정말 중요한 것에 집중해야 한다.)'
    ]
  }
};

// 현재 문제 객체를 분석하여 가장 적합한 개념 카드 데이터를 반환하는 헬퍼 함수
function getConceptForQuestion(question) {
  if (!question) return GRAMMAR_CONCEPT_REGISTRY['elem-high-progressive'];

  const cat = (question.category || '').toLowerCase();
  const grade = (question.grade || '').toLowerCase();
  const text = `${cat} ${grade} ${(question.sentence || '')}`.toLowerCase();

  // 1. 초등 5~6 현재진행형
  if (text.includes('진행형') || text.includes('progressive') || text.includes('listening') || text.includes('reading') || text.includes('playing')) {
    return GRAMMAR_CONCEPT_REGISTRY['elem-high-progressive'];
  }
  // 2. 초등 5~6 조동사 can
  if (text.includes('조동사') || text.includes('can') || text.includes('능력')) {
    return GRAMMAR_CONCEPT_REGISTRY['elem-high-modal-can'];
  }
  // 3. 초등 3~4 지시대명사
  if (text.includes('지시대명사') || text.includes('this') || text.includes('these') || text.includes('that') || text.includes('those')) {
    return GRAMMAR_CONCEPT_REGISTRY['elem-low-demonstrative'];
  }
  // 4. 초등 3~4 Be동사
  if (grade === 'elem-low' || text.includes('초등 3~4 be동사')) {
    return GRAMMAR_CONCEPT_REGISTRY['elem-low-be'];
  }
  // 5. 중1 일반동사 3인칭 단수
  if (text.includes('3인칭') || text.includes('일반동사 현재형') || text.includes('plays') || text.includes('watches')) {
    return GRAMMAR_CONCEPT_REGISTRY['mid-1-third-person'];
  }
  // 6. 중1 과거시제
  if (text.includes('과거') || text.includes('past') || text.includes('went') || text.includes('saw') || text.includes('bought')) {
    return GRAMMAR_CONCEPT_REGISTRY['mid-1-past'];
  }
  // 7. 중2 동명사 / to부정사
  if (text.includes('동명사') || text.includes('to부정사') || text.includes('enjoy')) {
    return GRAMMAR_CONCEPT_REGISTRY['mid-2-gerund'];
  }
  // 8. 중2 수동태
  if (text.includes('수동태') || text.includes('passive') || text.includes('broken') || text.includes('written')) {
    return GRAMMAR_CONCEPT_REGISTRY['mid-2-passive'];
  }
  // 9. 중2 비교급
  if (text.includes('비교급') || text.includes('taller') || text.includes('than')) {
    return GRAMMAR_CONCEPT_REGISTRY['mid-2-comparative'];
  }
  // 10. 중3 현재완료
  if (text.includes('현재완료') || text.includes('lived') || text.includes('visited')) {
    return GRAMMAR_CONCEPT_REGISTRY['mid-3-present-perfect'];
  }
  // 11. 고등
  if (grade === 'high' || text.includes('가정법') || text.includes('what vs that')) {
    return GRAMMAR_CONCEPT_REGISTRY['high-advanced'];
  }

  // 기본 매칭: Be동사 현재형
  return GRAMMAR_CONCEPT_REGISTRY['elem-low-be'];
}

window.grammarConceptData = {
  registry: GRAMMAR_CONCEPT_REGISTRY,
  getConceptForQuestion: getConceptForQuestion
};
