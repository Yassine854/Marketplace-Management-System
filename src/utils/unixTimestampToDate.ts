export const unixTimestampToDate = (timestamp: number): string => {
  // Create a new Date object using the provided timestamp
  const dateObject = new Date(timestamp);

  // Extract day, month, and year components from the Date object
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are 0-indexed
  const year = dateObject.getFullYear();

  // Return the date string in the format "DD/MM/YYYY"
  return `${day}/${month}/${year}`;
};
