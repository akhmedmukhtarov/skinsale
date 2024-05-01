import { sql } from '@pgtyped/runtime';
import { Pool } from 'pg';

interface ISelectUserIdsQuery {
  params: ISelectUserIdsParams;
  result: ISelectUserIdsResult;
}

interface IUpdateUserQuery {
  params: IUpdateUserParams;
  result: void;
}

interface IUpdateUserParams {
  id: string;
  balance?: number | void | null;
  username?: string | void | null;
}

interface ISelectUserIdsParams {
  id: string;
}

interface ISelectUserIdsResult {
  id: string;
  username: string;
  balance: number;
}

export class UserRepo {
  async getById(
    id: string,
    dbClient: Pool,
  ): Promise<ISelectUserIdsResult | null> {
    const selectUserId = sql<ISelectUserIdsQuery>`select * from users where id = $id`;
    const [user] = await selectUserId.run({ id }, dbClient);
    return user || null;
  }

  async updateUser(data: IUpdateUserParams, dbClient: Pool) {
    const updateUser = sql<IUpdateUserQuery>`
      update users set 
      username = coalesce($username,username), 
      balance = coalesce($balance,balance) 
      where id = $id
    `;
    await updateUser.run(data, dbClient);
    return null;
  }
}

export const UserRepoSymbol = Symbol('USER_REPO');
export const UserRepoProvider = {
  provide: UserRepoSymbol,
  useClass: UserRepo,
};
