"use client";

import useActiveChannel from "../hooks/useActiveChannel";
//the purpose of this component is simply to trigger the useActiveChannel hook and its associated side effects, rather than rendering any visible UI.
const ActiveStatus = () => {
  useActiveChannel();

  return null;
};

export default ActiveStatus;
