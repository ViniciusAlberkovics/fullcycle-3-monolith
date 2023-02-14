import { Sequelize } from "sequelize-typescript";
import ExpressAdapter from "./modules/@shared/api/express-adapter";
import ClientAdmRouterFactory from "./modules/client-adm/factory/client-adm.router.factory";
import { ClientModel } from "./modules/client-adm/repository/client.model";
import InvoiceRouterFactory from "./modules/invoice/factory/invoice.router.factory";
import InvoiceModel from "./modules/invoice/repository/invoice.model";
import InvoiceProductsModel from "./modules/invoice/repository/invoice-product.model";
import ProductAdmRouterFactory from "./modules/product-adm/factory/product-adm.router.factory";
import TransactionModel from "./modules/payment/repository/transaction.model";

import InvoiceProductModel from "./modules/invoice/repository/product.model";
import { ProductModel } from "./modules/product-adm/repository/product.model";
import StoreCatalogProductModel from "./modules/store-catalog/repository/product.model";
import CheckoutRouterFactory from "./modules/checkout/factory/checkout.router.factory";
import { OrderModel } from "./modules/checkout/repository/order.model";
import { OrderProductModel } from "./modules/checkout/repository/order-product.model";
import { ClientModel as OrderClientModel } from "./modules/checkout/repository/client.model";
import { ProductModel as OrderProductModel1 } from "./modules/checkout/repository/product.model";

export let sequelize: Sequelize;
async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([
    OrderModel,
    OrderProductModel,
    OrderClientModel,
    OrderProductModel1,
    ClientModel,
    InvoiceModel,
    InvoiceProductsModel,
    TransactionModel,
    InvoiceProductModel,
    StoreCatalogProductModel,
    ProductModel,
  ]);
  await sequelize.sync();
}
setupDb();


export const httpServer = new ExpressAdapter();

const clientAdmRouter = ClientAdmRouterFactory.create(httpServer);
clientAdmRouter.registerHttpServerListeners();

const productAdmRouter = ProductAdmRouterFactory.create(httpServer);
productAdmRouter.registerHttpServerListeners();

const invoiceRouter = InvoiceRouterFactory.create(httpServer);
invoiceRouter.registerHttpServerListeners();

const checkoutRouter = CheckoutRouterFactory.create(httpServer);
checkoutRouter.registerHttpServerListeners();
