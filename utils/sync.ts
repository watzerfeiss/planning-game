import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/nanoid.ts";
import {
  addMember,
  getOwnedRoom,
  getOwnedRoomIds,
  removeMember,
  submitEstimate,
  toggleRoom,
} from "../controllers/room.ts";
import {
  MembershipMessage,
  RoomState,
  RoomUpdateMessage,
  UserActionMessage,
} from "./types.ts";

const createDuplex = (name: string) => ({
  in: new BroadcastChannel(name),
  out: new BroadcastChannel(name),
});

const membershipRequests = createDuplex("membershipRequests");
const userActions = createDuplex("userActions");
const roomUpdates = createDuplex("roomUpdates");
const updateRequests = createDuplex("updateRequests");

// by room id
const subscribers: Map<string, Set<(room: RoomState) => void>> = new Map();

updateRequests.in.addEventListener(
  "message",
  (evt: MessageEvent<{ roomId: string; requestId: string }>) => {
    const room = getOwnedRoom({ roomId: evt.data.roomId });
    if (!room) {
      return;
    }

    sendRoomUpdate({ room, requestId: evt.data.requestId });
  },
);

// deliver room updates to subscribers
roomUpdates.in.addEventListener(
  "message",
  (evt: MessageEvent<RoomUpdateMessage>) => {
    const { room } = evt.data;
    subscribers.get(room.id)?.forEach((cb) => cb(room));
  },
);

membershipRequests.in.addEventListener(
  "message",
  (evt: MessageEvent<MembershipMessage>) => {
    const { roomId, user, type } = evt.data;

    switch (type) {
      case "join":
        addMember({ user, roomId });
        break;

      case "leave":
        if (roomId) {
          removeMember({ userId: user.id, roomId });
        } else {
          for (const roomId of getOwnedRoomIds()) {
            removeMember({ userId: user.id, roomId });
          }
        }
        break;
    }
  },
);

userActions.in.addEventListener(
  "message",
  (evt: MessageEvent<UserActionMessage>) => {
    const { userId, roomId, action } = evt.data;
    const room = getOwnedRoom({ roomId });
    if (!room) {
      return;
    }

    switch (action.type) {
      case "estimate":
        submitEstimate({ userId, roomId, estimate: action.estimate });
        break;
      case "toggle":
        toggleRoom({ userId, roomId });
    }
  },
);

export const sendUserAction = (msg: UserActionMessage) => {
  userActions.out.postMessage(msg);
};

export const sendMemberRequest = (msg: MembershipMessage) => {
  membershipRequests.out.postMessage(msg);
};

export const sendRoomUpdate = (
  { room, requestId }: { room: RoomState; requestId: string },
) => {
  roomUpdates.out.postMessage({ room, requestId });
};

export const requestRoomUpdate = ({ roomId }: { roomId: string }) => {
  const requestId = nanoid();
  updateRequests.out.postMessage({ requestId, roomId });
  const claimTimeoutId = setTimeout(() => {
    console.log("claiming");
  }, 2000);

  roomUpdates.in.addEventListener(
    "message",
    (evt: MessageEvent<{ requestId: string }>) => {
      if (evt.data.requestId !== requestId) {
        return;
      }
      clearTimeout(claimTimeoutId);
    },
    { once: true },
  );
};

// returns cancel function
export const subscribeToRoomUpdates = (
  roomId: string,
  cb: (room: RoomState) => void,
) => {
  let subscriberSet = subscribers.get(roomId);
  if (!subscriberSet) {
    subscriberSet = new Set();
    subscribers.set(roomId, subscriberSet);
  }

  subscriberSet?.add(cb);

  return () => {
    subscriberSet?.delete(cb);
  };
};
