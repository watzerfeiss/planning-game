import { Handlers } from "$fresh/server.ts";

import { getUserByToken } from "../../utils/db.ts";
import { addConnection } from "../../utils/connections.ts";
import { CtxState } from "../../utils/types.ts";

export const handler: Handlers<never, CtxState> = {
  GET: async (req, ctx) => {
    const upgrade = req.headers.get("upgrade");
    if (upgrade?.toLowerCase() !== "websocket") {
      return new Response("Not trying to upgrade", { status: 400 });
    }

    const roomId = (new URL(req.url)).searchParams.get("roomId");
    if (!roomId) {
      return new Response("Missing roomId parameter", { status: 400 });
    }

    const userToken = ctx.state.userToken;
    const user = userToken ? await getUserByToken({ userToken }) : null;
    if (!userToken || !user) {
      return new Response("Authorization required", { status: 401 });
    }

    // all good, creating connection
    const upgradeRequest = addConnection({ user, roomId });
    return upgradeRequest(req);
  },
};
