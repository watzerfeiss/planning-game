import { getLabel } from "../utils/helpers.ts";
import { RoomMember } from "../utils/types.ts";

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
    <li class="flex flex-col items-center gap-2 text-center w-[6rem]">
      <div
        class={`relative w-16 h-24 p-1 bg-clip-content grid place-items-center overflow-clip [overflow-clip-margin:content-box] rounded border-2 text-slate-600 bg-slate-100
              ${!isHidden && "bg-slate-200 border-slate-600"}
              ${
          isHidden && hasEstimate &&
          `border-slate-600
            before:w-full before:h-full before:from-slate-400 before:to-slate-100 before:[background-image:linear-gradient(to_right,_var(--tw-gradient-from)_50%,_var(--tw-gradient-to)_50%)] before:bg-[length:4px] before:scale-[2] before:rotate-45
            after:content-['Г'] after:text-left after:text-slate-500 after:absolute after:w-10 after:h-10 after:left-1/2 after:top-1/2 after:pl-2 after:text-3xl after:[line-height:34px] after:font-black after:rounded-full after:border-4 after:border-slate-400 after:bg-slate-100 after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-[225deg]`
        }
              ${
          isHidden && !hasEstimate &&
          "border-dashed bg-slate-50 border-slate-400"
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
