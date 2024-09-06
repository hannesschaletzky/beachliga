export function calculateAge(): number {
  const birthdateArray: number[] = "03.02.1995".split(".").map(Number);
  const birthdateObject: Date = new Date(
    birthdateArray[2],
    birthdateArray[1] - 1,
    birthdateArray[0]
  );
  const currentDate: Date = new Date();

  let age: number = currentDate.getFullYear() - birthdateObject.getFullYear();

  // adjust age if birthday hasn't occurred yet this year
  if (
    currentDate.getMonth() < birthdateObject.getMonth() ||
    (currentDate.getMonth() === birthdateObject.getMonth() &&
      currentDate.getDate() < birthdateObject.getDate())
  ) {
    age--;
  }

  return age;
}

export function calculateMonthsDifference(startDate: string, endDate: string) {
  const startMonth = parseInt(startDate.split(".")[0]) - 1; // zero-indexed months
  const startYear = parseInt(startDate.split(".")[1]);

  const endMonth = parseInt(endDate.split(".")[0]) - 1; // zero-indexed months
  const endYear = parseInt(endDate.split(".")[1]);

  const monthsDifference =
    (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

  return Math.abs(monthsDifference);
}
