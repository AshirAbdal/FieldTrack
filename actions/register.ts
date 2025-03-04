"use server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const register = async (values: { name: string; email: string; password: string }) => {
  const { email, password, name } = values;

  try {
    await connectDB();

    const userFound = await User.findOne({ email });

    if (userFound) {
      return { error: "Email already exists!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    
    return { success: true, user: savedUser };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong!" };
  }
};
