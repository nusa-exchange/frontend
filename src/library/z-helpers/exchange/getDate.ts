const fixTime = (time: number) => ("00" + time).slice(-2);

const checkDate = (time: string | number | Date) => {
  const date = new Date(time);
  return date.getFullYear() === 1970
    ? new Date(date.getTime() * 1000)
    : new Date(time);
};

export const getDate = (time: string | number | Date, allowyear = false) => {
  const date = checkDate(time);
  const Year = allowyear ? date.getFullYear() + "-" : "";
  const Months = fixTime(date.getMonth() + 1);
  const Dates = fixTime(date.getDate());
  const Hours = fixTime(date.getHours());
  const Minutes = fixTime(date.getMinutes());
  const Seconds = fixTime(date.getSeconds());
  return `${Year}${Months}-${Dates} ${Hours}:${Minutes}:${Seconds}`;
};
