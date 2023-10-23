import { defineApp } from "$fresh/src/server/defines.ts";
import { CtxState } from "../utils/types.ts";

export default defineApp<CtxState>((req, ctx) => {
  const user = ctx.state.user;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Projection holdem</title>
      </head>

      <body class="text-gray-800 bg-slate-50 min-h-screen flex flex-col">
        <header class="p-4 flex justify-between items-center gap-1 bg-white shadow-sm">
          <div class="flex flex-col">
            <a href="/" class="text-xl text-slate-600 font-semibold">
              Projection holdem
            </a>
            <span class="text-xs text-slate-400">
              cause "planning poker" is copyrighted or something idk
            </span>
          </div>
          {user && (
            <div class="divide-x flex gap-2">
              <span>
                Logged in as <strong class="font-semibold">{user.name}</strong>
              </span>
              <a
                href="/api/logout"
                class="pl-2 text-slate-400 underline hover:no-underline"
              >
                Log out
              </a>
            </div>
          )}
        </header>

        <main class="flex-grow px-4 py-8 flex justify-center">
          <div class="flex-grow max-w-2xl">
            <ctx.Component />
          </div>
        </main>

        <footer class="p-4 flex justify-between gap-1">
          <div class="ml-auto flex flex-col items-end">
            <span class="text-sm text-gray-400">
              © {new Date().getFullYear()} watzerfeiss
            </span>
            <span class="text-xs text-gray-400">
              Site icon courtesy of Twemoji, © 2023 X Corp. (I guess) under
              CC-BY-4.0
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
});
