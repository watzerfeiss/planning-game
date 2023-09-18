import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

import { createUser } from "../../utils/db.ts";
import { addUser } from "../../controllers/room.ts";

export const handler: Handlers = {
  POST: async (req) => {
    const formData = await req.formData();
    const username = formData.get("username")?.toString();
    const roomId = formData.get("roomId")?.toString();

    if (!username) {
      return new Response("No username provided", { status: 400 });
    }

    const user = { id: nanoid(), name: username.toString() };
    const token = nanoid();

    const created = await createUser({ user, token });
    if (!created) {
      return new Response("Could not create user", { status: 500 });
    }

    if (roomId) {
      await addUser({ userId: user.id, roomId: roomId });
    }

    const res = new Response("Redirecting", {
      headers: { "Location": roomId ? `/room/${roomId}` : "/" },
      status: 302,
    });

    setCookie(res.headers, {
      name: "ut",
      value: token,
      path: "/",
      httpOnly: true,
    });

    return res;
  },
};
