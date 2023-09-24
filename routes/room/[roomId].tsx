import { Handlers, PageProps } from "$fresh/server.ts";

import PokerGame from "../../islands/PokerGame.tsx";
import { getRoomById } from "../../utils/db.ts";
import { sendMemberRequest } from "../../utils/sync.ts";
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

    const user = ctx.state.user;

    // no room record found in kv
    if (!room) {
      return ctx.render({ room, user }, { status: 404 });
    }
    console.log(user, room);
    // otherwise, send join request
    if (user && room) {
      sendMemberRequest({ user, roomId, type: "join" });
    }

    return ctx.render({ room, user });
  },
};

export default function Room({ data }: PageProps<RoomPageData>) {
  const { room, user } = data;

  return (
    <div>
      {!room && <NoRoom />}

      {room && !user && <NoUser room={room} />}

      {room && user && <PokerGame room={room} user={user} />}
    </div>
  );
}

function NoUser({ room }: { room: Room }) {
  return (
    <>
      <h2>Join room #{room.id}</h2>

      <form action={`/api/signup?roomId=${room.id}`} method="POST">
        <label>
          Username
          <input type="text" name="username" />
        </label>
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
