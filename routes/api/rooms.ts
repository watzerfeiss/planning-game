import { Handlers } from "$fresh/server.ts";
import { customAlphabet } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

import { getUserByToken, setRoomData } from "../../utils/db.ts";
import { CtxState, RoomData } from "../../utils/types.ts";

const createRoomId = customAlphabet("0123456789ABCDEF", 8);

export const handler: Handlers<never, CtxState> = {
  POST: async (_, ctx) => {
    const token = ctx.state.userToken;

    const adminUser = token ? await getUserByToken({ token }) : null;
    if (!adminUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const room: RoomData = {
      id: createRoomId(),
      adminId: adminUser.id,
      userIds: [adminUser.id],
      estimates: {},
      state: "estimating",
    };

    const created = await setRoomData(room);
    if (!created) {
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
