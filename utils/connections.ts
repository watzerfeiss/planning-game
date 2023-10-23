import {
  requestRoomUpdate,
  sendMemberRequest,
  sendUserAction,
  subscribeToRoomUpdates,
} from "../utils/sync.ts";
import { User, UserAction } from "./types.ts";

interface ConnectionRecord {
  socket: WebSocket;
  roomId: string;
}
type AddConnection = (
  params: { user: User; roomId: string },
) => (req: Request) => Response;

// by user id
const connections: Map<string, ConnectionRecord> = new Map();

export const addConnection: AddConnection = ({ user, roomId }) => (req) => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  console.log("adding connection", user.id, roomId);
  connections.set(user.id, { socket, roomId });

  const cancelSub = subscribeToRoomUpdates(roomId, (room) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ room }));
    }
  });

  socket.addEventListener("open", () => {
    requestRoomUpdate({ roomId });
  });

  socket.addEventListener("message", createMessageRouter({ user, roomId }));

  socket.addEventListener("close", () => {
    cancelSub();
    sendMemberRequest({ user, roomId, type: "leave" });
    console.log("removing connection", user.id, roomId);
  });

  return response;
};

const createMessageRouter =
  ({ roomId, user }: { roomId: string; user: User }) => (evt: MessageEvent) => {
    const userId = user.id;
    const action = JSON.parse(evt.data) as UserAction;
    sendUserAction({ roomId, userId, action });
  };
