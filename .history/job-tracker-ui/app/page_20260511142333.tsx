// app/page.tsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  ArrowRight,
  Sparkles,
  BarChart3,
  Brain,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
            <Briefcase className="h-7 w-7 text-white" />
          </div>

          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              JobTrackr
            </h1>

            <p className="text-sm text-slate-400">
              Smart AI Job Application Tracker
            </p>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            AI Powered Career Management
          </div>

          <h2 className="mb-6 text-5xl font-black leading-tight md:text-6xl">
            Track Jobs.
            <br />
            Crack Interviews.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Get Hired Faster.
            </span>
          </h2>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
            Organize your applications, practice AI interviews, analyze your
            progress, and stay ahead in your job hunt journey.
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700"
              >
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>

            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur transition-all hover:bg-white/20"
              >
                Login
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-20 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
              <Briefcase className="h-6 w-6 text-blue-400" />
            </div>

            <h3 className="mb-2 text-xl font-semibold">
              Job Tracking
            </h3>

            <p className="text-slate-400">
              Track all your job applications in one beautiful dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>

            <h3 className="mb-2 text-xl font-semibold">
              AI Interview Practice
            </h3>

            <p className="text-slate-400">
              Practice interviews with AI-generated questions and feedback.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
              <BarChart3 className="h-6 w-6 text-green-400" />
            </div>

            <h3 className="mb-2 text-xl font-semibold">
              Analytics
            </h3>

            <p className="text-slate-400">
              Visualize your progress and improve your application strategy.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}