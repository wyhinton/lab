import { Typography } from "@mui/material";

const ErrorOverlay = (props: any): JSX.Element => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
        background: `repeating-linear-gradient(
              45deg,
              rgba(100,100,100,0),
              rgba(100,100,100,0) 5px,
              rgba(100,100,100,.5) 5px,
              rgba(100,100,100,.6) 20px
          )`,
      }}
    >
      <Typography variant={"h6"}>{props.message}</Typography>
    </div>
  );
};
export default ErrorOverlay;
