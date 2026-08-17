# Habit Quest

습관 완료를 경험치와 레벨로 연결한 게이미피케이션 습관 관리 서비스입니다.

사용자는 습관을 카테고리별로 등록하고 완료할 수 있습니다. 습관을 완료하면 경험치를 얻으며, 일정 경험치에 도달하면 캐릭터의 레벨이 올라갑니다.

## 주요 기능

- 이메일 기반 회원가입 및 로그인
- 사용자별 습관 등록, 완료, 삭제
- 건강, 학습, 취미, 루틴, 기타 카테고리 분류
- 습관 완료에 따른 경험치 및 레벨 관리
- Supabase Realtime을 이용한 실시간 데이터 동기화
- 레벨 업 모달과 픽셀 Confetti 애니메이션
- 인증 상태에 따른 페이지 접근 제어

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

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## Scripts

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사
```
