"use client";

import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="font-bold text-2xl mb-2">Something went wrong!</h1>
      <p className="text-sm text-white/70">{error.message}</p>
      <Button
        variant="outline"
        className="mt-3 rounded-full"
        onClick={() => reset()}
      >
        Try Again
      </Button>
    </div >
  );
}
