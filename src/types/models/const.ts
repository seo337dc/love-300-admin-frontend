export const enum ENUM_DEPOSIT_TYPE {
  DEPOSIT = 1, // DEPOSIT
  WITHDRAWAL = 0, // WITHDRAWAL
}

export const IsDeposit = {
  DEPOSIT: {name: '입금', value: ENUM_DEPOSIT_TYPE.DEPOSIT},
  WITHDRAWAL: {name: '출금', value: ENUM_DEPOSIT_TYPE.WITHDRAWAL},
  get: (value: boolean) => {
    switch (value){
      case true:
        return IsDeposit.DEPOSIT.name;
      case false:
        return IsDeposit.WITHDRAWAL.name;
      default: return "";
    }
  }
} as const;

export const LOCKUP_STATUS = {
  WAIT: {value: 0, name: "대기"},
  PROGRESS: {value: 1, name: "진행중"},
  END: {value: 2, name: "종료"},
  WITHDRAWAL_END: {value: 3, name: "전액출금완료"},
} as const