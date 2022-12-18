import React from "react";
import { useParams } from "react-router-dom";

const PublicPresent = () => {
  const { id } = useParams();
  console.log(id);
  return <div>Public Present</div>;
};

export default PublicPresent;
