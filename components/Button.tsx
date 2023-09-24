import { JSX } from "preact";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={props.disabled}
      class="px-2 py-1 grid place-items-center rounded border border-transparent shadow text-slate-700 bg-slate-100 ring-slate-600 hover:bg-slate-200 active:(shadow-sm translate-y-1) disabled:(cursor-default shadow-none active:top-0) focus:(ring-2 ring-inset outline-none)"
    />
  );
}
