import { asset } from "$fresh/runtime.ts";
import { defineApp } from "$fresh/src/server/defines.ts";
import { CtxState } from "../utils/types.ts";

export default defineApp<CtxState>((req, ctx) => {
  const user = ctx.state.user;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href={asset("/style.css")} />
        <title>Projection holdem</title>
      </head>

      <body class="text-gray-800 bg-slate-50 min-h-screen flex flex-col">
        <header class="py-2 px-4 flex justify-between items-baseline gap-4 bg-white shadow-sm">
          <div class="flex flex-col">
            <a href="/" class="text-xl text-slate-600 font-semibold">
              Projection holdem
            </a>
            <span class="text-xs text-slate-400 max-md:hidden">
              cause "planning poker" is copyrighted or something idk
            </span>
          </div>

          {user && (
            <div class="text-right md:divide-x flex md:gap-2 max-md:flex-col">
              <span>
                <span class="max-md:hidden">{"Logged in as "}</span>
                <strong class="font-semibold">{user.name}</strong>
              </span>
              <span class="md:pl-2 flex-shrink-0">
                <a
                  href="/api/logout"
                  class="text-slate-400 underline hover:no-underline"
                >
                  Log out
                </a>
              </span>
            </div>
          )}
        </header>

        <main class="flex-grow px-4 py-8 flex justify-center">
          <div class="flex-grow max-w-2xl">
            <ctx.Component />
          </div>
        </main>

        <footer class="py-2 px-4 flex justify-between gap-1">
          <div class="ml-auto flex flex-col items-end text-end">
            <span class="text-sm text-gray-400">
              © {new Date().getFullYear()} watzerfeiss
            </span>
            <span class="text-xs text-gray-400">
              Site icon courtesy of Twemoji, © {new Date().getFullYear()}{" "}
              X Corp. (I guess) under CC-BY-4.0
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
});
