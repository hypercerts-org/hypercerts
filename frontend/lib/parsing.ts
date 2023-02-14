export const parseCsv = (csv: string) => {
  const [headersRaw, ...rest] = csv.split("\n");
  const headers = headersRaw.split(",");
  return rest
    .filter((row) => row !== "")
    .map((row) => {
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

export const parseListFromString = (input: string) => {
  return (
    input
      // Split on either new lines or commas
      .split(/[,\n]/)
      // Cleanup
      .map((i) => i.trim())
      // Filter out non-truthy values
      .filter((i) => !!i)
  );
};
