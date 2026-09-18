# Habit Quest

매일 반복하는 습관을 날짜별로 기록하고, 지난 달성 흐름을 확인하는 개인용 웹 앱입니다.

사용자는 습관을 등록한 뒤 매일 완료를 기록합니다. 완료 기록에서 오늘의 진행률·최근 7일 달성률·습관별 연속 달성일을 계산합니다. 완료 시 경험치를 얻고, 일정 경험치에 도달하면 레벨이 올라갑니다.

## 주요 기능

- 이메일 기반 회원가입 및 로그인
- 사용자별 습관 등록, 이름·카테고리 수정, 보관
- 한국 날짜 기준 일일 완료/취소 기록, 습관별 최근 14일 기록 및 연속 달성일
- 오늘 진행률과 최근 7일 달성 현황
- 건강, 학습, 취미, 루틴, 기타 카테고리 분류
- 습관 완료에 따른 경험치 및 레벨 관리
- Supabase Realtime을 이용한 실시간 데이터 동기화
- 레벨 업 모달과 픽셀 Confetti 애니메이션
- 인증 상태에 따른 페이지 접근 제어

습관 완료 기록과 경험치 변경은 PostgreSQL 함수 한 번의 호출에서 함께 처리합니다. 관리자 통계 페이지나 가상 사용자 데이터는 포함하지 않았습니다.

## 기술 스택

| 분류 | 기술 |
| --- | --- |
| Framework | Next.js 16, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| State Management | Zustand |
| Backend | Supabase Auth, PostgreSQL, Realtime |
| Animation | Framer Motion |
| UI | Radix UI, CVA |

## 프로젝트 구조

```text
habit-quest/
├── app/                 # 페이지와 레이아웃
├── components/ui/       # 공통 UI 컴포넌트
├── features/
│   ├── habit/           # 습관 관리
│   ├── login/           # 로그인 및 회원가입
│   └── quest/           # 경험치와 레벨
├── lib/supabase/        # Supabase 클라이언트와 DB 타입
├── docs/                # 학습 기록과 ADR
└── proxy.ts             # 인증 기반 라우트 보호
```

기능별로 컴포넌트, 타입, 상태를 모아 관리하는 Feature-based 구조를 사용했습니다.

## 시작하기

### 1. 저장소 복제

```bash
git clone https://github.com/Burgerjoa/habit-quest.git
cd habit-quest
npm ci
```

### 2. Supabase 준비

새 Supabase 프로젝트의 SQL Editor에서 [`supabase/setup.sql`](supabase/setup.sql)을 실행한 뒤 [`supabase/daily_habits.sql`](supabase/daily_habits.sql)을 실행합니다. 각 스크립트는 한 번만 실행하세요. 기존 스키마가 설치된 프로젝트라면 `setup.sql`을 재실행하지 말고 `daily_habits.sql`만 적용합니다. 마이그레이션은 기존 습관과 누적 경험치를 보존하지만, 과거의 단일 `is_completed` 값은 실제 완료 날짜를 알 수 없어 일일 기록으로 추정·이관하지 않습니다. 이메일 확인이 켜져 있다면 가입 후 확인 메일의 링크를 열어야 로그인할 수 있습니다.

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 5. 연결 점검

실제 Supabase 프로젝트에 SQL을 적용한 뒤 가입·로그인 → 습관 추가 → 오늘 완료/취소 시 경험치 변화 → 새로고침 후 기록 유지 → 다른 브라우저에서 변경 반영 → 보관 후 과거 기록 유지 순서로 확인합니다. SQL 적용 전에는 새로운 화면이 기존 DB 스키마와 호환되지 않습니다. 공개 배포를 갱신하기 전, DB를 백업하고 마이그레이션을 먼저 적용하세요.

## Scripts

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사
npm test         # 경험치·날짜·주간 집계 테스트
```

## 구현 범위

- 완료 취소 시 해당 일자의 기록과 경험치가 한 트랜잭션에서 함께 되돌아갑니다. 보관은 지난 기록을 삭제하지 않습니다. 보관한 습관을 다시 시작하면 새 습관으로 등록되어 연속 달성일이 0부터 시작합니다.
- `habits.is_completed`와 `habits.streak`는 이전 데이터 호환용으로 남아 있으며, 화면은 날짜별 완료 기록에서 값을 계산합니다. `profiles.total_exp`가 경험치의 기준값이고, 레벨 컬럼도 같은 DB 작업에서 함께 갱신합니다.
- Supabase Auth, 테이블 API, Realtime을 사용하지만 별도의 자체 서버나 운영 중인 서비스는 아닙니다. SQL 마이그레이션과 인증·Realtime의 실제 연결은 본인의 Supabase 프로젝트에서 검증해야 합니다.
