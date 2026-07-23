/*import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '@/booking/entities/booking.entity';

export interface IBookingRepository {
  createBooking(booking: Booking): Promise<Booking>;
}

export class BookingRepository implements IBookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>
  ) {}

  async createBooking(booking: Booking): Promise<Booking> {
    return await this.bookingRepository.save(booking);
  }
}
*/
/*GET    /orders              → ?page&limit&status&from&to    → PaginatedResponse<OrderDto>
GET    /orders/:id          →                               → OrderDto
POST   /orders              → CreateOrderDto                → OrderDto (status: PENDING → RESERVING_STOCK)
DELETE /orders/:id          → { reason? }                   → 204
GET    /orders/:id/items    →                               → OrderItemDto[]

#	Caso de Uso	Tipo	Comunicación

1	Crear pedido	Command	HTTP POST → inicia Saga
2	Confirmar pedido	Command	MESSAGE recibido (Saga Step final)
3	Cancelar pedido	Command	HTTP DELETE o Saga compensación
4	Agregar ítem a pedido	Command	HTTP POST
5	Obtener pedido	Query	HTTP GET
6	Listar pedidos	Query	HTTP GET
7	Obtener ítems de pedido	Query	HTTP GET
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { Order, OrderItem } from '../generated/prisma/browser';

export interface IOrderRepository {
  createOrder(order: Order): Promise<Order>;

  confirmOrder(orderId: bigint): Promise<Order>;

  cancelOrder(orderId: bigint, reason: string): Promise<Order>;

  addOrderItem(orderId: bigint, item: OrderItem): Promise<OrderItem>;

  getOrder(orderId: bigint): Promise<Order | null>;

  listOrders(): Promise<Order[]>;

  getOrderItems(orderId: bigint): Promise<OrderItem[]>;
}

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}
  createOrder(order: Order): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  confirmOrder(orderId: bigint): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  cancelOrder(orderId: bigint, reason: string): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  addOrderItem(orderId: bigint, item: OrderItem): Promise<OrderItem> {
    throw new Error('Method not implemented.');
  }
  getOrder(orderId: bigint): Promise<Order | null> {
    throw new Error('Method not implemented.');
  }
  listOrders(): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  getOrderItems(orderId: bigint): Promise<OrderItem[]> {
    throw new Error('Method not implemented.');
  }
}
