# Table HTML Generator

빠르게 간단한 표를 만들어서 HTML로 복사할 수 있는 페이지

프로젝트 기간 24.08~23.09

**React, Typescript, Zustand, Dompurify**

```bash
yarn dev
```

## 주요 기능

- Table 표 텍스트 수정
- 셀 합치기, 셀 나누기
- thead(머리글), tfoot(바닥글) 관리
- th(헤더셀), td(데이터셀) 변환가능 -> 머리글에서는 불가능
- 표 크기 수정
- 드래그로 셀 선택하기
- 선택한 셀 위에서 셀을 조작할 수 있는 우클릭 메뉴
- Table HTML 생성
- HTML 포맷팅, 최소화(공백 제거)
- HTML 탭 사이즈 조절
- 코드 복사
- 미리보기

## 설정

**/src/constants/constants.ts**

```javascript
export const TABLE_SIZE = {
  MIN: 2,
  MAX: 20,
}; // 테이블 행열 최소 최대 크기

export const TAB_SIZE = {
  MIN: 2,
  MAX: 8,
}; // HTML 출력 탭사이즈 최소 최대 크기
```
