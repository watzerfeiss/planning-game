import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { getUserByToken } from "../utils/db.ts";

import { CtxState } from "../utils/types.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<CtxState>,
) {
  // const url = new URL(req.url);
  // if (url.pathname === "") {
  //   return await ctx.next();
  // }

  const cookies = getCookies(req.headers);
  const userToken = cookies.ut;
  if (userToken) {
    ctx.state.user = await getUserByToken({ userToken });
  }
  return await ctx.next();
}
