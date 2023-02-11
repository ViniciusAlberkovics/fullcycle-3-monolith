import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCasesProps {
  generateUseCase: UseCaseInterface;
  findUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateUsecase: UseCaseInterface;
  private _findUsecase: UseCaseInterface;

  constructor(usecasesProps: UseCasesProps) {
    this._generateUsecase = usecasesProps.generateUseCase;
    this._findUsecase = usecasesProps.findUseCase;
  }
  
  async generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return await this._generateUsecase.execute(input);
  }
  
  async findInvoice(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }

}
