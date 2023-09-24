export const getLabel = (option: number) => {
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
