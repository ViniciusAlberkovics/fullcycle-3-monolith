import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { ClientModel } from "./client.model";
import { OrderProductModel } from "./order-product.model";
import { OrderModel } from "./order.model";
import {ProductModel} from "./product.model";

export default class CheckoutRepository implements CheckoutGateway {

  async addOrder(order: Order): Promise<void> {
    const orderProps = {
      id: order.id.id,
      status: order.status,
      clientId: order.client.id.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }

    await OrderModel.create(orderProps);

    const orderProductsProps = order.products.map((product) => ({
      productId: product.id.id,
      orderId: order.id.id,
    }))

    await OrderProductModel.bulkCreate(orderProductsProps);
  }
  
  async findOrder(id: string): Promise<Order | null> {
    const order = await OrderModel.findOne({
      where: { id },
      include: [{ 
        model: OrderProductModel,
        include: [ProductModel],
      }, ClientModel],
    });

    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }

    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(order.client.id),
        name: order.client.name,
        email: order.client.email,
        document: order.client.document,
        address: new Address(
          order.client.street,
          order.client.streetNumber,
          order.client.complement,
          order.client.city,
          order.client.state,
          order.client.zipCode,
        ),
      }),
      products: order.orderProducts.map((item) => {
        return new Product({
          id: new Id(item.product.id),
          name: item.product.name,
          description: item.product.description,
          salesPrice: item.product.salesPrice,
        })
      }),
      status: order.status,
    });
  }
}