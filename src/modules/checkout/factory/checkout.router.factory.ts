import { HttpServerSubscribe } from "../../@shared/api/http-server";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutRepository from "../repository/checkout.repository";
import CheckoutRouter from "../router/checkout.router";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutRouterFactory {
  static create(httpServer: HttpServerSubscribe) {
    const checkoutRepository = new CheckoutRepository();
    const clientAdmFacade = ClientAdmFacadeFactory.create();
    const productAdmFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    const placeOrderUseCase = new PlaceOrderUseCase(
      clientAdmFacade,
      productAdmFacade,
      catalogFacade,
      checkoutRepository,
      invoiceFacade,
      paymentFacade
    );

    const checkoutRouter = new CheckoutRouter(httpServer, placeOrderUseCase);
    return checkoutRouter;
  }
}
