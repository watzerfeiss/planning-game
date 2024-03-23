export default function Spinner({ label }: { label?: string }) {
  return (
    <div class="grid gap-2 place-items-center before:w-[3rem] before:h-[3rem] before:border-4 before:rounded-full before:border-x-slate-400 before:border-y-transparent before:animate-[spin_1s_ease-in-out_infinite]">
      {label && <span class="text-slate-400">{label}</span>}
    </div>
  );
}
