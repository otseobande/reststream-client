import { Server, ServerOptions } from "socket.io";
import { io, Socket } from "socket.io-client";
import { createServer, Server as HttpServer } from "http";
import WebSocketHttpClient from '../src/index';

let httpServer: HttpServer;
let socketServer: Server<ServerOptions>;
let socketClient: Socket;

beforeAll((done) => {
  httpServer = createServer();
  socketServer = new Server(httpServer);

  httpServer.listen(() => {
    const port = (httpServer.address() as any).port;
    socketClient = io(`http://localhost:${port}`);

    socketClient.on("connect", done);
  });

  socketServer.on("connection", (socket) => {
     // @ts-ignore
    socket.on("message", ({ messageId, method, url, data, headers }) => {

      // @ts-ignore
      socket.emit("response", { messageId, data: { method, url, data, headers } });
    });
  });
});

afterAll(() => {
  socketServer.close();
  httpServer.close();
  socketClient.close();
});

describe("WebSocketHttpClient", () => {
  it("should be able to create an instance", () => {
    const client = new WebSocketHttpClient(socketClient);
    expect(client).toBeInstanceOf(WebSocketHttpClient);
  });

  it("should make a GET request", async () => {
    const client = new WebSocketHttpClient(socketClient);
    const response = await client.get('http://testurl.com') as any;
    expect(response.method).toEqual('GET');
  });

  it("should make a POST request", async () => {
    const client = new WebSocketHttpClient(socketClient);
    const response = await client.post('http://testurl.com', { test: 'data' }) as any;
    expect(response.method).toEqual('POST');
    expect(response.data).toEqual({ test: 'data' });
  });

  it("should make a PATCH request", async () => {
    const client = new WebSocketHttpClient(socketClient);
    const response = await client.patch('http://testurl.com', { test: 'data' }) as any;
    expect(response.method).toEqual('PATCH');
    expect(response.data).toEqual({ test: 'data' });
  });

  it("should make a DELETE request", async () => {
    const client = new WebSocketHttpClient(socketClient);
    const response = await client.delete('http://testurl.com', { test: 'data' }) as any;
    expect(response.method).toEqual('DELETE');
    expect(response.data).toEqual({ test: 'data' });
  });

  it("should make a PUT request", async () => {
    const client = new WebSocketHttpClient(socketClient);
    const response = await client.put('http://testurl.com', { test: 'data' }) as any;
    expect(response.method).toEqual('PUT');
    expect(response.data).toEqual({ test: 'data' });
  });

  it("should close the connection", () => {
    const client = new WebSocketHttpClient(socketClient);
    client.close();
    expect(socketClient.connected).toBeFalsy();
  });
});
