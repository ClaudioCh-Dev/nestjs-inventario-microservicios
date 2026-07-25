// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaOrderRepository } from './prisma/repositories/prisma.order.repository';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: PrismaOrderRepository,
    },
  ],
  exports: [ORDER_REPOSITORY],
})
export class PersistenceModule {}
