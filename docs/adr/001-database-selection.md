# ADR 0001: Habit Quest 백엔드 및 데이터베이스 선정 (Supabase vs Firebase)

## 1. Context (맥락)
- 게이미피케이션 습관 관리 서비스 'Habit Quest'에서 유저 데이터, 습관 스트릭 정보, 퀘스트 레벨 스탯을 저장하고 인증(Auth)을 처리할 백엔드 플랫폼이 필요함.
- 포트폴리오 목적에 적합하고, Next.js App Router 스택과의 시너지를 고려해야 함.

## 2. Alternatives (대안들)
- **대안 A: Firebase (Firestore)**
  - 장점: NoSQL이라 구조 변경이 자유롭고 초기 개발이 빠름
  - 단점: 데이터 간 관계 설정이나 통계 집계 어려움
- **대안 B: Supabase (PostgreSQL)**
  - 장점: RDB가 가능하여 통계 쿼리가 용이함, TypeScript와 타입 호환 잘됨
  - 단점: 초기 테이블 규칙 설계가 엄격함

## 3. Decision (결정)
- 우리는 **Supabase**를 최종 백엔드로 선택함.
- **선택 근거 (Why)**:
  1. : Supabase는 RDB 기반으로 설계되어 있어, 습관 데이터와 스트릭 정보를 관계형으로 관리하기 유리함.
  2. : TypeScript와 타입 호환성이 뛰어나고 초기 타입 생성이 용이함
  3. : Next.js App Router와의 아키텍처 연계가 매끄러움

## 4. Consequences (결과 및 영향)
- **긍정적 영향**: Next.js App Router 및 TypeScript와의 강력한 타입 호환, RDB 설계를 통한 복잡한 통계 쿼리 구현 가능.
- **감수할 점**: Supabase의 로컬 설정 및 CLI 환경에 적응하는 시간이 필요함.
