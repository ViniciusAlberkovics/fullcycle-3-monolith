import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";

@Table({
  tableName: "invoice_products",
  timestamps: false,
})
export default class InvoiceProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false, autoIncrement: true })
  id: number;
  
  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  invoiceId: string;

  @ForeignKey(() => ProductModel)
  @Column({ allowNull: false })
  productId: string;

  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
