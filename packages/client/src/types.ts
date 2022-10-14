type DataWithId = {
  _id: string;
  [key: string]: any;
};

// type KeysEnum<T> = { [P in keyof Required<T>]: true };
type KeysEnum<T> = (keyof T)[];

export type { DataWithId, KeysEnum };
