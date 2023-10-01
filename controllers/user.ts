import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { deleteUser, setUser } from "../utils/db.ts";

export async function createUser({ name }: { name: string }) {
  const user = { id: nanoid(8), name };
  const userToken = nanoid(16);

  const created = await setUser({ user, userToken });
  return created ? user : null;
}

export { deleteUser };
