import { useEffect, useReducer, useRef } from "react";
import { State } from "../interfaces/HookUtilities";
import UserClient from "../interfaces/UserClient";
import useFetch from "./useFetch";
import { useNavigate } from "react-router-dom";

function useVerifyLocalStorageCredentials(
  user: string | undefined,
  token: string | undefined
): State<UserClient> {
  const history = useNavigate();
  const item = useFetch<UserClient>(`/users/validate`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (item.error) {
    console.log(item);
    return item;
  } else {
    // if (item.data) history("/login");
  }

  return item;
}

export default useVerifyLocalStorageCredentials;
