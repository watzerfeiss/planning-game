import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Button } from "../components/Button.tsx";
import { CtxState, User } from "../utils/types.ts";

interface PageData {
  user: User | null;
}

export function handler(
  req: Request,
  ctx: HandlerContext<PageData, CtxState>,
) {
  const user = ctx.state.user;
  return ctx.render({ user });
}

export default function Home({ data }: PageProps<PageData>) {
  return (
    <div>
      {!data?.user ? <NoUser /> : <WelcomeScreen user={data.user} />}
    </div>
  );
}

function NoUser() {
  return (
    <div class="p-4 divide-y-2 divide-slate-100">
      <h2 class="mb-4 text-xl font-semibold">Join Projection holdem</h2>

      <form
        action="/api/signup"
        method="POST"
        class="pt-4"
      >
        <div class="flex items-end gap-1">
          <label class="flex items-center gap-1">
            User name:
            <input
              type="text"
              name="username"
              class="px-2 py-1 rounded border"
            />
          </label>
          <Button type="submit">Log in</Button>
        </div>
      </form>
    </div>
  );
}

function WelcomeScreen({ user }: { user: User }) {
  return (
    <div class="p-4 divide-y-2 divide-slate-100">
      <form action="/api/rooms" method="POST">
        <Button type="submit">Create new room</Button>
      </form>

      {
        /* <form>
        <h2>Join a room</h2>
        <label>
          Room #
          <input type="text" />
        </label>
        <button type="submit">Join</button>
      </form> */
      }
    </div>
  );
}
