export function getDateFromDate(date: string) {
  const dateFormat = new Date(date);
  const year = dateFormat.getFullYear(); // Holt das Jahr
  const month = String(dateFormat.getMonth() + 1).padStart(2, "0"); // Holt den Monat (0-basiert, daher +1)
  const day = String(dateFormat.getDate()).padStart(2, "0"); // Holt den Tag
  return `${day}.${month}.${year}`;
}
export function getTimeFromDate(date: string) {
  const dateFormat = new Date(date);
  const hours = String(dateFormat.getHours()).padStart(2, "0"); // Stellt sicher, dass Stunden zweistellig sind
  const minutes = String(dateFormat.getMinutes()).padStart(2, "0"); // Stellt sicher, dass Minuten zweistellig sind
  return `${hours}:${minutes}`;
}
