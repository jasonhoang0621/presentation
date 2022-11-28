import React from "react";

const LoadingScreen = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 30,
        }}
      >
        Loading...
      </div>
    </div>
  );
};

export default LoadingScreen;
