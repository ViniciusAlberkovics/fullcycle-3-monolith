import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDto, FindInvoiceUseCaseOutputDto } from "./find-invoice.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {
  private _invoiceRepository: InvoiceGateway;
  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(input: FindInvoiceUseCaseInputDto): Promise<FindInvoiceUseCaseOutputDto> {
    const invoice = await this._invoiceRepository.find(input.id);
    return OutputMapper.toOutput(invoice);
  }
}


class OutputMapper {
  static toOutput(invoice: Invoice): FindInvoiceUseCaseOutputDto {
    return {
      id: invoice.id.id,
      name: invoice.name,
      createdAt: invoice.createdAt,
      document: invoice.document,
      total: invoice.total(),
      address: {
        city: invoice.address.city,
        complement: invoice.address.complement,
        number: invoice.address.number,
        state: invoice.address.state,
        street: invoice.address.street,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
    };
  }
}