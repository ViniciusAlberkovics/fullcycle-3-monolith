import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderProductModel } from "./order-product.model";

@Table({
  tableName: "products",
  timestamps: false,
})
export class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  salesPrice: number;


  @HasMany(() => OrderProductModel)
  orderProducts: OrderProductModel[];
}