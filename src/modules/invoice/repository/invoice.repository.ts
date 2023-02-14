import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address.value-object";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceProductModel from "./invoice-product.model";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";

export default class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id: id },
      include: [{ 
        model: InvoiceProductModel,
        include: [ProductModel],
      }],
    });

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      address: new Address(
        invoice.street,
        invoice.streetNumber,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode
      ),
      items: invoice.invoiceProducts.map(({ product }) => {
        return new Product({
          id: new Id(product.id),
          name: product.name,
          price: product.price,
        });
      }),
    });
  }

  async create(invoice: Invoice): Promise<void> {
    const invoiceProps = {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      street: invoice.address.street,
      streetNumber: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
    }

    await InvoiceModel.create(invoiceProps);

    const invoiceProductsProps = invoice.items.map((item) => ({
      productId: item.id.id,
      invoiceId: invoice.id.id,
    }))

    await InvoiceProductModel.bulkCreate(invoiceProductsProps);
  }
}
