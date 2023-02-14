import BaseRouter from "../../@shared/api/base-router";
import { HttpMethod, HttpServerSubscribe } from "../../@shared/api/http-server";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";

export default class InvoiceRouter extends BaseRouter {
  constructor(
    httpServerSubscribe: HttpServerSubscribe,
    private getInvoiceUseCase: UseCaseInterface,
    private generateInvoiceUseCase: UseCaseInterface,
  ) {
    super(httpServerSubscribe, '/invoice');
  }

  registerHttpServerListeners(): void {
    this.httpServerSubscribe
      .on(HttpMethod.GET, `${this.basePath}/:id`, async (req, res) => {
        try {
          const output = await this.getInvoiceUseCase.execute(req.params);
          return res.status(200).send(output);
        } catch (error) {
          return res.status(500).send(error);
        }
      })
      .on(HttpMethod.POST, this.basePath, async (req, res) => {
        try {
          const output = await this.generateInvoiceUseCase.execute(req.body);
          return res.status(201).send(output);
        } catch (error) {
          return res.status(500).send(error);
        }
      });
  }
}