import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/facade.factory";
import InvoiceProductModel from "../repository/invoice-product.model";
import InvoiceModel from "../repository/invoice.model";
import ProductModel from "../repository/product.model";

describe("InvoiceFacade test", () => {
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

  it("should create a invoice", async () => {
    // const invoiceRepository = new InvoiceRepository();
    // const generateUseCase = new GenerateInvoiceUseCase(invoiceRepository);
    // const invoiceFacade = new InvoiceFacade({
    //   generateUseCase: generateUseCase,
    //   findUseCase: findUseCase,
    // });

    await ProductModel.bulkCreate([
      {
        id: "1",
        name: "Product 1",
        price: 100,
      },
      {
        id: "2",
        name: "Product 2",
        price: 200,
      },
    ]);

    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "Doc 1",
      street: "Street Fighter",
      number: "6",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "ZipCode",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        },
      ],
    };

    await invoiceFacade.generateInvoice(input);

    const invoice = await InvoiceModel.findOne({
      where: { name: "Invoice 1" },
      include: [{ 
        model: InvoiceProductModel,
        include: [ProductModel],
      }],
    });

    expect(invoice.id).toBeDefined();
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.city).toBe(input.city);
    expect(invoice.street).toBe(input.street);
    expect(invoice.streetNumber).toBe(input.number);
    expect(invoice.state).toBe(input.state);
    expect(invoice.zipCode).toBe(input.zipCode);
    expect(invoice.complement).toBe(input.complement);
    expect(invoice.invoiceProducts[0].product.id).toBe(input.items[0].id);
    expect(invoice.invoiceProducts[0].product.name).toBe(input.items[0].name);
    expect(invoice.invoiceProducts[0].product.price).toBe(input.items[0].price);
    expect(invoice.invoiceProducts[1].product.id).toBe(input.items[1].id);
    expect(invoice.invoiceProducts[1].product.name).toBe(input.items[1].name);
    expect(invoice.invoiceProducts[1].product.price).toBe(input.items[1].price);
  });

  it("should find a invoice", async () => {
    await ProductModel.bulkCreate([
      {
        id: "1",
        name: "Product 1",
        price: 100,
      },
      {
        id: "2",
        name: "Product 2",
        price: 200,
      },
    ]);
    const invoiceFacade = InvoiceFacadeFactory.create();
    const input = {
      name: "Invoice 1",
      document: "Doc 1",
      street: "Street Fighter",
      number: "6",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "ZipCode",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        },
      ],
    };
    const generatedInvoice = await invoiceFacade.generateInvoice(input);

    const result = await invoiceFacade.findInvoice({ id: generatedInvoice.id });

    expect(result.id).toBe(generatedInvoice.id);
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.address.street).toBe(input.street);
    expect(result.address.number).toBe(input.number);
    expect(result.address.complement).toBe(input.complement);
    expect(result.address.city).toBe(input.city);
    expect(result.address.state).toBe(input.state);
    expect(result.address.zipCode).toBe(input.zipCode);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.items[1].id).toBe(input.items[1].id);
    expect(result.items[1].name).toBe(input.items[1].name);
    expect(result.items[1].price).toBe(input.items[1].price);
    expect(result.total).toBe(generatedInvoice.total);
    expect(result.createdAt).toBeDefined();
  });
});
