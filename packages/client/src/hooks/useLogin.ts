import { useEffect, useReducer, useRef } from "react";
import { State } from "../interfaces/HookUtilities";
import UserClient from "../interfaces/UserClient";
import useFetch from "./useFetch";
import { useNavigate } from "react-router-dom";

function useLogin(
  username: string | undefined,
  password: string | undefined
): State<any> | undefined {
  const history = useNavigate();
  if (username && password) {
    const item = useFetch<UserClient>(`/users/validate`, {
      method: "GET",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    return item;
  }
  return undefined;
}

export default useLogin;
