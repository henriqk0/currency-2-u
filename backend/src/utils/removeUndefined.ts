type WithoutUndefined<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: Exclude<T[K], undefined>;
}

export function removeUndefined<T extends Record<string, unknown>>(
  obj: T
): WithoutUndefined<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as WithoutUndefined<T>;
}