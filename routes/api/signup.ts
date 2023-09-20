import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

import { setUser } from "../../utils/db.ts";

export const handler: Handlers = {
  POST: async (req) => {
    const formData = await req.formData();
    const username = formData.get("username")?.toString();
    const roomId = (new URL(req.url)).searchParams.get("roomId");

    if (!username) {
      return new Response("No username provided", { status: 400 });
    }

    const user = { id: nanoid(), name: username.toString() };
    const userToken = nanoid();

    const created = await setUser({ user, userToken });
    if (!created) {
      return new Response("Could not create user", { status: 500 });
    }

    const res = new Response("Redirecting", {
      headers: { "Location": roomId ? `/room/${roomId}` : "/" },
      status: 302,
    });

    setCookie(res.headers, {
      name: "ut",
      value: userToken,
      path: "/",
      httpOnly: true,
    });

    return res;
  },
};
