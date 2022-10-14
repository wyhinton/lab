import { useEffect, useReducer, useRef } from "react";
import { State } from "../interfaces/HookUtilities";
import useFetch from "./useFetch";

type DataSetName = "populations" | "movements" | undefined | string;

interface GetPopulationByPremiseFetchResult<T> {
  collectionName: string | undefined;
  data: T | undefined;
}

function useGetPopulationByPremiseId<T = unknown>(
  dataSetName: DataSetName,
  premiseId: string,
  validationFunction?: (data: any) => data is T
): State<GetPopulationByPremiseFetchResult<T>> {
  const item = useFetch<GetPopulationByPremiseFetchResult<T>>(
    `/data/${dataSetName}/get_by_premise/${premiseId}`
  );
  return item;
}

export default useGetPopulationByPremiseId;
