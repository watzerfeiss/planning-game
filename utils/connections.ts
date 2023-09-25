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

const TERMINATION_TIMEOUT = 3000;

// maps userIds of connections slated for removal to timeoutIds
const terminationTasks: Map<string, number> = new Map();

type AddConnection = (
  params: { user: User; roomId: string },
) => (req: Request) => Response;

// by user id
const connections: Map<string, ConnectionRecord> = new Map();

export const addConnection: AddConnection = ({ user, roomId }) => (req) => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  connections.set(user.id, { socket, roomId });

  const cancelSub = subscribeToRoomUpdates(roomId, (room) => {
    console.log("sending room update to", user.name);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ room }));
    }
  });

  socket.addEventListener("open", () => {
    removeTerminationTask(user.id);
    requestRoomUpdate({ roomId });
  });

  socket.addEventListener("message", createMessageRouter({ user, roomId }));

  socket.addEventListener("close", () => {
    console.log("adding termination task for", user.id, "in", roomId);
    cancelSub();
    addTerminationTask(user.id, () => {
      console.log("executing termination task for", user.id, "in", roomId);
      sendMemberRequest({ user, roomId, type: "leave" });
    });
  });

  return response;
};

const addTerminationTask = (userId: string, cb: () => void) => {
  const timeoutId = setTimeout(() => {
    cb();
    terminationTasks.delete(userId);
  }, TERMINATION_TIMEOUT);
  terminationTasks.set(userId, timeoutId);
};

const removeTerminationTask = (userId: string) => {
  console.log("removing termination task for", userId);
  clearTimeout(terminationTasks.get(userId));
  terminationTasks.delete(userId);
};

const createMessageRouter =
  ({ roomId, user }: { roomId: string; user: User }) => (evt: MessageEvent) => {
    const userId = user.id;
    const action = JSON.parse(evt.data) as UserAction;
    sendUserAction({ roomId, userId, action });
  };
