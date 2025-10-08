export const getFormattedDateTime = () => {
  const now = new Date();

  const startDateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const startDate = startDateFormatter.format(now).replace(/-/g, "/");

  const startTimeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const startTime = startTimeFormatter
    .format(now)
    .replace(",", "")
    .toUpperCase();

  return { startDate, startTime };
};
