import { Order } from '@/order/domain/entities/order.entity';
import { OrderItem } from '@/order/domain/entities/order-item.entity';
import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Prisma,
} from '@prisma/client';
import { OrderStatus } from '@/order/domain/enums/order-status.enum';

// Tipo que Prisma devuelve cuando incluyes items
type PrismaOrderWithItems = PrismaOrder & { items: PrismaOrderItem[] };

export class OrderMapper {
  // ─────────────────────────────────────────────
  // Prisma → Dominio
  // Convierte el objeto plano (con Decimal y BigInt) a entidad
  // ─────────────────────────────────────────────
  static toDomain(raw: PrismaOrderWithItems): Order {
    const items = raw.items.map((item) =>
      OrderItem.reconstitute({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        warehouseId: item.warehouseId,
        quantity: item.quantity,
        price: item.price.toNumber(), // Decimal → number
        subtotal: item.subtotal.toNumber(), // Decimal → number
      }),
    );

    return Order.reconstitute({
      id: raw.id,
      companyId: raw.companyId,
      customerId: raw.customerId ?? null,
      status: raw.status as OrderStatus, // Prisma enum → dominio enum
      total: raw.total.toNumber(), // Decimal → number
      sagaCommandId: raw.sagaCommandId ?? null,
      cancelReason: raw.cancelReason ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      items,
    });
  }

  // ─────────────────────────────────────────────
  // Dominio → Prisma CREATE input
  // Para cuando guardas una orden nueva con sus items
  // ─────────────────────────────────────────────
  static toCreateInput(order: Order): Prisma.OrderCreateInput {
    const data = order.toPrimitives();

    return {
      id: data.id,
      companyId: data.companyId,
      customerId: data.customerId,
      status: data.status,
      total: data.total, // Prisma acepta number para Decimal
      sagaCommandId: data.sagaCommandId,
      cancelReason: data.cancelReason,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      items: {
        createMany: {
          data: data.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            productSku: item.productSku,
            warehouseId: item.warehouseId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        },
      },
    };
  }

  // ─────────────────────────────────────────────
  // Dominio → Prisma UPDATE input
  // Solo los campos que pueden cambiar después de creada la orden
  // ─────────────────────────────────────────────
  static toUpdateInput(order: Order): Prisma.OrderUpdateInput {
    return {
      status: order.getStatus(),
      total: order.getTotal(),
      sagaCommandId: order.getSagaCommandId(),
      cancelReason: order.getCancelReason(),
      updatedAt: order.getUpdatedAt(),
    };
  }
}
