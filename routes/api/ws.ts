import { Handlers } from "$fresh/server.ts";
import {
  getRoomById,
  submitEstimate,
  toggleState,
} from "../../controllers/room.ts";
import { getUserByToken } from "../../utils/db.ts";
import { CtxState, SyncMessage, UserMessage } from "../../utils/types.ts";

const connections: Map<string, WebSocket> = new Map();

const bc = new BroadcastChannel("sync");
bc.addEventListener("message", async (evt: MessageEvent<SyncMessage>) => {
  const { roomData } = evt.data;
  const room = await getRoomById({ roomId: roomData.id });

  roomData.userIds.forEach((userId) => {
    connections.get(userId)?.send(JSON.stringify(room));
  });
});

export const handler: Handlers<never, CtxState> = {
  GET: async (req, ctx) => {
    const upgrade = req.headers.get("upgrade");
    if (upgrade?.toLowerCase() !== "websocket") {
      return new Response("Not trying to upgrade", { status: 400 });
    }

    console.log(req.url);
    const roomId = (new URL(req.url)).searchParams.get("roomId");
    if (!roomId) {
      return new Response("Missing roomId parameter", { status: 400 });
    }

    const userToken = ctx.state.userToken;
    const user = userToken ? await getUserByToken({ token: userToken }) : null;
    if (!userToken || !user) {
      return new Response("Authorization required", { status: 401 });
    }

    const room = await getRoomById({ roomId });
    const { response, socket } = Deno.upgradeWebSocket(req);

    connections.set(user.id, socket);

    socket?.addEventListener("open", () => {
      socket.send(JSON.stringify(room));
    });

    // user message router, needs to be extracted & improved
    // could be a closure (e.g. "createMessageRouter"), containing roomId & stuff
    socket?.addEventListener("message", (evt) => {
      const message = JSON.parse(evt.data) as UserMessage;
      console.log(
        `user ${user.name} in room ${roomId} sent message of type ${message.type}${
          message.type === "estimate" ? ` (${message.estimate})` : ""
        }`,
      );

      if (message.type === "estimate") {
        submitEstimate({ roomId, userId: user.id, estimate: message.estimate });
      }

      if (message.type === "toggleState") {
        toggleState({ roomId, userToken });
      }
    });

    socket?.addEventListener("close", () => {
      connections.delete(user.id);
    });

    return response;
  },
};
