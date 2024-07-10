export const unixTimestampToDateYMD = (timestamp: number): string => {
  // Create a new Date object using the provided timestamp
  const dateObject = new Date(timestamp);

  // Extract day, month, and year components from the Date object
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are 0-indexed
  const year = dateObject.getFullYear();

  if (!day || !month || !year) {
    return "";
  }

  return `${year}-${month}-${day}`;
};

export const unixTimestampToDateDMY = (timestamp: number): string => {
  if (timestamp === 0) {
    return "***";
  }
  // Create a new Date object using the provided timestamp
  const dateObject = new Date(timestamp);

  // Extract day, month, and year components from the Date object
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are 0-indexed
  const year = dateObject.getFullYear();

  if (!day || !month || !year) {
    return "***";
  }

  return `${day}-${month}-${year}`;
};

export const dateYMDToUnixTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
};
