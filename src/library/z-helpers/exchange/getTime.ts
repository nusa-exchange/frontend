export const getTime = (time: string | number | Date) => {
  return new Date(time).toTimeString().slice(0, 8);
};
