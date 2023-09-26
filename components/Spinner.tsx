export default function Spinner({ label }: { label?: string }) {
  return (
    <div class="grid gap-2 place-items-center before:(w-[3rem] h-[3rem] border-4 rounded-full border-x-slate-400 border-y-transparent animate-[spin_1s_ease-in-out_infinite])">
      {label && <span class="text-slate-400">{label}</span>}
    </div>
  );
}
