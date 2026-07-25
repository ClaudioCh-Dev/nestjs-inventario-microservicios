import { ICommand } from '@nestjs/cqrs';

// ─────────────────────────────────────────────
// El Command es el mensaje que viaja por el CommandBus.
// No tiene lógica, solo transporta los datos del request.
// ─────────────────────────────────────────────

export class CreateOrderItemCommand {
  productId: number;
  productName: string;
  productSku: string;
  warehouseId: number;
  quantity: number;
  price: number;
}

export class CreateOrderCommand implements ICommand {
  companyId: number; // viene del JWT (CLS context), no del body
  requestedBy: number; // userId del JWT
  customerId?: number | null;
  items: CreateOrderItemCommand[];

  constructor(partial: Partial<CreateOrderCommand>) {
    Object.assign(this, partial);
  }
}
