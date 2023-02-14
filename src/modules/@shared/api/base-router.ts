import { HttpServerSubscribe } from "./http-server";

export default abstract class BaseRouter {
  constructor(protected httpServerSubscribe: HttpServerSubscribe, protected basePath: string) {}

  abstract registerHttpServerListeners(): void;
}