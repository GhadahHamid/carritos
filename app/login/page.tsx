"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (isLogin) {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/"); // Redirect to home page on success
        router.refresh();
      }
    } else {
      // Register
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        // Automatically log them in after registering
        await signIn("credentials", { email, password, redirect: false });
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-[1.5rem] shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#1E3A8A]">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-gray-500 mt-2">{isLogin ? "Sign in to your Carritos account" : "Join Carritos today"}</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" required className="w-full border rounded-lg px-4 py-3 text-gray-900" />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required className="w-full border rounded-lg px-4 py-3 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input type="password" name="password" required className="w-full border rounded-lg px-4 py-3 text-gray-900" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#F97316] text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition">
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-gray-500 hover:text-[#1E3A8A]">
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </main>
  );
}