import React, { useState, useEffect, useRef } from "react";
import { Route } from "react-router-dom";
const TableLink = ({
  text,
  url,
}: {
  text: string;
  url: string;
}): JSX.Element => {
  return (
    <Route path={url}>
      {text}
      {url}
    </Route>
  );
};

export default TableLink;
