import { useEffect, useRef, useState } from "preact/hooks";
import { Room, RoomState } from "../utils/types.ts";

export default function PokerGame(
  { room, isAdmin = false }: {
    room: Room;
    isAdmin?: boolean;
  },
) {
  const socketRef = useRef<WebSocket | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [roomState, setRoomState] = useState<RoomState | null>(null);

  const roomIsHidden = roomState?.mode === "hidden";

  useEffect(() => {
    const wsOrigin = origin.replace("http", "ws");
    console.log(origin);
    const socket = new WebSocket(
      `${wsOrigin}/api/ws?roomId=${room.id}`,
    );
    socket.addEventListener("message", (evt) => {
      console.log("received update", evt.data);
      setRoomState(JSON.parse(evt.data).room);
    });

    socketRef.current = socket;
    return () => {
      socket.close();
    };
  }, []);

  const handleSendEstimate = (evt: Event) => {
    evt.preventDefault();
    const formData = new FormData(formRef.current || undefined);
    const estimate = formData.get("estimate");
    if (!estimate) {
      return;
    }

    socketRef.current?.send(JSON.stringify({ type: "estimate", estimate }));
  };

  const handleToggleState = () => {
    socketRef.current?.send(JSON.stringify({ type: "toggleState" }));
  };

  return (
    <div>
      Room #{room.id}
      {roomState &&
        (
          <>
            <ul>
              {roomState.members.map((member) => (
                <li>
                  {member.name}
                  {member.estimate &&
                    `(${roomIsHidden ? "ready" : member.estimate})`}
                </li>
              ))}
            </ul>
          </>
        )}

      <form onSubmit={handleSendEstimate} ref={formRef}>
        <label>
          Estimate: <input type="number" name="estimate" />
        </label>
        {roomIsHidden && (
          <button type="submit">
            Send
          </button>
        )}
      </form>

      {isAdmin && (
        <button onClick={handleToggleState}>
          {roomIsHidden ? "Reveal" : "Reset"}
        </button>
      )}
    </div>
  );
}
