import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
  };
};

describe("generate invoice usecase unit test", () => {
  it("should generate invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

    const input = {
      name: "Invoice 1",
      document: "Doc 1",
      street: "Street Fighter",
      number: "6",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "ZipCode",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        },
      ],
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.create).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.items[1].id).toBe(input.items[1].id);
    expect(result.items[1].name).toBe(input.items[1].name);
    expect(result.items[1].price).toBe(input.items[1].price);
    expect(result.total).toBe(300);
  });
});
