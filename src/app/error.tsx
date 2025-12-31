"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
