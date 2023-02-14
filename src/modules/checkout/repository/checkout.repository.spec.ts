import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutRepository from "./checkout.repository";
import { ClientModel } from "./client.model";
import { OrderProductModel } from "./order-product.model";
import { OrderModel } from "./order.model";
import {ProductModel} from "./product.model";

describe("CheckoutRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([OrderModel, ClientModel, ProductModel, OrderProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add a order", async () => {
    await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      document: "document 1",
      street: "Street",
      streetNumber: "Number",
      complement: "Comp",
      city: "City",
      state: "State",
      zipCode: "ZipCode",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductModel.bulkCreate([
      { id: "1", name: "item 1", description: "description 1", salesPrice: 10 },
      { id: "2", name: "item 2", description: "description 2", salesPrice: 20 },
    ]);

    const OrderProps = {
      id: new Id("1"),
      client: new Client({
        id: new Id("1"),
        name: "Client 1",
        email: "x@x.com",
        document: "document 1",
        address: new Address(
          "Street",
          "Number",
          "Comp",
          "City",
          "State",
          "ZipCode"
        ),
      }),
      products: [
        new Product({ id: new Id("1"), name: "item 1", description: "description 1", salesPrice: 10 }),
        new Product({ id: new Id("2"), name: "item 2", description: "description 2", salesPrice: 20 }),
      ],
      status: "status 1",
    };

    const order = new Order(OrderProps);
    const checkoutRepository = new CheckoutRepository();
    await checkoutRepository.addOrder(order);

    const checkoutDb = await OrderModel.findOne({
      where: { id: order.id.id },
      include: [{ 
        model: OrderProductModel,
        include: [ProductModel],
      }, ClientModel],
    });

    expect(OrderProps.id.id).toEqual(checkoutDb.id);
    expect(OrderProps.client.id.id).toEqual(checkoutDb.client.id);
    expect(OrderProps.client.name).toEqual(checkoutDb.client.name);
    expect(OrderProps.client.email).toEqual(checkoutDb.client.email);
    expect(OrderProps.client.document).toEqual(checkoutDb.client.document);    
    expect(OrderProps.client.address.street).toEqual(checkoutDb.client.street);
    expect(OrderProps.client.address.zipCode).toEqual(checkoutDb.client.zipCode);
    expect(OrderProps.client.address.number).toEqual(checkoutDb.client.streetNumber);
    expect(OrderProps.client.address.state).toEqual(checkoutDb.client.state);
    expect(OrderProps.client.address.city).toEqual(checkoutDb.client.city);
    expect(OrderProps.client.address.complement).toEqual(checkoutDb.client.complement);
    expect(OrderProps.products).toStrictEqual([
        new Product({ 
          id: new Id(checkoutDb.orderProducts[0].product.id), 
          name: checkoutDb.orderProducts[0].product.name,
          description: checkoutDb.orderProducts[0].product.description, 
          salesPrice: checkoutDb.orderProducts[0].product.salesPrice,
        }), 
        new Product({ 
          id: new Id(checkoutDb.orderProducts[1].product.id), 
          name: checkoutDb.orderProducts[1].product.name, 
          description: checkoutDb.orderProducts[1].product.description,
          salesPrice: checkoutDb.orderProducts[1].product.salesPrice,
        }), 
    ]);
    expect(OrderProps.status).toEqual(checkoutDb.status);
  });

  it("should find a order", async () => {
    await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      document: "document 1",
      street: "Street",
      streetNumber: "StreetNumber",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "ZipCode",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductModel.bulkCreate([
      { id: "1", name: "item 1", description: "description 1", salesPrice: 10 },
      { id: "2", name: "item 2", description: "description 2", salesPrice: 20 },
    ]);
    const checkoutRepository = new CheckoutRepository();

    const orderProps = {
      id: '1',
      status: 'status 1',
      clientId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await OrderModel.create(orderProps);

    const orderProductsProps = [
      {
        productId: '1',
        orderId: '1',
      },
      {
        productId: '2',
        orderId: '1',
      },
    ]

    await OrderProductModel.bulkCreate(orderProductsProps);

    const checkout = await checkoutRepository.findOrder("1");

    expect(checkout.id.id).toEqual("1");
    expect(checkout.client.name).toEqual("Client 1");
    expect(checkout.client.email).toEqual("x@x.com");
    expect(checkout.client.document).toEqual("document 1");  
    expect(checkout.client.address.street).toEqual("Street");
    expect(checkout.client.address.zipCode).toEqual("ZipCode");
    expect(checkout.client.address.number).toEqual("StreetNumber");
    expect(checkout.client.address.complement).toEqual("Complement");
    expect(checkout.client.address.city).toEqual("City");
    expect(checkout.client.address.state).toEqual("State");
    expect(checkout.products).toStrictEqual([
      new Product({ id: new Id("1"), name: "item 1", description: "description 1", salesPrice: 10 }), 
      new Product({ id: new Id("2"), name: "item 2", description: "description 2", salesPrice: 20 }),
    ]);
    expect(checkout.status).toEqual("status 1");
  });

});