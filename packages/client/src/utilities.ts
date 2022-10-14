const titleCase = (str: string): string => {
  if (str.length > 0) {
    str = str.replace("_", " ");
    let str_array = str.toLowerCase().split(" ");
    console.log(str_array);
    if (str_array.length > 0) {
      for (var i = 0; i < str_array.length; i++) {
        str_array[i] =
          str_array[i].charAt(0).toUpperCase() + str_array[i].slice(1);
      }
      return str_array.join(" ");
    } else {
      return str;
    }
  } else {
    return str;
  }
};

const pluralToSingular = (str: string) => {
  const last_char = str.at(-1);
  if (last_char === "s") {
    return str.substring(0, str.length - 1);
  }
  return str;
};

export { titleCase, pluralToSingular };
