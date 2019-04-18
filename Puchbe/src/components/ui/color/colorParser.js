import pallete from "./colors";

const parseColor = color => {
  if (!color) color = "primary";

  switch (color) {
    case "primary":
      color = pallete.primary;
      break;
    case "secondary":
      color = pallete.secondary;
      break;
    case "green":
      color = pallete.green;
      break;
    case "red":
      color = pallete.red;
      break;
    case "light":
      color = pallete.light;
      break;
    case "dark":
      color = pallete.dark;
      break;
    case "lessdark":
      color = pallete.lessdark;
      break;
  }

  return color;
};

export default parseColor;
