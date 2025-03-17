// app/layout.js - Root layout
import React from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'LLM Shark Tank',
  description: 'AI Evaluating Startup Pitches',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-slate-900 text-white py-6 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold tracking-tight mr-8">
                LLM Shark Tank
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="hover:text-blue-400 transition">
                  Home
                </Link>
                <Link href="/setup" className="hover:text-blue-400 transition">
                  Create New Run
                </Link>
              </div>
            </div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium text-sm">
              AI Decision Making
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-100 py-6 mt-10">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
            <p>LLM Shark Tank - AI Evaluation Platform</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
