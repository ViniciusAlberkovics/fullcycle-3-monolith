import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderModel } from "./order.model";
import { ProductModel } from "./product.model";

@Table({
  tableName: "order_products",
  timestamps: false,
})
export class OrderProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false, autoIncrement: true })
  id: number;
  
  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  orderId: string;

  @ForeignKey(() => ProductModel)
  @Column({ allowNull: false })
  productId: string;

  @BelongsTo(() => OrderModel)
  order: OrderModel;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}