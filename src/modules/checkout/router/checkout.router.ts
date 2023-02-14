import BaseRouter from "../../@shared/api/base-router";
import { HttpMethod, HttpServerSubscribe } from "../../@shared/api/http-server";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";

export default class CheckoutRouter extends BaseRouter {
  constructor(httpServerSubscribe: HttpServerSubscribe, private placeOrderUseCase: UseCaseInterface) {
    super(httpServerSubscribe, '/checkout');
  }

  registerHttpServerListeners(): void {
    this.httpServerSubscribe.on(HttpMethod.POST, this.basePath, async (req, res) => {
      try {
        const output = await this.placeOrderUseCase.execute(req.body);
        return res.status(201).send(output);
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    });
  }
}