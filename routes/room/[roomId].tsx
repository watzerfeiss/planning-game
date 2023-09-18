import { Handlers, PageProps } from "$fresh/server.ts";

import { addUser, getRoomById } from "../../controllers/room.ts";
import PokerGame from "../../islands/PokerGame.tsx";
import { getUserByToken } from "../../utils/db.ts";
import { CtxState, Room, User } from "../../utils/types.ts";

// 2x2 matrix: room either exists or not, user either authorized or not
type RoomPageData = {
  user: User | null;
  room: Room | null;
};

export const handler: Handlers<RoomPageData, CtxState> = {
  GET: async (_req, ctx) => {
    const roomId = ctx.params["roomId"];
    const room = await getRoomById({ roomId });

    const userToken = ctx.state.userToken;
    const user = userToken ? await getUserByToken({ token: userToken }) : null;

    if (user && room) {
      await addUser({ roomId: room.id, userId: user.id });
    }

    return ctx.render({ room, user }, { status: room ? 200 : 404 });
  },
};

export default function Room({ data }: PageProps<RoomPageData>) {
  const { room, user } = data;

  return (
    <div class="max-w-xl mx-auto grid gap-8">
      <header class="px-4 py-8 mx-auto bg-[#decade]">
        <h1 class="text-4xl font-bold">kv or whatever</h1>
      </header>

      <main>
        {!room && <NoRoom />}

        {room && !user && <NoUser room={room} />}

        {room && user && <PokerGame roomState={room} />}
      </main>
    </div>
  );
}

function NoUser({ room }: { room: Room }) {
  return (
    <>
      <h2>Join room #{room.id}</h2>

      <form action="/api/signup" method="POST">
        <label>
          Username
          <input type="text" name="username" />
        </label>
        <input type="hidden" name="roomId" value={room.id} />
        <button type="submit">Join</button>
      </form>
    </>
  );
}

function NoRoom() {
  return (
    <>
      <h2>This room doesn't exist</h2>
      <a href="/">Go to main page</a>
    </>
  );
}
