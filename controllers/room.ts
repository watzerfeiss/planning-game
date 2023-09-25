import { customAlphabet } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { setRoom } from "../utils/db.ts";
import { RoomState, User } from "../utils/types.ts";
import { sendRoomUpdate } from "../utils/sync.ts";

const createRoomId = customAlphabet("0123456789ABCDEF", 8);

// authoritative room states
// created by users connected to this instance
const rooms: Map<string, RoomState> = new Map();

// get the authoritative room state if this instance owns this room
export function getOwnedRoom({ roomId }: { roomId: string }) {
  return rooms.get(roomId) || null;
}

export async function createRoom({ adminUser }: { adminUser: User }) {
  const room: RoomState = {
    id: createRoomId(),
    adminId: adminUser.id,
    members: [adminUser],
    mode: "hidden",
  };

  rooms.set(room.id, room);
  const ok = await setRoom({ id: room.id, adminId: adminUser.id });
  return ok ? room : null;
}

export function addMember(
  { user, roomId }: { user: User; roomId: string },
) {
  const room = rooms.get(roomId);
  if (!room) {
    return null;
  }

  const members = room.members;

  if (!members.find((m) => m.id === user.id)) {
    members.push(user);
    sendRoomUpdate(room);
  }

  return room;
}

// TODO remove member
export function removeMember(
  { userId, roomId }: { userId: string; roomId: string },
) {
  const room = rooms.get(roomId);
  if (!room) {
    return null;
  }

  const updatedRoom: RoomState = {
    ...room,
    members: room.members.filter((m) => m.id !== userId),
  };

  rooms.set(roomId, updatedRoom);
  sendRoomUpdate(updatedRoom);
  return updatedRoom;
}

export function submitEstimate(
  { userId, roomId, estimate }: {
    userId: string;
    roomId: string;
    estimate: number;
  },
) {
  const room = rooms.get(roomId);
  if (!room) {
    return null;
  }

  if (room?.mode === "revealed") {
    return room;
  }

  const updatedRoom = {
    ...room,
    members: room?.members.map((m) => m.id === userId ? { ...m, estimate } : m),
  };

  rooms.set(room.id, updatedRoom);
  sendRoomUpdate(updatedRoom);
  return updatedRoom;
}

export function toggleRoom(
  { roomId, userId }: { roomId: string; userId: string },
) {
  const room = rooms.get(roomId);

  if (!room || room.adminId !== userId) {
    return null;
  }

  const updatedRoom: RoomState = {
    ...room,
    mode: room.mode === "hidden" ? "revealed" : "hidden",
  };
  if (updatedRoom.mode === "hidden") { // remove estimates
    updatedRoom.members = room.members.map(({ estimate: _, ...m }) => m);
  }

  rooms.set(room.id, updatedRoom);
  sendRoomUpdate(updatedRoom);
  return updatedRoom;
}
