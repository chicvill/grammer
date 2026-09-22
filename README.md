# Grammar Quest TV (초3 ~ 고3 영문법 TV 퀘스트)

샤오미 TV(안드로이드 TV / 구글 TV) 리모컨(D-Pad)과 음성 인식(Web Speech API)으로 조작하는 **초3 ~ 고3(수능) 전 학년 맞춤형 무한 영문법 학습 웹 게임**입니다.

---

## 🌟 주요 특징

1. **6단계 학년별 정규 교육과정 문법 엔진**:
   * **초등 3~4학년**: Be동사 현재형(`am/are/is`), 지시대명사(`This/That/These/Those`), 기초 인칭대명사
   * **초등 5~6학년**: 현재진행형(`be + -ing`), 조동사 `can`, 기본 의문사(`What/Who/Where`)
   * **중학 1학년**: 일반동사 3인칭 단수(`-s/-es/has/goes`), 과거시제 불규칙, 부정/의문문(`do/does/did`)
   * **중학 2학년**: to부정사, 동명사 목적어(`enjoy/finish + -ing`), 수동태(`be + p.p.`), 비교급(`-er than`)
   * **중학 3학년**: 현재완료(`have + p.p.`), 관계대명사(`who/which/that`), 접속사 `that`
   * **고등 1~3 / 수능**: 수능 빈출 5대 어법 (주어-동사 수일치, `that vs what`, 가정법, 분사구문)

2. **무한 문장 절차적 생성 (Procedural Generation)**:
   * 고정된 문제 은행을 넘어, 주어·동사·목적어·시제 문법 규칙을 실시간 조합하여 수천~수만 개의 자연스러운 예문 무한 생성

3. **3가지 인터랙티브 퀘스트 유형**:
   * **선택형 (Choice)**: 4지선다형 2x2 그리드 + 리모컨/영어 발음 선택
   * **무보기 말하기 (Free Speaking)**: 보기를 숨기고 힌트만 보고 정답 단어를 마이크에 직접 발음
   * **듣기 평가 (Listening & Answer)**: 브라우저 내장 원어민 영어 TTS로 문장을 듣고 빈칸 단어 구술

4. **10-Foot TV UI 최적화**:
   * 샤오미 TV 스틱 리모컨 D-Pad(상/하/좌/우/OK) 완벽 대응
   * 거실 소파 거리에서도 선명한 44px+ 대형 폰트 및 오버스캔 방지 5% 안전 영역 확보
   * Web Audio API 레트로 아케이드 효과음 내장

---

## 🚀 실행 방법

### 로컬 실행
```bash
node server.js
```
브라우저에서 `http://localhost:3000` 접속

### 샤오미 TV에서 접속
1. 샤오미 TV 스틱에서 **`TV Bro`** 브라우저 설치 및 실행
2. 주소창에 PC의 로컬 네트워크 IP 입력 (예: `http://192.168.x.x:3000`)
3. 전체화면 모드(F11)로 플레이

### 🐳 Docker로 실행
```bash
docker compose up -d
```
브라우저에서 `http://localhost:3000` 접속

### ☁️ 구글 클라우드(Google Cloud Run) 배포
자세한 배포 가이드는 [DEPLOY_GCP.md](DEPLOY_GCP.md)를 참고하세요.
```bash
# Windows 환경에서 원클릭 배포
deploy-cloudrun.bat
```
