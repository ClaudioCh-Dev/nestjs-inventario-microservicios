export interface OrderItemProps {
  id: bigint;
  orderId: bigint;
  productId: bigint;
  productName: string;
  productSku: string;
  warehouseId: bigint;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CreateOrderItemProps {
  id: bigint;
  orderId: bigint;
  productId: bigint;
  productName: string;
  productSku: string;
  warehouseId: bigint;
  quantity: number;
  price: number;
}

export class OrderItem {
  private readonly props: OrderItemProps;

  private constructor(props: OrderItemProps) {
    this.props = props;
  }

  static create(props: CreateOrderItemProps): OrderItem {
    if (props.quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    if (props.price < 0) {
      throw new Error('Price cannot be negative');
    }

    return new OrderItem({
      ...props,
      subtotal: props.quantity * props.price,
    });
  }

  static reconstitute(props: OrderItemProps): OrderItem {
    return new OrderItem(props);
  }

  // ─────────────────────────────────────────────
  // Comportamiento
  // ─────────────────────────────────────────────
  changeQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    this.props.quantity = quantity;
    this.props.subtotal = quantity * this.props.price;
  }

  // ─────────────────────────────────────────────
  // Getters
  // ─────────────────────────────────────────────
  getId(): bigint {
    return this.props.id;
  }
  getOrderId(): bigint {
    return this.props.orderId;
  }
  getProductId(): bigint {
    return this.props.productId;
  }
  getProductName(): string {
    return this.props.productName;
  }
  getProductSku(): string {
    return this.props.productSku;
  }
  getWarehouseId(): bigint {
    return this.props.warehouseId;
  }
  getQuantity(): number {
    return this.props.quantity;
  }
  getPrice(): number {
    return this.props.price;
  }
  getSubtotal(): number {
    return this.props.subtotal;
  }

  // ─────────────────────────────────────────────
  // Serialización
  // ─────────────────────────────────────────────
  toPrimitives(): OrderItemProps {
    return { ...this.props };
  }
}
