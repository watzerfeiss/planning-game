import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useRef, useState } from "preact/hooks";

import CopyButton from "./CopyButton.tsx";
import EstimateOptions from "../components/EstimateOptions.tsx";
import PokerTable from "../components/PokerTable.tsx";
import GameDashboard from "../components/GameDashboard.tsx";
import { Room, RoomState, User } from "../utils/types.ts";
import { ESTIMATE_OPTIONS } from "../utils/constants.ts";

export default function PokerGame(
  { room, user }: {
    room: Room;
    user: User;
  },
) {
  const socketRef = useRef<WebSocket | null>(null);

  const [roomState, setRoomState] = useState<RoomState | null>(null);

  const roomIsHidden = roomState?.mode === "hidden";
  const isAdmin = room.adminId === user.id;

  useEffect(() => {
    const wsOrigin = origin.replace("http", "ws");
    const socket = new WebSocket(
      `${wsOrigin}/api/ws?roomId=${room.id}`,
    );
    socket.addEventListener("message", (evt) => {
      setRoomState(JSON.parse(evt.data).room);
    });

    socketRef.current = socket;
    return () => {
      socket.close();
    };
  }, []);

  const handleSendEstimate = (estimate: number) => {
    socketRef.current?.send(JSON.stringify({ type: "estimate", estimate }));
  };

  const handleToggleMode = () => {
    socketRef.current?.send(JSON.stringify({ type: "toggle" }));
  };

  return (
    <div class="divide-y-2 divide-slate-100">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-semibold">
          <span class="text-gray-400">Room #</span>
          {room.id}
        </h1>

        {IS_BROWSER && (
          <CopyButton copyText={window.location?.href}>
            Copy invitation link
          </CopyButton>
        )}
      </div>

      {roomState &&
        (
          <section class="mt-2 pt-4">
            <h2 class="mb-4 text-lg italic text-center">
              {roomIsHidden ? "Game in progress" : "The results are in"}
            </h2>

            <PokerTable members={roomState.members} isHidden={roomIsHidden} />
            <GameDashboard
              members={roomState.members}
              isHidden={roomIsHidden}
              isAdmin={isAdmin}
              onToggle={handleToggleMode}
            />
          </section>
        )}

      <section class="mt-8 pt-4">
        <h2 class="mb-4 text-lg italic text-center">
          {roomIsHidden
            ? "Submit your estimate"
            : (isAdmin
              ? "Start a new estimate"
              : "Wait for a new estimation to start")}
        </h2>
        <EstimateOptions
          options={ESTIMATE_OPTIONS}
          onSelect={handleSendEstimate}
          disabled={!roomIsHidden}
          userEstimate={roomState?.members.find((m) => m.id === user.id)
            ?.estimate}
        />
      </section>
    </div>
  );
}
