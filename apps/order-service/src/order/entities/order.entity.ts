import { OrderStatus } from '../enums/order-status.enum';
import { OrderItem } from './order-item.entity';

export interface OrderProps {
  id: bigint;
  companyId: bigint;
  customerId?: bigint | null;

  status: OrderStatus;

  total: number;

  sagaCommandId?: string | null;
  cancelReason?: string | null;

  createdAt?: Date;
  updatedAt?: Date;

  items?: OrderItem[];
}

export class Order {
  private readonly id: bigint;
  private readonly companyId: bigint;
  private readonly customerId: bigint | null;

  private status: OrderStatus;
  private total: number;

  private readonly sagaCommandId: string | null;
  private cancelReason: string | null;

  private readonly createdAt: Date;
  private updatedAt: Date;

  private items: OrderItem[];

  constructor(props: OrderProps) {
    this.id = props.id;

    this.companyId = props.companyId;

    this.customerId = props.customerId ?? null;

    this.status = props.status;

    this.total = props.total;

    this.sagaCommandId = props.sagaCommandId ?? null;

    this.cancelReason = props.cancelReason ?? null;

    this.createdAt = props.createdAt ?? new Date();

    this.updatedAt = props.updatedAt ?? new Date();

    this.items = props.items ?? [];
  }

  confirm(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Only pending orders can be confirmed');
    }

    this.status = OrderStatus.CONFIRMED;
    this.updatedAt = new Date();
  }

  cancel(reason: string): void {
    if (!reason) {
      throw new Error('Cancel reason is required');
    }

    this.status = OrderStatus.CANCELLED;
    this.cancelReason = reason;
    this.updatedAt = new Date();
  }

  addItem(item: OrderItem): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Cannot add items to this order');
    }

    this.items.push(item);

    this.calculateTotal();
  }

  private calculateTotal(): void {
    this.total = this.items.reduce((acc, item) => acc + item.getSubtotal(), 0);
  }

  getId(): bigint {
    return this.id;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getTotal(): number {
    return this.total;
  }

  getItems(): OrderItem[] {
    return [...this.items];
  }

  toPrimitives() {
    return {
      id: this.id,
      companyId: this.companyId,
      customerId: this.customerId,
      status: this.status,
      total: this.total,
      sagaCommandId: this.sagaCommandId,
      cancelReason: this.cancelReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
