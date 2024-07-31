export const ValidPattern = {
  STRING: /^[0-9ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z ]+$/,
  NUMBER: /^\d+$/,
  DECIMAL: /^(\d+)+(\.\d+)?$/,
};

export const ValidMessage = {
  INVALID_INPUT: "올바르지 않은 형식입니다.",
  INVALID_DATE: "올바르지 않은 날짜입니다.",
  NOT_MATCH_AMOUNT: "수량이 일치하지 않습니다.",
  FORMAT_EMPTY_INPUT: (name: string) => `${name}을(를) 입력해주세요`,
};
