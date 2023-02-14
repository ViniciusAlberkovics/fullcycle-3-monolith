import * as main from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import InvoiceProductModel from "../modules/invoice/repository/invoice-product.model";
import ProductModel from "../modules/invoice/repository/product.model";

describe("E2E test for invoice", () => {
  // @ts-expect-error - get private property
  const app = main.httpServer.app;
  beforeEach(async () => {
    // @ts-expect-error - readonly property
    main.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await main.sequelize.addModels([
      InvoiceModel,
      InvoiceProductModel,
      ProductModel,
    ]);
    await main.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await main.sequelize.close();
  });

  it("should get invoice by id", async () => {
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

    const { body: outputInvoiceCreated, status } = await request(app)
      .post("/invoice")
      .send({
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
      });

    expect(status).toBe(201);
    expect(outputInvoiceCreated.id).toBeDefined();
    expect(outputInvoiceCreated.name).toBe("Invoice 1");
    expect(outputInvoiceCreated.document).toBe("Doc 1");
    expect(outputInvoiceCreated.street).toEqual("Street Fighter");
    expect(outputInvoiceCreated.number).toEqual("6");
    expect(outputInvoiceCreated.complement).toEqual("Complement");
    expect(outputInvoiceCreated.city).toEqual("City");
    expect(outputInvoiceCreated.state).toEqual("State");
    expect(outputInvoiceCreated.zipCode).toEqual("ZipCode");
    expect(outputInvoiceCreated.items[0].name).toBe("Product 1");
    expect(outputInvoiceCreated.items[0].price).toBe(100);
    expect(outputInvoiceCreated.items[1].name).toBe("Product 2");
    expect(outputInvoiceCreated.items[1].price).toBe(200);

    const response = await request(app).get(
      `/invoice/${outputInvoiceCreated.id}`
    );

    expect(response.status).toBe(200);
  });
});
