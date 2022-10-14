import { Typography } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Home = (): JSX.Element => {
  return (
    <div>
      <ul>
        <Typography variant={"h4"}>
          <Link to="/data/populations">View Populations Records</Link>
        </Typography>
      </ul>
    </div>
  );
};

export default Home;
