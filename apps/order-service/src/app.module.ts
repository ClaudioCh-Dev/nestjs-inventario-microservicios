import { Module } from '@nestjs/common';
import { OrderController } from './order/order.controller';
import { CreateOrderHandler } from './order/feautures/create-order/create-order.handler';
import { PersistenceModule } from './database/persistence.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [PersistenceModule, CqrsModule],
  controllers: [OrderController],
  providers: [CreateOrderHandler],
})
export class OrderServiceModule {}
