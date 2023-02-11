import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceProductModel from "./invoice-product.model";

@Table({
  tableName: "products",
  timestamps: false,
})
export default class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  price: number;


  @HasMany(() => InvoiceProductModel)
  invoiceProducts: InvoiceProductModel[];
}
