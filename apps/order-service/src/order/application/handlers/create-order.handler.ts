import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderResponseDto } from '../../presentation/dtos/order-response.dto';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { ORDER_REPOSITORY } from '@/infrastructure/persistence/persistence.module';
import type { IOrderRepository } from '../../domain/repositories/order.repository';

// ─────────────────────────────────────────────
// El Handler contiene toda la lógica de negocio.
// Es el equivalente al "servicio" en arquitectura tradicional.
// No sabe nada de HTTP — solo recibe un Command y retorna datos.
// ─────────────────────────────────────────────

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderResponseDto> {
    // 1. Construir los items del dominio
    const items = command.items.map((item) =>
      OrderItem.create({
        id: BigInt(0), // Prisma lo genera, se ignora en create
        orderId: BigInt(0), // se asigna después del save
        productId: BigInt(item.productId),
        productName: item.productName,
        productSku: item.productSku,
        warehouseId: BigInt(item.warehouseId),
        quantity: item.quantity,
        price: item.price,
      }),
    );

    // 2. Construir la entidad Order del dominio
    //    Order.create() calcula el total automáticamente
    const order = Order.create({
      id: BigInt(0), // Prisma lo genera (autoincrement)
      companyId: BigInt(command.companyId),
      customerId: command.customerId ? BigInt(command.customerId) : null,
      items,
    });

    // 3. Persistir — el repository guarda la orden + outbox event en una transacción
    await this.orderRepository.save(order);

    // 4. Mapear entidad → DTO de respuesta (bigint → string para JSON)
    return this.toResponse(order);
  }

  // ─────────────────────────────────────────────
  // Mapper inline de entidad → DTO de respuesta
  // (simple, no necesita librería externa)
  // ─────────────────────────────────────────────
  private toResponse(order: Order): OrderResponseDto {
    return {
      id: order.getId().toString(),
      companyId: order.getCompanyId().toString(),
      customerId: order.getCustomerId()?.toString() ?? null,
      status: order.getStatus(),
      total: order.getTotal(),
      createdAt: order.getCreatedAt(),
      updatedAt: order.getUpdatedAt(),
      items: order.getItems().map((item) => ({
        id: item.getId().toString(),
        productId: item.getProductId().toString(),
        productName: item.getProductName(),
        productSku: item.getProductSku(),
        warehouseId: item.getWarehouseId().toString(),
        quantity: item.getQuantity(),
        price: item.getPrice(),
        subtotal: item.getSubtotal(),
      })),
    };
  }
}
