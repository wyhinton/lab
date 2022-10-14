import { useEffect, useReducer, useRef } from "react";
import { State } from "../interfaces/HookUtilities";
import Movement from "../interfaces/Movement";
import useFetch from "./useFetch";

interface PopulationMovementDataFetchResult {
  recentMovementsTo: State<Movement[]>;
  recentMovementsFrom: State<Movement[]>;
}

function usePopulationMovementData(
  premiseId: string
): PopulationMovementDataFetchResult {
  console.log(premiseId);
  const recentMovementsTo = useFetch<Movement[]>(
    `/data/movements/get_recent_movements_to_premise/${premiseId}`
  );

  const recentMovementsFrom = useFetch<Movement[]>(
    `/data/movements/get_recent_movements_from_premise/${premiseId}`
  );

  return {
    recentMovementsTo,
    recentMovementsFrom,
  };
}

export default usePopulationMovementData;
