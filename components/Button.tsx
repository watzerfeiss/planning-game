import { JSX } from "preact";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={props.disabled}
      class={`${props.class} px-2 py-1 grid place-items-center rounded border border-transparent shadow text-slate-700 bg-slate-100 ring-slate-600 hover:bg-slate-200 active:shadow-sm active:translate-y-1 disabled:cursor-default disabled:shadow-none disabled:active:top-0 focus:ring-2 focus:ring-inset focus:outline-none`}
    />
  );
}
