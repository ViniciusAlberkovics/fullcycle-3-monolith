import { HttpServerSubscribe } from "../../@shared/api/http-server";
import InvoiceRepository from "../repository/invoice.repository";
import InvoiceRouter from "../router/invoice.router";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceRouterFactory {
  static create(httpServer: HttpServerSubscribe) {
    const invoiceRepository = new InvoiceRepository();
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
    const invoiceRouter = new InvoiceRouter(httpServer, findInvoiceUseCase, generateInvoiceUseCase);
    return invoiceRouter;
  }
}