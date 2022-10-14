import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import DataTableDisplay from "./pages/DataTableDisplay";
import IndividualDisplay from "./pages/IndividualDisplay";
import LoginPage from "./pages/LoginPage";
import { useEffect, useState } from "react";
import UserClient from "./interfaces/UserClient";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState<UserClient | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const Login = (_user: UserClient, _token: string) => {
    setUser(_user);
    setToken(_token);

    localStorage.setItem("user", JSON.stringify(_user));
    localStorage.setItem("token", _token);
  };

  const Logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    console.log("Loading application.");

    if (user === null || token === null) {
      console.log(
        "Not logged in in current session, checking localstorage",
        "Auth"
      );

      let _token = localStorage.getItem("token");
      let _user = localStorage.getItem("user");

      if (_user === null || _token === null) {
        console.log("nothing in local storage");
        Logout();
        navigate("/login");
        setLoading(false);
      } else {
        console.log("Credentials found, verifying.", "Auth");
        VerifyLocalStorageCredentials(_token, _user);
      }
    }
    console.log(user);
    // eslint-disable-next-line
  }, []);

  const VerifyLocalStorageCredentials = async (
    _token: string,
    _user: string
  ) => {
    try {
      console.log(_user);
      let _parsedUser = JSON.parse(_user);

      let response = await axios({
        method: "GET",
        url: "http://localhost:1337/users/validate",
        headers: {
          Authorization: `Bearer ${_token}`,
        },
      });

      if (response.status === 200 || response.status === 304) {
        Login(_parsedUser, _token);
        setLoading(false);
      } else {
        console.log("Credentials no longer valid", "Auth");
        Logout();
        navigate("/login");
        setLoading(false);
      }
    } catch (error) {
      Logout();
      navigate("/login");
      setLoading(false);
    }
  };

  return (
    <Routes>
      {/* <Route index path={"/"} element={<Navigate to={"data/populations"} />} /> */}
      <Route index path={"/"} element={<Home />} />
      <Route path={"data/:content"} element={<DataTableDisplay />} />
      <Route path={"data/:content/:id"} element={<IndividualDisplay />} />
      <Route path={"/login"} element={<LoginPage />} />
    </Routes>
  );
};

export default App;
