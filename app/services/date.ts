export function getDateFromDate(date: string) {
  const dateFormat = new Date(date);
  const year = dateFormat.getFullYear();
  const month = String(dateFormat.getMonth() + 1).padStart(2, "0");
  const day = String(dateFormat.getDate()).padStart(2, "0");
  return `${day}.${month}.${year}`;
}
export function getTimeFromDate(date: string) {
  const dateFormat = new Date(date);
  const hours = String(dateFormat.getHours()).padStart(2, "0");
  const minutes = String(dateFormat.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
