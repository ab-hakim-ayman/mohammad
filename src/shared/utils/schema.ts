export const emptyStringToNull = (v: unknown) => {
  if (typeof v !== "string") return v;
  const trimmed = v.trim();
  return trimmed === "" ? null : trimmed;
};

export const nullToEmptyArray = (v: unknown) => {
  if (Array.isArray(v)) return v;
  return [];
};
