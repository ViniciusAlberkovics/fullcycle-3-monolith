import { HttpServerSubscribe } from "../../@shared/api/http-server";
import ClientRepository from "../repository/client.repository";
import ClientAdmRouter from "../router/client-adm.router";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";

export default class ClientAdmRouterFactory {
  static create(httpServer: HttpServerSubscribe) {
    const clientAdmRepository = new ClientRepository();
    const addClientUseCase = new AddClientUseCase(clientAdmRepository);
    const clientAdmRouter = new ClientAdmRouter(httpServer, addClientUseCase);

    return clientAdmRouter;
  }
}
