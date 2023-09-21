import { Handlers } from "$fresh/server.ts";

import { CtxState } from "../../utils/types.ts";
import { createRoom } from "../../controllers/room.ts";

export const handler: Handlers<never, CtxState> = {
  POST: async (_, ctx) => {
    const adminUser = ctx.state.user;

    if (!adminUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const room = await createRoom({ adminUser });
    if (!room) {
      return new Response("Could not create room", { status: 500 });
    }

    return new Response("Redirecting to room", {
      status: 302,
      headers: {
        "Location": `/room/${room.id}`,
      },
    });
  },
};
