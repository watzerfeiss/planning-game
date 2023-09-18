import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

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
  ctx.state.userToken = cookies.ut;
  return await ctx.next();
}
