import React from "react";
import UserClient from "../interfaces/UserClient";

export interface UserContextInterface {
  user: UserClient | undefined;
  token: string | undefined;
  login: (user: UserClient, token: string) => void;
  logout: () => void;
}

const UserContext = React.createContext<UserContextInterface>({
  user: undefined,
  token: undefined,
  login: (user: UserClient, token: string) => {},
  logout: () => {},
});

export const UserContextProvider = UserContext.Provider;
export const UserContextConsumer = UserContext.Consumer;

export default UserContext;
