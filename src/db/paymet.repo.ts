import { sql } from '@pgtyped/runtime';
import { Pool } from 'pg';

interface ICreatePaymentQuery {
  params: ICreatePaymentParams;
  result: void;
}

interface ICreatePaymentParams {
  user_id: string;
  amount: number;
  status: 'paid' | 'refused';
}

export class PaymentRepo {
  async createPayment(
    data: ICreatePaymentParams,
    dbClient: Pool,
  ): Promise<null> {
    const selectUserId = sql<ICreatePaymentQuery>`
      insert into payments (user_id, amount, status) values ($user_id, $amount, $status)
    `;
    await selectUserId.run(data, dbClient);
    return null;
  }
}

export const PaymentRepoSymbol = Symbol('PAYMENT_REPO');
export const PaymentRepoProvider = {
  provide: PaymentRepoSymbol,
  useClass: PaymentRepo,
};
