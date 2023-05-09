# @reststream/reststream-client

A RESTful API client that operates over a WebSocket connection, providing a simple and efficient way to make HTTP-like requests. It is built on the Socket.io-client and provides an easy-to-use interface for making standard HTTP requests (GET, POST, PUT, PATCH, DELETE) over WebSockets.

## Installation

```bash
npm install @reststream/reststream-client
```

## Usage

Import the necessary modules and initialize a `WebSocketHttpClient`:

```javascript
import { io } from 'socket.io-client';
import WebSocketHttpClient from '@reststream/reststream-client';

const socket = io('http://your-server-url');
const client = new WebSocketHttpClient(socket);
```

You can make HTTP-like requests:

```javascript
client.get('http://example.com/data').then(response => {
  console.log(response);
});
```

```javascript
client.post('http://example.com/data', { key: 'value' }).then(response => {
  console.log(response);
});
```

Don't forget to close the connection when you're done:

```javascript
client.close();
```

## Error Handling

Errors from the server are thrown as exceptions that can be caught in a try/catch block:

```javascript
try {
  const response = await client.get('http://example.com/data');
  console.log(response);
} catch (error) {
  console.error('An error occurred:', error);
}
```

## License

This project is licensed under the MIT License.
