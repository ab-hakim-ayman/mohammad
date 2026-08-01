export type SelectOption = {
    label: string;
    value: string;
};

export function createSelectOptions<T extends string>(
    enumOrArray: readonly T[] | Record<string, T>
): SelectOption[] {
    const values: string[] = Array.isArray(enumOrArray)
        ? enumOrArray
        : Object.values(enumOrArray);

    return values.map((item) => ({
        label: item
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()),
        value: item,
    }));
}