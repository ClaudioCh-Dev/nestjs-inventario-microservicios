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
  private readonly _id: bigint;
  private readonly _orderId: bigint;

  private readonly _productId: bigint;
  private readonly _productName: string;
  private readonly _productSku: string;

  private readonly _warehouseId: bigint;

  private _quantity: number;
  private readonly _price: number;
  private _subtotal: number;

  private constructor(props: OrderItemProps) {
    this._id = props.id;
    this._orderId = props.orderId;
    this._productId = props.productId;
    this._productName = props.productName;
    this._productSku = props.productSku;
    this._warehouseId = props.warehouseId;
    this._quantity = props.quantity;
    this._price = props.price;
    this._subtotal = props.subtotal;
  }

  // ─────────────────────────────────────────────
  // Factory: nuevo item (calcula subtotal)
  // ─────────────────────────────────────────────
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

  // ─────────────────────────────────────────────
  // Factory: reconstruir desde DB
  // ─────────────────────────────────────────────
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

    this._quantity = quantity;
    this._subtotal = this._quantity * this._price;
  }

  // ─────────────────────────────────────────────
  // Getters
  // ─────────────────────────────────────────────
  get id(): bigint {
    return this._id;
  }
  get orderId(): bigint {
    return this._orderId;
  }
  get productId(): bigint {
    return this._productId;
  }
  get productName(): string {
    return this._productName;
  }
  get productSku(): string {
    return this._productSku;
  }
  get warehouseId(): bigint {
    return this._warehouseId;
  }
  get quantity(): number {
    return this._quantity;
  }
  get price(): number {
    return this._price;
  }
  get subtotal(): number {
    return this._subtotal;
  }

  // Alias para compatibilidad con Order.recalculateTotal()
  getSubtotal(): number {
    return this._subtotal;
  }

  // ─────────────────────────────────────────────
  // Serialización
  // ─────────────────────────────────────────────
  toPrimitives(): OrderItemProps {
    return {
      id: this._id,
      orderId: this._orderId,
      productId: this._productId,
      productName: this._productName,
      productSku: this._productSku,
      warehouseId: this._warehouseId,
      quantity: this._quantity,
      price: this._price,
      subtotal: this._subtotal,
    };
  }
}
