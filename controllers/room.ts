import { getRoomDataById, getUsersByIds, setRoomData } from "../utils/db.ts";
import { Room, RoomData } from "../utils/types.ts";

async function adaptRoom(roomData: RoomData) {
  const users = await getUsersByIds({ userIds: roomData.userIds });

  const room: Room = {
    id: roomData.id,
    adminId: roomData.adminId,
    users: users.map((u) => ({ ...u, estimate: roomData.estimates[u.id] })),
    state: roomData.state,
  };

  return room;
}

export async function getRoomById({ roomId }: { roomId: string }) {
  const roomData = await getRoomDataById({ roomId });
  if (!roomData) {
    return null;
  }

  return adaptRoom(roomData);
}

export async function addUser(
  { userId, roomId }: { userId: string; roomId: string },
) {
  const roomData = await getRoomDataById({ roomId });
  if (!roomData) {
    return null;
  }

  const userIds = roomData.userIds;
  if (!userIds.includes(userId)) {
    userIds.push(userId);
  }

  const added = await setRoomData({ ...roomData, userIds });

  return adaptRoom(added ? { ...roomData, userIds } : roomData);
}

export async function submitEstimate(
  { userId, roomId, estimate }: {
    userId: string;
    roomId: string;
    estimate: number;
  },
) {
  const room = await getRoomDataById({ roomId });
  if (!room || !room.userIds.includes(userId)) {
    return false;
  }

  const estimates = { ...room.estimates, [userId]: estimate };
  const updated = await setRoomData({ ...room, estimates });
  return updated;
}
