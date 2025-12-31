import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "./config/database";
import User from "./models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  // Handle POST request to create a new user
  if (req.method === "POST") {
    try {
      const { firstName, lastName, email, password, role, avatar } = req.body;
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role,
        avatar,
      });
      // Optionally, you can return the created user without the password
      res.status(201).json({ success: true, user });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
