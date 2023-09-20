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
  lastAlive: number;
}

interface TerminationTask {
  userId: string;
  timeoutId: number;
}

const TERMINATION_TIMEOUT = 3000;

const terminationQueue: TerminationTask[] = [];

type AddConnection = (
  params: { user: User; roomId: string },
) => (req: Request) => Response;

// by user id
const connections: Map<string, ConnectionRecord> = new Map();

// TODO heartbeat

export const addConnection: AddConnection = ({ user, roomId }) => (req) => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  connections.set(user.id, { socket, roomId, lastAlive: Date.now() });

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
    addTerminationTask(user.id, () => {
      cancelSub();
      sendMemberRequest({ user, roomId, type: "leave" });
    });
  });

  return response;
};

const addTerminationTask = (userId: string, cb: () => void) => {
  terminationQueue.push({
    userId,
    timeoutId: setTimeout(() => {
      cb();
      terminationQueue.filter((tt) => tt.userId !== userId);
    }, TERMINATION_TIMEOUT),
  });
};

const removeTerminationTask = (userId: string) => {
  clearTimeout(terminationQueue.find((tt) => tt.userId === userId)?.timeoutId);
};

const createMessageRouter =
  ({ roomId, user }: { roomId: string; user: User }) => (evt: MessageEvent) => {
    const userId = user.id;
    const action = JSON.parse(evt.data) as UserAction;
    sendUserAction({ roomId, userId, action });
  };
