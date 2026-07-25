import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// ─────────────────────────────────────────────
// DTO de cada ítem dentro de la orden
// ─────────────────────────────────────────────
export class CreateOrderItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  productId: number;

  @ApiProperty({ example: 'PROD-001' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ example: 'SKU-001' })
  @IsString()
  @IsNotEmpty()
  productSku: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  warehouseId: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @IsPositive()
  price: number;
}

// ─────────────────────────────────────────────
// DTO principal de la request HTTP
// ─────────────────────────────────────────────
export class CreateOrderDto {
  @ApiProperty({ example: 42, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  customerId?: number;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true }) // valida cada item del array
  @Type(() => CreateOrderItemDto) // necesario para que class-transformer instancie bien
  items: CreateOrderItemDto[];
}
