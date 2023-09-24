import { RoomMember } from "../utils/types.ts";

interface GameDashboardProps {
  members: RoomMember[];
  isHidden: boolean;
  isAdmin: boolean;
  onToggle: () => void;
}

export default function GameDashboard(
  { members, isHidden, isAdmin, onToggle }: GameDashboardProps,
) {
  const estimates = members
    .flatMap((m) => m.estimate !== undefined ? [m.estimate] : []);
  const average = estimates.length === 0
    ? "None"
    : (estimates.reduce((sum, e) => sum + e) / estimates.length).toFixed(1);

  return (
    <div class="max-w-2xl min-h-[8rem] p-4 flex flex-col justify-start items-center gap-2">
      {isHidden ? (isAdmin && <button onClick={onToggle}>Reveal</button>) : (
        <>
          <span class="text-xl font-semibold">
            <span class="text-gray-500">Average:</span> {average}
          </span>
          {isAdmin && <button onClick={onToggle}>Start new estimate</button>}
        </>
      )}
    </div>
  );
}
