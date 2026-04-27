type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

function flattenClassValue(value: ClassValue, output: string[]) {
  if (!value) return;

  if (typeof value === "string" || typeof value === "number") {
    output.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      flattenClassValue(item, output);
    }
    return;
  }

  for (const [className, enabled] of Object.entries(value)) {
    if (enabled) output.push(className);
  }
}

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = [];

  for (const input of inputs) {
    flattenClassValue(input, classes);
  }

  return classes.join(" ");
}
