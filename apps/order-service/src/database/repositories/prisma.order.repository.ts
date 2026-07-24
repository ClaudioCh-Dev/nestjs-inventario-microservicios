import { Injectable } from '@nestjs/common';
import { OrderMapper } from '../mappers/prisma.order.mapper';
import { Order } from '../../order/entities/order.entity';
import { OrderItem } from '../../order/entities/order-item.entity';
import { OrderStatus } from '../../order/enums/order-status.enum';
import { PrismaService } from '../service/prisma.service';

// ─────────────────────────────────────────────
// Contrato que el dominio conoce (no depende de Prisma)
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Implementación con Prisma + Mapper
// ─────────────────────────────────────────────
@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Persiste una orden nueva con todos sus items
  async save(order: Order): Promise<void> {
    const data = OrderMapper.toCreateInput(order);
    await this.prisma.order.create({ data });
  }

  // Actualiza estado, total, saga y cancelReason
  async update(order: Order): Promise<void> {
    const data = OrderMapper.toUpdateInput(order);
    await this.prisma.order.update({
      where: { id: order.getId() },
      data,
    });
  }

  // Busca por ID e incluye los items
  async findById(id: bigint): Promise<Order | null> {
    const raw = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!raw) return null;
    return OrderMapper.toDomain(raw);
  }

  // Usado por la Saga para correlacionar la respuesta de Inventory
  async findBySagaCommandId(sagaCommandId: string): Promise<Order | null> {
    const raw = await this.prisma.order.findFirst({
      where: { sagaCommandId },
      include: { items: true },
    });

    if (!raw) return null;
    return OrderMapper.toDomain(raw);
  }

  // Lista órdenes de una empresa con filtros opcionales
  async findAll(companyId: bigint, filters?: OrderFilters): Promise<Order[]> {
    const raws = await this.prisma.order.findMany({
      where: {
        companyId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.customerId && { customerId: filters.customerId }),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return raws.map((raw) => OrderMapper.toDomain(raw));
  }

  // Devuelve solo los items de una orden (para el endpoint GET /orders/:id/items)
  async findItemsByOrderId(orderId: bigint): Promise<OrderItem[]> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return [];
    return OrderMapper.toDomain(order).getItems();
  }
}
