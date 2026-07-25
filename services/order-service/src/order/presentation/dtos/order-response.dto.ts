import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../domain/enums/order-status.enum';

// ─────────────────────────────────────────────
// DTO de respuesta de cada ítem
// ─────────────────────────────────────────────
export class OrderItemResponseDto {
  @ApiProperty()
  id: string; // bigint → string para JSON (JSON no soporta bigint nativamente)

  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  productSku: string;

  @ApiProperty()
  warehouseId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  subtotal: number;
}

// ─────────────────────────────────────────────
// DTO de respuesta de la orden
// ─────────────────────────────────────────────
export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty({ required: false })
  customerId?: string | null;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty()
  total: number;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
