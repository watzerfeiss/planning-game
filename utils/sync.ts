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
  (evt: MessageEvent<{ roomId: string }>) => {
    const room = getOwnedRoom({ roomId: evt.data.roomId });
    if (!room) {
      return;
    }

    sendRoomUpdate(room);
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

export const sendRoomUpdate = (room: RoomState) => {
  roomUpdates.out.postMessage({ room });
};

export const requestRoomUpdate = ({ roomId }: { roomId: string }) => {
  updateRequests.out.postMessage({ roomId });
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
