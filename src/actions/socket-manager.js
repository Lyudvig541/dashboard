/* eslint-disable @typescript-eslint/no-explicit-any */
export class SocketManager {
  static rid = 1;
  static socket;
  static socketID;
  static isConnected;

  static callbackMappings = {};
  static triggeredCallbacks = {};

  static setSocketInstance(io) {
    const wsHost = process.env.WS_HOST || '134.122.91.94';
    const wsPort = process.env.WS_PORT || '8290';

    this.socket = io(`ws://${wsHost}:${wsPort}`, {
      timeout: 15000,
      withCredentials: true,
      reconnectionDelayMax: 10000,
      transports: ['websocket', 'polling'],
    });
  }

  static initializeConnection(callback) {
    this.socket.on('connect', () => {
      this.socketID = this.socket.id;
      this.isConnected = this.socket.connected;
      callback?.(this.isConnected);
    });
  }

  static reconnectChannel(callback) {
    this.socket.on('reconnect', () => {
      this.socketID = this.socket.id;
      callback();
      this.resetTriggeredCallbacks();
    });
  }

  static disconnectChannel() {
    this.socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
        this.resetTriggeredCallbacks();
      }
    });
  }

  static onConnectionError() {
    this.socket.on('connect_error', () => {
      this.socket.connect();
      this.resetTriggeredCallbacks();
    });
  }

  static resetTriggeredCallbacks() {
    this.triggeredCallbacks = {};
  }

  static socketEmitter(channel, data, callback) {
    return new Promise((resolve) => {
      const id = this.rid++;

      const emitData = {
        header: {
          ...data.header,
          token: localStorage.getItem('token') || '',
          rid: id,
        },
        body: data.body || {},
      };

      this.callbackMappings = {
        ...this.callbackMappings,
        [id]: callback,
      };

      this.triggeredCallbacks = {
        ...this.triggeredCallbacks,
        [id]: false,
      };

      this.socket.emit(channel, emitData);

      this.socket.on('response', ({ header, body }) => {
        resolve(true);
        if (this.triggeredCallbacks[header.rid]) {
          return;
        }

        this.callbackMappings[header.rid]?.(body);

        this.triggeredCallbacks[header.rid] = true;
      });
    });
  }

  static connectChannel(channel, callback) {
    return new Promise((resolve) => {
      this.socket.on(channel, (res) => {
        resolve(true);
        callback?.(res);
      });
    });
  }
}
