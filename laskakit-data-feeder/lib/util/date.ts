export const getCHMIUTCDate = (): string => {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  // image is generated every 10 minutes, floor down to nearest 10 minutes
  const minute = String(Math.floor(date.getUTCMinutes() / 10) * 10).padStart(2, '0');

  return `${year}${month}${day}.${hour}${minute}`;
};