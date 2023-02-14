import { Sequelize } from "sequelize-typescript";
import InvoiceProductModel from "./invoice-product.model";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";

import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      InvoiceModel,
      InvoiceProductModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a invoice", async () => {
    const productProps1 = {
      id: "1",
      name: "Product 1",
      price: 100,
    }
    await ProductModel.create(productProps1);
    const productProps2 = {
      id: "2",
      name: "Product 2",
      price: 200,
    }
    await ProductModel.create(productProps2);

    const invoiceProps = {
      id: "1",
      name: "Invoice 1",
      document: "Doc 1",
      createdAt: new Date(),
      updatedAt: new Date(),
      street: "Street",
      streetNumber: "Number",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "ZipCode",
    }

    await InvoiceModel.create(invoiceProps);

    await InvoiceProductModel.bulkCreate([
      {
        productId: productProps1.id,
        invoiceId: invoiceProps.id,
      },
      {
        productId: productProps2.id,
        invoiceId: invoiceProps.id,
      },
    ]);

    const invoiceRepository = new InvoiceRepository();
    const invoice = await invoiceRepository.find("1");

    expect(invoice.id.id).toBe(invoiceProps.id);
    expect(invoice.name).toBe(invoiceProps.name);
    expect(invoice.document).toBe(invoiceProps.document);
    expect(invoice.address.city).toBe(invoiceProps.city);
    expect(invoice.address.street).toBe(invoiceProps.street);
    expect(invoice.address.number).toBe(invoiceProps.streetNumber);
    expect(invoice.address.state).toBe(invoiceProps.state);
    expect(invoice.address.zipCode).toBe(invoiceProps.zipCode);
    expect(invoice.address.complement).toBe(invoiceProps.complement);
    expect(invoice.items[0].id.id).toBe(productProps1.id);
    expect(invoice.items[0].name).toBe(productProps1.name);
    expect(invoice.items[0].price).toBe(productProps1.price);
    expect(invoice.items[1].id.id).toBe(productProps2.id);
    expect(invoice.items[1].name).toBe(productProps2.name);
    expect(invoice.items[1].price).toBe(productProps2.price);
  });

  it("should create a invoice", async () => {
    const productProps1 = {
      id: "1",
      name: "Product 1",
      price: 100,
    }
    await ProductModel.create(productProps1);
    const productProps2 = {
      id: "2",
      name: "Product 2",
      price: 200,
    }
    await ProductModel.create(productProps2);

    const invoiceInput = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Doc 1",
      createdAt: new Date(),
      updatedAt: new Date(),
      address: new Address("Street", "Number", "Complement", "City", "State", "ZipCode"),
      items: [
        new Product({
          id: new Id(productProps1.id),
          name: productProps1.name,
          price: productProps1.price,
        }),
        new Product({
          id: new Id(productProps2.id),
          name: productProps2.name,
          price: productProps2.price,
        }),
      ]
    });

    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.create(invoiceInput);

    const invoice = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [{ 
        model: InvoiceProductModel,
        include: [ProductModel],
      }],
    });

    expect(invoice.id).toBe(invoiceInput.id.id);
    expect(invoice.name).toBe(invoiceInput.name);
    expect(invoice.document).toBe(invoiceInput.document);
    expect(invoice.city).toBe(invoiceInput.address.city);
    expect(invoice.street).toBe(invoiceInput.address.street);
    expect(invoice.streetNumber).toBe(invoiceInput.address.number);
    expect(invoice.state).toBe(invoiceInput.address.state);
    expect(invoice.zipCode).toBe(invoiceInput.address.zipCode);
    expect(invoice.complement).toBe(invoiceInput.address.complement);
    expect(invoice.invoiceProducts[0].product.id).toBe(productProps1.id);
    expect(invoice.invoiceProducts[0].product.name).toBe(productProps1.name);
    expect(invoice.invoiceProducts[0].product.price).toBe(productProps1.price);
    expect(invoice.invoiceProducts[1].product.id).toBe(productProps2.id);
    expect(invoice.invoiceProducts[1].product.name).toBe(productProps2.name);
    expect(invoice.invoiceProducts[1].product.price).toBe(productProps2.price);
  });
});
