import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserRepoProvider } from './db/user.repo';
import { PaymentRepoProvider } from './db/paymet.repo';
import { transactionProvider } from './db/transaction';
import { dbClientProvider } from './db/connection';
import { CallbackDto } from './dto/callback.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        UserRepoProvider,
        PaymentRepoProvider,
        transactionProvider,
        dbClientProvider,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return array of objects', () => {
      const result = [
        {
          market_hash_name: '10 Year Birthday Sticker Capsule',
          tradable: 0.85,
          non_tradable: 0.79,
        },
      ];
      jest.spyOn(appService, 'getItems').mockImplementation(async () => result);
      expect(appController.getItems()).resolves.toEqual(result);
    });

    it('should not validate dto', async () => {
      const body = {
        id: 's',
        amount: 0,
        status: 'refusedd',
      };
      const dto = plainToInstance(CallbackDto, body);
      const errors = await validate(dto);
      expect(errors.length).toBe(3);
    });
  });
});
