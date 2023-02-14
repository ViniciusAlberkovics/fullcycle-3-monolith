export enum HttpMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

export interface HttpServer extends HttpServerSubscribe {
  listen(port: number, callback?: () => void): void;
}

export interface HttpServerSubscribe {
  on(method: HttpMethod, path: string, action: HttpServer.RouterAction): this;
}

export namespace HttpServer {
  export interface Request {
    headers: any;
    params: any;
    query: any;
    body: any;
  }

  export interface Response {
    status(code: number): this;
    send(body: any): this;
  }

  export interface RouterAction {
    (req: Request, res: Response): Promise<Response>;
  }
}

