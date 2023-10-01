import { Room, User } from "./types.ts";

const kv = await Deno.openKv();

export async function setUser(
  { user, userToken }: { user: User; userToken: string },
) {
  const result = await kv
    .atomic()
    .set(["users_by_token", userToken], user)
    .set(["users", user.id], { user })
    .set(["tokens_by_userId", user.id], userToken)
    .commit();

  return result.ok;
}

export async function deleteUser({ userId }: { userId: string }) {
  const userToken = (await kv.get<string>(["tokens_by_userId", userId])).value;
  const result = await kv
    .atomic()
    .delete(["users", userId]).delete(["users_by_token", userToken || ""])
    .delete(["tokens_by_userId", userId])
    .commit();

  return result.ok;
}

export async function getUserByToken({ userToken }: { userToken: string }) {
  const user = await kv.get<User>(["users_by_token", userToken]);
  return user.value;
}

export async function getUserById({ userId }: { userId: string }) {
  const user = await kv.get<User>(["users", userId]);
  return user.value;
}

export async function getUsersByIds({ userIds }: { userIds: string[] }) {
  const users = (await kv.getMany<User[]>(userIds.map((ut) => ["users", ut])))
    .flatMap(
      (uv) => uv.value === null ? [] : [uv.value],
    );
  return users;
}

export async function getRoomById({ roomId }: { roomId: string }) {
  const { value: room } = await kv.get<Room>(["rooms", roomId]);
  return room;
}

export async function setRoom(room: Room): Promise<boolean> {
  const { ok } = await kv.set(["rooms", room.id], room);
  return ok;
}
