import { useEffect, useReducer, useRef } from "react";
import { State } from "../interfaces/HookUtilities";
import useFetch from "./useFetch";

type DataSetName = "populations" | "movements" | undefined | string;

interface CollectionItemReadResult<T> {
  collectionName: string | undefined;
  data: T | undefined;
}

function isDbRead<T>(data: any): data is CollectionItemReadResult<T> {
  if ("collectionName" in data && "data" in data) {
    return true;
  } else {
    return false;
  }
}
function useCollectionItem<T = unknown>(
  dataSetName: DataSetName,
  itemId: string,
  validationFunction?: (data: any) => data is T
): State<CollectionItemReadResult<T>> {
  const url = `/data/${dataSetName}/get/${itemId}`;
  console.log(url);
  const item = useFetch<T>(`/data/${dataSetName}/get/${itemId}`);
  //@ts-ignore
  return item;
}

export default useCollectionItem;
