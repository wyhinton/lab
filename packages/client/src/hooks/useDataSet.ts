import { useEffect, useReducer, useRef } from "react";
import { State } from "../interfaces/HookUtilities";
import useFetch from "./useFetch";

type DataSetName = "populations" | "movements" | undefined | string;

interface useDataSetFetchResult<T> {
  collectionName: string | undefined;
  data: unknown | T[];
}

function useDataSet<T = unknown>(
  dataSetName: DataSetName,
  validationFunction?: (data: any) => data is T
): State<useDataSetFetchResult<T>> {
  const dataSet = useFetch<useDataSetFetchResult<T>>(
    `/data/${dataSetName}/get`
  );
  //   if (validationFunction) {
  //     if (Array.isArray(dataSet.data)) {
  //       const t = dataSet.data.filter((d) => validationFunction(d));
  //     }
  //   }
  return { ...dataSet };
}

export default useDataSet;
