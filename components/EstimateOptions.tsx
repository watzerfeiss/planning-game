interface EstimateOptionsProps {
  options: number[];
  onSelect: (value: number) => void;
  disabled?: boolean;
}

export default function EstimateOptions(
  { options, onSelect, disabled }: EstimateOptionsProps,
) {
  return (
    <ul class="flex flex-wrap justify-center gap-2 sha">
      {options.map((option) => (
        <li>
          <button
            class="w-12 h-20 p-2 text-center bg-white rounded shadow relative focus:outline-none active:top-1 active:shadow-sm disabled:cursor-default disabled:shadow-none active:disabled:top-0"
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

const getLabel = (option: number) => {
  switch (option) {
    case 0.25:
      return "¼";
    case 0.5:
      return "½";
    case 0.75:
      return "¾";
    default:
      return option.toString();
  }
};
