import { tx } from "twind";
import { getLabel } from "../utils/helpers.ts";

interface EstimateOptionsProps {
  options: number[];
  onSelect: (value: number) => void;
  userEstimate?: number;
  disabled?: boolean;
}

export default function EstimateOptions(
  { options, onSelect, userEstimate, disabled }: EstimateOptionsProps,
) {
  return (
    <ul class="flex flex-wrap justify-center gap-2">
      {options.map((option) => (
        <li>
          <button
            class={tx`w-12 h-20 p-2 text-center  rounded shadow relative focus:outline-none active:top-1 active:shadow-sm disabled:cursor-default disabled:shadow-none active:disabled:top-0 focus:(ring-2 ring-inset)
            ${
              !disabled && userEstimate !== option &&
              "text-slate-700 bg-slate-100 ring-slate-600 hover:bg-slate-300"
            }
              ${
              !disabled && userEstimate === option &&
              "bg-slate-500 text-white ring-slate-600"
            }
            ${
              disabled && userEstimate !== option &&
              "bg-gray-100 text-gray-700 ring-gray-600"
            }
            
            ${
              disabled && userEstimate === option &&
              "bg-gray-400 text-gray-100 ring-gray-600"
            }`}
            onClick={() => onSelect(option)}
            disabled={disabled}
          >
            {getLabel(option)}
          </button>
        </li>
      ))}
    </ul>
  );
}
