import { HandlerContext, PageProps } from "$fresh/server.ts";
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
      <h1>Planning poker i guess</h1>
      {!data?.user ? <NoUser /> : <WelcomeScreen user={data.user} />}
    </div>
  );
}

function NoUser() {
  return (
    <>
      <form action="/api/signup" method="POST">
        <h2>Join planning poker</h2>
        <label>
          User name:
          <input type="text" name="username" />
          <button type="submit">Log in</button>
        </label>
      </form>
    </>
  );
}

function WelcomeScreen({ user }: { user: User }) {
  return (
    <>
      <p>Welcome, {user.name}</p>
      <form action="/api/rooms" method="POST">
        <button type="submit">Create new room</button>
      </form>

      <form>
        <h2>Join a room</h2>
        <label>
          Room #
          <input type="text" />
        </label>
        <button type="submit">Join</button>
      </form>
    </>
  );
}
