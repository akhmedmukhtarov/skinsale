import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CallbackDto } from './dto/callback.dto';
import { UserRepo, UserRepoSymbol } from './db/user.repo';
import axios from 'axios';
import { PaymentRepo, PaymentRepoSymbol } from './db/paymet.repo';
import { Transaction, transactionSymbol } from './db/transaction';
import { dbClientSymbol } from './db/connection';
import { Pool } from 'pg';

@Injectable()
export class AppService {
  constructor(
    @Inject(UserRepoSymbol) private readonly userRepo: UserRepo,
    @Inject(PaymentRepoSymbol) private readonly paymentRepo: PaymentRepo,
    @Inject(transactionSymbol) private readonly transaction: Transaction,
    @Inject(dbClientSymbol) private readonly client: Pool,
  ) {}
  async getItems(): Promise<Record<string, number | string>[]> {
    try {
      const [{ data: tradables }, { data: nonTradables }] = await Promise.all([
        axios.get('https://api.skinport.com/v1/items?tradable=true'),
        axios.get('https://api.skinport.com/v1/items'),
      ]);
      const merged = {};
      for (const item of [...tradables, ...nonTradables]) {
        if (merged[item['market_hash_name']] == undefined) {
          merged[item['market_hash_name']] = {
            market_hash_name: item.market_hash_name,
            tradable: item.min_price,
          };
        } else {
          merged[item['market_hash_name']].non_tradable = item.min_price;
        }
      }
      return Object.values(merged);
    } catch (error) {
      throw new Error('Error fetching items data');
    }
  }

  async callback(dto: CallbackDto) {
    const { amount, id, status } = dto;
    if (status == 'refused') {
      throw new NotAcceptableException('Payment status is refused');
    }
    const user = await this.userRepo.getById(id, this.client);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.transaction.begin(this.client);

    try {
      await this.paymentRepo.createPayment(
        {
          user_id: user.id,
          amount,
          status,
        },
        this.client,
      );
      await this.userRepo.updateUser(
        {
          id: dto.id,
          balance: +user.balance + +amount,
        },
        this.client,
      );
      await this.transaction.commit(this.client);
    } catch (error) {
      await this.transaction.rollback(this.client);
      throw new InternalServerErrorException();
    }
  }
}
