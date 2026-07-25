import { Module } from '@nestjs/common';
import { CreateOrderHandler } from './order/application/handlers/create-order.handler';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderController } from './order/presentation/order.controller';

@Module({
  imports: [PersistenceModule, CqrsModule],
  controllers: [OrderController],
  providers: [CreateOrderHandler],
})
export class OrderServiceModule {}
