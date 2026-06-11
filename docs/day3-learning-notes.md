# 📓 Day 3 학습 노트: Zustand 상태 관리와 Supabase Realtime

Day 3 실시간 동기화 및 스토어 비동기 연동을 진행하면서 직접 학습하고 디버깅한 핵심 내용들을 정리해 둔 문서입니다.

---

## 1. Zustand의 `get()`과 `set()`의 본질

### ❓ 왜 필요한가? (Lexical Scope)
자바스크립트의 객체 리터럴 구조 안에서는 함수가 같은 객체 내부의 다른 형제 프로퍼티(예: `level`, `currentExp`)에 직접 접근할 수 없습니다.
Zustand는 안전하고 정확하게 현재 스토어의 상태를 참조하고 조작할 수 있도록 전용 돋보기(`get`)와 전용 스패너(`set`)를 템플릿 형태로 제공합니다.

### 🔄 매개변수 전달 방식 vs `get()` 방식의 차이
* **매개변수 방식 (비효율형):**
  * 컴포넌트에서 `addExp(10, level, currentExp)`를 호출하려면 컴포넌트가 `level`, `currentExp` 상태를 구독(useStore)하고 있어야 합니다.
  * 이 방식은 화면에 값을 그리지 않는 버튼 컴포넌트라도 매개변수를 공급하기 위해 상태를 구독해야 하므로, **경험치나 레벨이 바뀔 때마다 버튼 컴포넌트가 불필요하게 계속 리렌더링**되는 문제를 낳습니다.
* **`get()` 활용 방식 (최적화형):**
  * 컴포넌트는 오로지 `addExp` 함수만 가져옵니다. (함수는 값이 바뀌지 않으므로 리렌더링을 유발하지 않음)
  * 실제 연산에 필요한 `level`이나 `currentExp`는 스토어 내부에서 `get()`을 통해 동적으로 꺼내 사용하기 때문에 컴포넌트 간 결합도와 성능 면에서 훨씬 우수합니다.

---

## 2. ES6 구조 분해 할당 (Destructuring)의 원리
* `const { error } = await supabase...`
* 우변에 반환되는 거대한 실행 결과 객체 중에서, 내가 필요한 특정 키(`error`)에 해당하는 값만 쏙 뽑아내어 동일한 이름의 로컬 변수로 한 번에 선언하고 매핑하는 자바스크립트의 필수 문법입니다.

---

## 3. Supabase Realtime (실시간 웹소켓 구독)

### 📡 동작 원리
* **웹소켓(Websocket) 연결:** API를 매번 Fetch(Polling)하지 않고 양방향 통신 파이프라인을 뚫어, DB에 변경(INSERT, UPDATE, DELETE)이 감지되는 즉시 Supabase가 브라우저에 신호를 쏴줍니다.
* **이벤트 종류별 데이터 구조 (`payload`):**
  * `INSERT`, `UPDATE`: `payload.new`에 변경된 최신 레코드가 들어있습니다.
  * `DELETE`: 데이터가 삭제되었기 때문에 `payload.new`는 `null`이며, `payload.old`에 기존 키(`id`) 정보만 들어있습니다.
* **필터링 규칙:**
  * `.on('postgres_changes', { filter: 'user_id=eq.UUID' })`와 같이 명확한 식별자 컬럼(`user_id`)을 지정하여 필터링을 걸어야 보안 및 실시간 데이터 격리가 제대로 이루어집니다.

---

## 4. React useEffect와 구독 생명주기 (Lifecycle)

* 실시간 채널 구독(Websocket)은 리소스를 지속적으로 점유합니다.
* 따라서 컴포넌트가 화면에 나타나는 시점(Mount)에 `useEffect` 내부에서 구독을 개시하고, 컴포넌트가 사라지는 시점(Unmount)에 `useEffect`의 **반환(Clean-up) 함수**를 통해 `unsubscribe()`를 실행해 주어야 **메모리 누수(Memory Leak)** 및 중복 소켓 연결 문제를 예방할 수 있습니다.
