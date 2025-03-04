"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Login() {
  const [error, setError] = useState<string | null>(null);

  

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
  
    const res = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  
    if (res?.error) {
      setError(res.error);
    }
  };
  

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <form
        className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 
        border border-solid border-black bg-white rounded"
        onSubmit={handleSubmit}
      >
        {error && <div className="text-red-500">{error}</div>}
        <h1 className="mb-5 w-full text-2xl font-bold">Sign In</h1>
        <label className="w-full text-sm">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="w-full h-8 border border-solid border-black rounded p-2"
          name="email"
          required
        />
        <label className="w-full text-sm">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="w-full h-8 border border-solid border-black rounded p-2"
          name="password"
          required
        />
        <button
          type="submit"
          className=" w-full border border-solid border-black py-1.5 mt-2.5 rounded
        transition duration-150  text-black bg-white"
        >
          Sign In
        </button>

        <Link
          href="/register"
          className="text-sm text-[#888] transition duration-150 ease-in-out hover:text-black"
        >
          Don&apos;t have an account?
        </Link>
      </form>
    </section>
  );
}