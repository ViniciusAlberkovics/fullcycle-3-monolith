import { HttpServerSubscribe } from "../../@shared/api/http-server";
import ProductRepository from "../repository/product.repository";
import ProductAdmRouter from "../router/product-adm.router";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";

export default class ProductAdmRouterFactory {
  static create(httpServer: HttpServerSubscribe) {
    const productAdmRepository = new ProductRepository();
    const addProductUseCase = new AddProductUseCase(productAdmRepository);
    const productAdmRouter = new ProductAdmRouter(
      httpServer,
      addProductUseCase
    );
    return productAdmRouter;
  }
}
