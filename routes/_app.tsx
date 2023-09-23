import { defineApp } from "$fresh/src/server/defines.ts";
import { CtxState } from "../utils/types.ts";

export default defineApp<CtxState>((req, ctx) => {
  const user = ctx.state.user;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>planning poker</title>
      </head>
      <body class="text-[#222222] bg-[#f8f9fa] min-h-screen flex flex-col">
        <header class="p-4 flex justify-between gap-1 bg-white shadow-sm">
          <a href="/">Planning poker</a>
          {user && (
            <div>
              Logged in as <strong class="font-semibold">{user.name}</strong>
            </div>
          )}
        </header>
        <main class="flex-grow mx-auto px-4 py-8 max-w-2xl">
          <ctx.Component />
        </main>
        <footer>
          © watzerfeiss 2021
        </footer>
      </body>
    </html>
  );
});
