import { OrderStatus } from '../enums/order-status.enum';
import { OrderItem } from './order-item.entity';

export interface OrderProps {
  id: bigint;
  companyId: bigint;
  customerId: bigint | null;
  status: OrderStatus;
  total: number;
  sagaCommandId: string | null;
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface CreateOrderProps {
  id: bigint;
  companyId: bigint;
  customerId?: bigint | null;
  items: OrderItem[];
}

export class Order {
  private readonly props: OrderProps;

  private constructor(props: OrderProps) {
    this.props = props;
  }

  // ─────────────────────────────────────────────
  // Factory: nueva orden
  // ─────────────────────────────────────────────
  static create(props: CreateOrderProps): Order {
    if (!props.items || props.items.length === 0) {
      throw new Error('An order must have at least one item');
    }

    const order = new Order({
      id: props.id,
      companyId: props.companyId,
      customerId: props.customerId ?? null,
      status: OrderStatus.PENDING,
      total: 0,
      sagaCommandId: null,
      cancelReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: props.items,
    });

    order.recalculateTotal();
    return order;
  }

  // ─────────────────────────────────────────────
  // Factory: reconstruir desde DB
  // ─────────────────────────────────────────────
  static reconstitute(props: OrderProps): Order {
    return new Order(props);
  }

  // ─────────────────────────────────────────────
  // Comportamiento de dominio
  // ─────────────────────────────────────────────
  startReservation(sagaCommandId: string): void {
    if (this.props.status !== OrderStatus.PENDING) {
      throw new Error('Only PENDING orders can start stock reservation');
    }

    this.props.status = OrderStatus.RESERVING_STOCK;
    this.props.sagaCommandId = sagaCommandId;
    this.props.updatedAt = new Date();
  }

  confirm(): void {
    if (this.props.status !== OrderStatus.RESERVING_STOCK) {
      throw new Error('Only orders in RESERVING_STOCK can be confirmed');
    }

    this.props.status = OrderStatus.CONFIRMED;
    this.props.updatedAt = new Date();
  }

  cancel(reason: string): void {
    if (this.props.status === OrderStatus.CONFIRMED) {
      throw new Error('A confirmed order cannot be cancelled');
    }

    if (!reason?.trim()) {
      throw new Error('Cancel reason is required');
    }

    this.props.status = OrderStatus.CANCELLED;
    this.props.cancelReason = reason;
    this.props.updatedAt = new Date();
  }

  addItem(item: OrderItem): void {
    if (this.props.status !== OrderStatus.PENDING) {
      throw new Error('Items can only be added to PENDING orders');
    }

    this.props.items.push(item);
    this.recalculateTotal();
    this.props.updatedAt = new Date();
  }

  private recalculateTotal(): void {
    this.props.total = this.props.items.reduce(
      (acc, item) => acc + item.getSubtotal(),
      0,
    );
  }

  // ─────────────────────────────────────────────
  // Getters
  // ─────────────────────────────────────────────
  getId(): bigint {
    return this.props.id;
  }
  getCompanyId(): bigint {
    return this.props.companyId;
  }
  getCustomerId(): bigint | null {
    return this.props.customerId;
  }
  getStatus(): OrderStatus {
    return this.props.status;
  }
  getTotal(): number {
    return this.props.total;
  }
  getSagaCommandId(): string | null {
    return this.props.sagaCommandId;
  }
  getCancelReason(): string | null {
    return this.props.cancelReason;
  }
  getCreatedAt(): Date {
    return this.props.createdAt;
  }
  getUpdatedAt(): Date {
    return this.props.updatedAt;
  }
  getItems(): OrderItem[] {
    return [...this.props.items];
  }

  // ─────────────────────────────────────────────
  // Serialización — lo usa el Mapper
  // ─────────────────────────────────────────────
  toPrimitives() {
    return {
      ...this.props,
      items: this.props.items.map((item) => item.toPrimitives()),
    };
  }
}
