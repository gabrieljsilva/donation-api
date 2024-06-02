type GroupByFunc<T> = (item: T) => string | number;

export function groupBy<T>(array: T[], keyFunc: GroupByFunc<T>): Record<string | number, T[]> {
  return array.reduce(
    (result, currentItem) => {
      const key = keyFunc(currentItem);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(currentItem);
      return result;
    },
    {} as Record<string | number, T[]>,
  );
}
