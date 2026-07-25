import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus } from '../enums/order-status.enum';

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  update(order: Order): Promise<void>;
  findById(id: bigint): Promise<Order | null>;
  findBySagaCommandId(sagaCommandId: string): Promise<Order | null>;
  findAll(companyId: bigint, filters?: OrderFilters): Promise<Order[]>;
  findItemsByOrderId(orderId: bigint): Promise<OrderItem[]>;
}

export interface OrderFilters {
  status?: OrderStatus;
  customerId?: bigint;
}
