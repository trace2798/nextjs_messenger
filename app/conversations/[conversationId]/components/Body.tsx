"use client";

import axios from "axios";
import { FC } from "react";

interface BodyProps {}

const Body: FC<BodyProps> = ({}) => {
  return (
    <>
      <div className="flex-1 overflow-y-auto">Body</div>
    </>
  );
};

export default Body;
