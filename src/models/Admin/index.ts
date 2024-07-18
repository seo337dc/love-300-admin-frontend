export class AdminDtoSignInRequest {
  signId?: string;
  password?: string;
}

export class AdminDtoTransactionRequest {
  email?: string;
  address?: string;
  amount?: number;
}
