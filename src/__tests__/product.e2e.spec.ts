import { httpServer, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  // @ts-expect-error - force get app
  const app = httpServer.app;
  beforeEach(async () => {
    await sequelize.sync({
      force: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const product = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };
    const response = await request(app).post("/products").send(product);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(product.name);
    expect(response.body.description).toBe(product.description);
    expect(response.body.purchasePrice).toBe(product.purchasePrice);
    expect(response.body.stock).toBe(product.stock);
  });
});
