# Habit Quest

> 습관을 퀘스트처럼 관리하는 웹 앱

Habit Quest는 매일 반복되는 습관을 작은 퀘스트로 바꿔 관리하는 서비스다.

단순한 체크리스트 앱이 아니라, 오늘 해야 할 행동과 진행 상태를 바로 확인하고, 반복 행동을 조금 더 게임적인 흐름으로 관리하는 데 초점을 둔다.

```text
습관 생성 → 오늘의 퀘스트 확인 → 완료 체크 → 진행률 확인
```

## 주요 기능

- 습관 생성 및 관리
- 오늘의 퀘스트 목록
- 완료 상태 체크
- 진행률 요약
- 기능 단위 폴더 구조
- 재사용 가능한 UI 컴포넌트

## 기술 스택

| 영역 | 기술 |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| UI | React |
| Styling | Tailwind CSS |
| State | Zustand |
| Components | shadcn/ui |
| Deploy | Vercel |

## 구조

```text
habit-quest/
├── app/              # Next.js App Router
├── components/       # 공통 UI 컴포넌트
├── features/         # 기능 단위 모듈
├── lib/              # 공통 유틸
├── docs/adr          # 아키텍처 결정 기록
└── public/           # 정적 파일
```

## 설계 방향

### 기능 단위 구조

이 프로젝트는 단순히 `components`, `hooks`, `utils`처럼 파일 종류별로만 나누지 않는다.

습관 관리, 오늘의 퀘스트, 진행률 표시처럼 기능별로 관심사를 나누고, 관련 UI와 로직을 가까운 위치에 둔다.

```text
features/
  habits/
  quests/
  progress/
```

이 구조는 프로젝트가 커졌을 때 특정 기능과 관련된 파일을 추적하기 쉽게 만든다.

### 상태 관리

습관 목록, 완료 여부, 진행률 계산처럼 여러 화면에서 공유되는 상태는 전역 상태로 관리한다.

반대로 모달 열림 여부, 입력 중인 값처럼 특정 UI에만 필요한 상태는 컴포넌트 내부에 둔다.

```text
공유되는 도메인 상태 → Zustand
일시적인 UI 상태 → local state
```

상태 관리의 핵심은 라이브러리 선택보다, 상태의 소유 위치를 명확히 나누는 것이다.

## 스크린샷

```md
![Home](./public/screenshots/home.png)
![Habit List](./public/screenshots/habit-list.png)
![Progress](./public/screenshots/progress.png)
```

## 실행 방법

```bash
git clone https://github.com/Burgerjoa/habit-quest.git
cd habit-quest
npm install
npm run dev
```

```text
http://localhost:3000
```

## 개선 예정

- 사용자 로그인
- 서버 저장
- 주간/월간 통계
- 연속 달성 streak
- 알림 기능
- 모바일 UI 개선
- 테스트 코드 추가
