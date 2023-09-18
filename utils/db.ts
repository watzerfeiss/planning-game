import { RoomData, User } from "./types.ts";

const kv = await Deno.openKv();

export async function createUser(
  { user, token }: { user: User; token: string },
) {
  const result = await kv
    .atomic()
    .set(["users_by_token", token], user)
    .set(["users", user.id], user)
    .commit();

  return result.ok;
}

export async function getUserByToken({ token }: { token: string }) {
  const user = await kv.get<User>(["users_by_token", token]);
  return user.value;
}

export async function getUsersByIds({ userIds }: { userIds: string[] }) {
  const users = (await kv.getMany<User[]>(userIds.map((ut) => ["users", ut])))
    .flatMap(
      (uv) => uv.value === null ? [] : [uv.value],
    );
  return users;
}

export async function getRoomDataById({ roomId }: { roomId: string }) {
  const { value: room } = await kv.get<RoomData>(["rooms", roomId]);
  return room;
}

export async function setRoomData(room: RoomData): Promise<boolean> {
  const { ok } = await kv.set(["rooms", room.id], room);

  if (ok) {
    const bc = new BroadcastChannel("sync");
    bc.postMessage({ roomData: room });
  }
  return ok;
}
