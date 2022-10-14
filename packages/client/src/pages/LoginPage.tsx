import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Content, getContentBasedScheme, Root } from "@mui-treasury/layout";
import {
  Alert,
  Card,
  CardContent,
  CssBaseline,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import UserClient from "../interfaces/UserClient";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  message: string;
  token: string;
  user: UserClient;
}

async function doLogin(
  username: string | undefined,
  password: string | undefined,
  onSuccess: (result: LoginResponse) => void,
  onError: (error: Error) => void
) {
  if (username && password) {
    const rawResponse = await fetch("/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    console.log(rawResponse);
    const content = await rawResponse.json();
    if (rawResponse.status === 401) {
      onError(content.error);
      console.log("got error");
    } else {
      onSuccess(content);
    }
    console.log(content);
  }
}

const LoginPage = () => {
  const scheme = getContentBasedScheme();

  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const navigate = useNavigate();

  const userContext = useContext(UserContext);

  const onSuccess = (data: LoginResponse) => {
    userContext.token = data.token;
    navigate("/");
  };
  const onError = (err: Error) => {
    setErrorMessage("Login Failed");
  };

  return (
    <Root scheme={scheme}>
      <CssBaseline />
      <Content>
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          justifyContent="center"
        >
          <Card sx={{ display: "flex", alignItems: "center" }}>
            <CardContent>
              <Stack spacing={4}>
                <Typography variant="h5">Login To View Records</Typography>
                {<Alert severity="error">{errorMessage}</Alert> && errorMessage}
                <TextField
                  required
                  id="outlined-required"
                  label="Username"
                  defaultValue="Hello World"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      //@ts-ignore
                      doLogin(userName, password, onSuccess, onError);
                    }
                  }}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
                <TextField
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      //@ts-ignore
                      doLogin(userName, password, onSuccess, onError);
                    }
                  }}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Content>
    </Root>
  );
};

export default LoginPage;
