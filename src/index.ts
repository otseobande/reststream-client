import { Socket, io } from "socket.io-client"
import { v4 as uuidv4 } from 'uuid';

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

  request({ method, url, data }: { method: string; url: string; data: any }) {
    return new Promise((resolve, reject) => {
      const messageId = uuidv4();
      this.responses.set(messageId, resolve);
      this.errors.set(messageId, reject);
      this.socket.emit('message', {
        messageId,
        method,
        url,
        data,
        headers: this.headers
      });
    });
  }

  get(url: string) {
    return this.request({ method: 'GET', url, data: undefined });
  }

  post(url: string, data: any) {
    return this.request({ method: 'POST', url, data });
  }

  // Implement other HTTP methods as needed...
  patch(url: string, data: any) {
    return this.request({ method: 'PATCH', url, data });
  }

  delete(url: string, data: any) {
    return this.request({ method: 'DELETE', url, data });
  }

  put(url: string, data: any) {
    return this.request({ method: 'PUT', url, data });
  }

  close() {
    this.socket.close();
  }
}

export default WebSocketHttpClient;
