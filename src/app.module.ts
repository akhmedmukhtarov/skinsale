import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserRepoProvider } from './db/user.repo';
import { PaymentRepoProvider } from './db/paymet.repo';
import { transactionProvider } from './db/transaction';
import { dbClientProvider } from './db/connection';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    UserRepoProvider,
    PaymentRepoProvider,
    transactionProvider,
    dbClientProvider,
  ],
})
export class AppModule {}
