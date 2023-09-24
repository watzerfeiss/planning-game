import { RoomMember } from "../utils/types.ts";
import { Button } from "./Button.tsx";

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
      {isHidden ? (isAdmin && <Button onClick={onToggle}>Reveal</Button>) : (
        <>
          <span class="text-xl font-semibold">
            <span class="text-gray-500">Average:</span> {average}
          </span>
          {isAdmin && <Button onClick={onToggle}>Start new estimate</Button>}
        </>
      )}
    </div>
  );
}
