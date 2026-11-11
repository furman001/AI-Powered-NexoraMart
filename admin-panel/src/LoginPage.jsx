import { useState } from "react";
import { useAuth } from "./AuthContext";




export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");




  async function handleSubmit(event) {
    event.preventDefault();


    if (loading) {
      return;
    }


    setError("");


    try {
      await login(email, password);
    } catch (loginError) {
      setError(
        loginError?.message ||
          "Login failed. Please check your email and password."
      );
    }
  }




  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="absolute -left-32 -top-32 size-96 rounded-full bg-purple-600/30 blur-3xl animate-float" />
      <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-blue-600/30 blur-3xl animate-float" />
      <div className="absolute left-1/2 top-1/3 size-72 rounded-full bg-fuchsia-500/20 blur-3xl animate-float" />


      <form
        onSubmit={handleSubmit}
        className="animate-fade-up relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-fuchsia-500 text-2xl font-black text-white shadow-lg">
            N
          </div>


          <h1 className="text-3xl font-black text-white">
            NexoraMart
          </h1>


          <p className="mt-2 text-slate-300">
            Admin Panel
          </p>
        </div>


        <label className="mb-5 block">
          <span className="mb-2 block text-sm font-semibold text-slate-200">
            Email
          </span>


          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 transition focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
            placeholder="admin@nexoramart.com"
            required
          />
        </label>


        <label className="mb-6 block">
          <span className="mb-2 block text-sm font-semibold text-slate-200">
            Password
          </span>


          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            placeholder="Enter your password"
            required
          />
        </label>


        {error && (
          <p className="animate-fade-in mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-center text-sm text-red-300">
            {error}
          </p>
        )}


        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 px-4 py-3 font-bold text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:shadow-fuchsia-500/30 disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>


        <p className="mt-6 text-center text-xs text-slate-400">
          Protected admin area
        </p>
      </form>
    </div>
  );
}