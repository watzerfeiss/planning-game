import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { getUserByToken } from "../utils/db.ts";

import { CtxState } from "../utils/types.ts";

export async function handler(
  req: Request,
  ctx: FreshContext<CtxState>,
) {
  console.log("mw: received request", req.url);
  const start = performance.now();

  if (ctx.destination !== "route") {
    const next = await ctx.next();
    console.log(
      "mw: request finished:",
      performance.now() - start,
      "ms",
      req.url,
    );
    return next;
  }

  const cookies = getCookies(req.headers);
  const userToken = cookies.ut;
  if (userToken) {
    ctx.state.user = await getUserByToken({ userToken });
  }
  const next = await ctx.next();
  console.log(
    "mw: request finished:",
    performance.now() - start,
    "ms",
    req.url,
  );

  return next;
}
