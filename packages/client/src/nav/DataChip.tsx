import { Chip } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";

const DataChip = ({
  active,
  text,
}: {
  active: boolean;
  text: string;
}): JSX.Element => {
  return <Chip label={text} variant={active ? "filled" : "outlined"}></Chip>;
};

export default DataChip;
