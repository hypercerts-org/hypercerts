export const parseCsv = (csv: string) => {
  const [headersRaw, ...rest] = csv.split("\n");
  const headers = headersRaw.split(",");
  return rest.map((row) => {
    const values = row.split(",");
    return values.reduce(
      (result, value, currentIndex) => ({
        ...result,
        [headers[currentIndex]]: value,
      }),
      {} as Record<string, string>,
    );
  });
};
