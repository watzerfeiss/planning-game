import { AppProps } from "$fresh/server.ts";
import { tw } from "twind";

export default function App({ Component }: AppProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>planning poker</title>
      </head>
      <body class={tw`bg-[whitesmoke] min-h-screen flex flex-col`}>
        <header>
          <a href="/">Planning poker</a>
        </header>
        <main class="flex-grow mx-auto px-4 py-8 max-w-2xl">
          <Component />
        </main>
        <footer>
          © watzerfeiss 2021
        </footer>
      </body>
    </html>
  );
}
