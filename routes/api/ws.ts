import { Handlers } from "$fresh/server.ts";

import { addConnection } from "../../utils/connections.ts";
import { CtxState } from "../../utils/types.ts";

export const handler: Handlers<never, CtxState> = {
  GET: (req, ctx) => {
    const upgrade = req.headers.get("upgrade");
    if (upgrade?.toLowerCase() !== "websocket") {
      return new Response("Not trying to upgrade", { status: 400 });
    }

    const roomId = (new URL(req.url)).searchParams.get("roomId");
    if (!roomId) {
      return new Response("Missing roomId parameter", { status: 400 });
    }

    const user = ctx.state.user;
    if (!user) {
      return new Response("Authorization required", { status: 401 });
    }

    // all good, creating connection
    const upgradeRequest = addConnection({ user, roomId });
    return upgradeRequest(req);
  },
};
