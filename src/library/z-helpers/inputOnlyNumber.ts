function string_to_number(value: string) {
  return value.replace(/[^0-9\\.]/g, "");
}

export const inputOnlyNumber = (number: string, fixed?: number) => {
  let value = number
    .split(".")
    .filter((val, index) => index <= 1)
    .map((val) => string_to_number(val))
    .join("."); // Remove all string

  value = value
    .split(".")
    .map((val, index) => {
      if (!index) return val; //for index key is zero

      if (fixed && val.length > fixed) {
        return val.substring(0, fixed);
      }
      return val;
    })
    .join(".");

  return value;
};
