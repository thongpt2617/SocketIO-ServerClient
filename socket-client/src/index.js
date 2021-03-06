// socket.io-client@3
import { io } from "socket.io-client";
import config from "./config/index.js";

const rootNsp = "/";

const options = {
  path: "/ws", // default is "/socket.io"
  auth: {},
  transports: ["websocket"],
};

const server = `ws://${config.server_host}:${config.server_port}${rootNsp}`;

// obj argument
// -- token: the authn token of the user using this socket client instance
const initRootNspSocket = ({ token = "123" }) => {
  // add "token" to the auth obj
  options.auth.token = token;

  // declare the socke instance connecting to the "root" namespace
  const rootNspSocket = io(server, options);
  console.log(`init socker client to ${server}`);

  // handler invoked when socket client is connected
  rootNspSocket.on("connect", () => {
    console.log(`socket client ${rootNspSocket.id} connected`);

    // ---- Change this (begin) --- //
    // clientSendMessage
    // ------------- example ------------- //
    let message = {
      roomId: "6075d914390dfe6e8c0495e7",
      chatContent: {
        text: "text-message",
        image: "url-to-the-image",
      },
    };

    let intervalSendTestMsg = 5 * 1000;

    setInterval(() => {
      rootNspSocket.emit('chat', message, (ack) => {
        if (!ack) {
          // ---- Change this (begin) --- //
          // If not the ack is false, it means the message tranmission is failed, re-send if needed

          // ---- Change this (end) --- //
        }
      });
    }, intervalSendTestMsg);

    // ---- Change this (end) --- //
  });

  // ---- Change this (begin) --- //
  // add a handler for handle chat message of a specific room
  // roomId got from the api
  // ---------- example ------------------ //
  let renderingRoomId = "6075d914390dfe6e8c0495e7";
  // clientRenderMessage
  rootNspSocket.on(renderingRoomId, (data) => {
    // ---- Change this (begin) --- //
    // update the chat screen here
    console.log(`Data received on topic ${renderingRoomId}  :>> `, data);

    // ---- Change this (end) --- //
  });

  // ---- Change this (end) --- //

  // handler invoked when the connection is stopped
  rootNspSocket.on("disconnect", (reason) => {
    console.log(
      `socket client ${rootNspSocket.id} disconnected with reason`,
      reason
    );
  });

  // handler invoked when the connection can't establish
  rootNspSocket.on("connect_error", (err) => {
    console.log(`connection error`);
    // handle the error message (the message is customized)
    // if invalid token
    if (err.message === `server:invalid_token`) {
      console.log(`getting new token and re-initing`);
      // verify the current token, refresh it or re-login if needed
      // then, re-init the socket client instance

      // get the new token
      let newToken = "sylToken";

      // stop the current socket instance from trying  to reconnect
      rootNspSocket.disconnect();

      // init a new socket instance with the new token
      return initRootNspSocket({
        token: newToken,
      });
    }
  });
};

initRootNspSocket({});
