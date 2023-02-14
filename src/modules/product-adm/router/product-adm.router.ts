import BaseRouter from "../../@shared/api/base-router";
import { HttpMethod, HttpServerSubscribe } from "../../@shared/api/http-server";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";

export default class ProductAdmRouter extends BaseRouter {
  constructor(httpServerSubscribe: HttpServerSubscribe, private addProductUseCase: UseCaseInterface) {
    super(httpServerSubscribe, "/products")
  }

  registerHttpServerListeners(): void {
    this.httpServerSubscribe.on(HttpMethod.POST, this.basePath, async (req, res) => {
      try {
        const output = await this.addProductUseCase.execute(req.body);
        return res.status(201).send(output);
      } catch (error) {
        return res.status(500).send(error);
      }
    });
  }
}