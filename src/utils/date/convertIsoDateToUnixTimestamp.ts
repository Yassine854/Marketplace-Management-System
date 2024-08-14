export const convertIsoDateToUnixTimestamp = (isoDate: string): number => {
  const date = new Date(isoDate);
  return Math.floor(date.getTime() / 1000); // Convert milliseconds to UNIX timestamp
};
