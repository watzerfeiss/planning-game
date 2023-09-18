import { useEffect, useRef, useState } from "preact/hooks";
import { Room } from "../utils/types.ts";

export default function PokerGame(
  { initialRoom, isAdmin = false }: { initialRoom: Room; isAdmin?: boolean },
) {
  const socketRef = useRef<WebSocket | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [room, setRoom] = useState<Room>(initialRoom);

  const isEstimating = room.state === "estimating";

  useEffect(() => {
    const wsOrigin = origin.replace("http", "ws");
    console.log(origin);
    const socket = new WebSocket(
      `${wsOrigin}/api/ws?roomId=${room.id}`,
    );
    socket.addEventListener("message", (evt) => {
      setRoom(JSON.parse(evt.data));
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
      {room &&
        (
          <>
            <ul>
              {room.users.map((user) => (
                <li>
                  {user.name}
                  {user.estimate &&
                    `(${isEstimating ? "ready" : user.estimate})`}
                </li>
              ))}
            </ul>
          </>
        )}

      <form onSubmit={handleSendEstimate} ref={formRef}>
        <label>
          Estimate: <input type="number" name="estimate" />
        </label>
        {isEstimating && (
          <button type="submit">
            Send
          </button>
        )}
      </form>

      {isAdmin && (
        <button onClick={handleToggleState}>
          {isEstimating ? "Reveal" : "Reset"}
        </button>
      )}
    </div>
  );
}
