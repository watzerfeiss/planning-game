import { tx } from "twind";
import { RoomMember } from "../utils/types.ts";
import { getLabel } from "../utils/helpers.ts";

interface PokerTableProps {
  members: RoomMember[];
  isHidden: boolean;
}

interface PokerCardProps {
  member: RoomMember;
  isHidden: boolean;
}

export default function PokerTable({ members, isHidden }: PokerTableProps) {
  return (
    <ul class="max-w-2xl mx-auto p-4 flex flex-wrap justify-center gap-4 rounded border-1 border-slate-200 bg-white shadow-md">
      {members.map((member) => (
        <PokerCard
          member={member}
          isHidden={isHidden}
        />
      ))}
    </ul>
  );
}

function PokerCard({ member, isHidden }: PokerCardProps) {
  const hasEstimate = member.estimate !== undefined;

  return (
    <li class="flex flex-col items-center gap-2 text-center w-[8rem]">
      <div
        class={tx`w-16 h-24 p-1 bg-clip-content grid place-items-center rounded border-2 border-slate-600 text-slate-600
              ${!isHidden && "bg-slate-200"}
              ${
          isHidden && hasEstimate &&
          "bg-slate-500 overflow-clip relative before:(h-2 w-4 bg-slate-200 absolute top-0 left-0 origin-top-left rotate-[-135deg] translate-x-[23px] translate-y-[57px]) after:(absolute top-0 left-0 origin-top-left -rotate-45 h-2 w-8 bg-slate-200  translate-x-[22px] translate-y-14)"
        }
              ${
          isHidden && !hasEstimate &&
          "border-dashed bg-slate-50"
        }`}
      >
        {!isHidden && member.estimate !== undefined && (
          <span class="text-2xl font-semibold">
            {getLabel(member.estimate)}
          </span>
        )}
      </div>
      <span class="max-w-full break-words font-semibold">
        {member.name}
      </span>
    </li>
  );
}
