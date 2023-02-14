import { httpServer, sequelize } from "../express";
import request from "supertest";

describe("E2E test for client", () => {
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

  it("should create a client", async () => {
    const client = {
      name: "Client 1",
      email: "x@x.com",
      document: "any doc",
      address: {
        street: "Street",
        number: "Number",
        complement: "Complement",
        city: "City",
        state: "State",
        zipCode: "ZipCode",
      },
    };
    const response = await request(app).post("/clients").send(client);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(client.name);
    expect(response.body.email).toBe(client.email);
    expect(response.body.document).toBe(client.document);
    expect(response.body.address).toEqual(client.address);
  });
});
