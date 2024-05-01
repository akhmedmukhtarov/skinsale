import { sql } from '@pgtyped/runtime';
import { Pool } from 'pg';

interface ItransactionQuery {
  params: null;
  result: void;
}

export class Transaction {
  async begin(dbClient: Pool) {
    const transactionBegin = sql<ItransactionQuery>`begin`;
    await transactionBegin.run(null, dbClient);
  }

  async commit(dbClient: Pool) {
    const transactionBegin = sql<ItransactionQuery>`commit`;
    await transactionBegin.run(null, dbClient);
  }

  async rollback(dbClient: Pool) {
    const transactionBegin = sql<ItransactionQuery>`rollback`;
    await transactionBegin.run(null, dbClient);
  }
}

export const transactionSymbol = Symbol('TRANSACTION_SYMBOL');
export const transactionProvider = {
  provide: transactionSymbol,
  useClass: Transaction,
};
