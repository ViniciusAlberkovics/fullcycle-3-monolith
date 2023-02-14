import * as main from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "../modules/checkout/repository/order.model";
import { ClientModel } from "../modules/checkout/repository/client.model";
import { ProductModel } from "../modules/checkout/repository/product.model";
import { OrderProductModel } from "../modules/checkout/repository/order-product.model";

describe("E2E test for checkout", () => {
  // @ts-expect-error - force get app
  const app = main.httpServer.app;

  beforeEach(async () => {
    // @ts-expect-error - readonly property
    main.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await main.sequelize.addModels([OrderModel, ClientModel, ProductModel, OrderProductModel]);
    await main.sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await main.sequelize.close();
  });

  // **MODELS WITH CONFLICT**
  it.skip("should place order", async () => {
    await ClientModel.create({
      id: "1c",
      name: "Client 1",
      email: "x@x.com",
      document: "document 1",  
      street: "Street",
      streetNumber: "StreetNumber",
      city: "City",
      state: "State",
      complement: "Complement",
      zipCode: "ZipCode",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductModel.bulkCreate([
      {
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
      },
      {
        id: "2",
        name: "Product 2",
        description: "Product 2 description",
        salesPrice: 150,
      },
    ]);

    const input = {
      clientId: "1c",
      products: [{ productId: "1" }, { productId: "2" }],
    };
    const response = await request(app).post("/checkout").send(input);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.status).toBeDefined();
    expect(response.body.total).toBe(250);
    expect(response.body.products).toEqual(input.products);
  });
});
