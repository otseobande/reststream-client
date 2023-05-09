import { Socket, io } from "socket.io-client"
import { v4 as uuidv4 } from 'uuid';

type Headers = { [key: string]: string };
class WebSocketHttpClient {
  socket;

  responses;

  errors;

  headers: { [key: string]: string } = {};

  constructor(socket: Socket, headers?: { [key: string]: string }) {
    this.socket = socket;
    this.responses = new Map();
    this.errors = new Map();
    this.headers = headers || {};

    this.socket.on('response', ({ messageId, data }) => {
      const resolve = this.responses.get(messageId);
      if (resolve) {
        resolve(data);
        this.responses.delete(messageId);
      }
    });

    this.socket.on('error', ({ messageId, error }) => {
      const reject = this.errors.get(messageId);
      if (reject) {
        reject(new Error(error));
        this.errors.delete(messageId);
      }
    });
  }

  request({ method, url, data, headers }: { method: string; url: string; data: any, headers?: Headers }) {
    const headersToSend = { ...this.headers, ...headers };

    return new Promise((resolve, reject) => {
      const messageId = uuidv4();
      this.responses.set(messageId, resolve);
      this.errors.set(messageId, reject);
      this.socket.emit('message', {
        messageId,
        method,
        url,
        data,
        headers: headersToSend
      });
    });
  }

  get(url: string, headers?: Headers) {
    return this.request({ method: 'GET', url, data: undefined, headers});
  }

  post(url: string, data: any, headers?: Headers) {
    return this.request({ method: 'POST', url, data, headers });
  }

  // Implement other HTTP methods as needed...
  patch(url: string, data: any, headers?: Headers) {
    return this.request({ method: 'PATCH', url, data, headers });
  }

  delete(url: string, data: any, headers?: Headers) {
    return this.request({ method: 'DELETE', url, data, headers });
  }

  put(url: string, data: any, headers?: Headers) {
    return this.request({ method: 'PUT', url, data, headers });
  }

  close() {
    this.socket.close();
  }
}

export default WebSocketHttpClient;
