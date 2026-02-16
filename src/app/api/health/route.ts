import { connectDB } from "@/app/api/config/database";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const state = mongoose.connection.readyState;

    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const statusMap: { [key: number]: string } = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    const status = statusMap[state] ?? "unknown";

    return NextResponse.json({
      status: "ok",
      dbState: status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to database",
      },
      { status: 500 }
    );
  }
}
