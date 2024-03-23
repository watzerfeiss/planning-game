import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

import { deleteUser } from "../../controllers/user.ts";
import { sendMemberRequest } from "../../utils/sync.ts";
import { CtxState } from "../../utils/types.ts";

export const handler: Handlers<void, CtxState> = {
  GET: async (_, ctx) => {
    const res = new Response("Redirecting", {
      headers: { "Location": "/" },
      status: 302,
    });

    const user = ctx.state.user;
    if (!user) {
      return res;
    }

    console.log("removing");
    const deleted = await deleteUser({ userId: user.id });
    if (deleted) {
      console.log("removed");
      sendMemberRequest({ user, type: "leave" });
      deleteCookie(res.headers, "ut", { path: "/" });
    }

    return res;
  },
};
