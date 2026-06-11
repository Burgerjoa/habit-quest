# 📓 Day 2 학습 노트: Supabase 연동, 인증(Auth) 및 Route Guard

Day 2 Supabase 연동, DB 타입 동기화, Auth 로그인/회원가입 개발, 그리고 Next.js 16 Proxy 가드를 구현하며 학습한 핵심 개념 정리 문서입니다.

---

## 1. Supabase와 PostgreSQL(관계형 데이터베이스)의 설계 철학

### 📊 Relational Database (SQL) vs NoSQL
* **Supabase (PostgreSQL):** 관계형 데이터베이스(RDB)로서 명확한 **테이블 스키마(Schema)**, 고유키(PK), 그리고 테이블 간 관계를 정의하는 **외래키(FK, Foreign Key)**를 사용합니다. 데이터 정합성(Consistency)이 뛰어나고, 테이블 간 관계가 복잡할 때 매우 안전합니다.
* **Firebase (NoSQL):** JSON 기반의 유연한 문서 구조를 가집니다. 스키마가 없어 빠른 프로토타이핑에는 유리하지만, 데이터가 복잡해지면 중복 데이터와 데이터 정합성 훼손 문제를 관리하기가 까다롭습니다.
* **Habit Quest의 선택:** 유저 정보(`profiles`)와 습관(`habits`) 데이터가 1:N 관계를 명확히 맺고, 경험치 및 레벨 계산 등 정합성이 매우 중요하므로 Supabase가 훨씬 적합합니다.

---

## 2. TypeScript와 DB 타입 동기화

### ⚡ 왜 타입을 동기화해야 하는가?
프론트엔드 코드에서 DB의 컬럼명을 타이핑할 때 오타(`is_completed`를 `isCompleted` 등으로 오기)가 나거나, 데이터 타입(숫자 vs 문자열)을 오인하여 생기는 런타임 버그는 개발 과정에서 빈번하게 발생합니다.

### 🔌 Supabase CLI를 통한 타입 동기화 (`database.types.ts`)
* Supabase CLI를 활용해 원격 데이터베이스의 최신 스키마를 TypeScript 파일(`database.types.ts`)로 자동 추출합니다.
* Supabase Client 생성 시 이 스키마 타입을 주입하면, API를 호출할 때(예: `.insert()`, `.select()`) 오타를 즉시 빨간 줄로 잡아주는 컴파일 타임 에러 체크가 가능해집니다.

---

## 3. Supabase Auth와 세션(Session) 관리
* **인증 메커니즘:** Supabase Auth는 로그인 시 사용자에게 **JWT(JSON Web Token)**를 발급합니다.
* **토큰 보관:** 이 토큰은 브라우저의 로컬스토리지 또는 쿠키에 저장되어, 브라우저가 Supabase 서버에 요청을 보낼 때마다 자동으로 헤더에 실려 전송됩니다.
* **상태 감지:** `supabase.auth.onAuthStateChange` 또는 `supabase.auth.getUser()`를 통해 클라이언트 및 서버 사이드에서 현재 사용자의 로그인 상태를 판별하고, 해당 유저의 고유 UUID(`user.id`)를 획득해 데이터를 분리 및 조회할 수 있습니다.

---

## 4. Next.js 16 Proxy Convention (Route Guard)

### 🔒 서버 사이드 가드(Server-side Guard)의 유용성
* **클라이언트 가드 방식 (비추천):** 컴포넌트 내부에서 `useEffect`로 세션을 체크하여 페이지를 넘기는 방식은, 로그인이 안 된 유저에게 찰나의 순간 동안 대시보드 화면이 깜빡이며 보이는 현상(Flicker Effect)과 보안 취약성이 존재합니다.
* **서버 가드 (Next.js 16 Proxy):** 사용자가 브라우저 주소창에 엔터를 치고 서버에 페이지를 요청하는 **그 순간(서버 사이드)**에 세션을 판별하여 가로챕니다. 비인가 사용자는 대시보드 HTML을 다운로드받기 전에 로그인 페이지로 즉시 리다이렉트되어, 보안과 매끄러운 UX를 동시에 해결합니다.
* **Next.js 16 Spec:** 기존의 `middleware.ts` 방식이 최신 스펙에서 루트의 `proxy.ts` 및 `export async function proxy` Convention으로 이관되어, 서버 사이드 가드를 더욱 안전하고 선언적으로 정의할 수 있습니다.
