import express, { Express } from "express";
import { HttpMethod, HttpServer } from "./http-server";

export default class ExpressAdapter implements HttpServer {
	private app: Express;

	constructor () {
		this.app = express();
		this.app.use(express.json());
	}
  
  listen(port: number, callback?: () => void): void {
    this.app.listen(port, callback);
  }

  on(method: HttpMethod, path: string, action: HttpServer.RouterAction): this {
    this.app[method](path, action);
    return this;
  }
}