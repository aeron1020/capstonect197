"use client";
import { useState } from 'react';
import Link from 'next/link';
import api from '@/src/lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/password_reset/', { email });
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="bg-white border border-gray-200 p-10 w-full max-w-[350px] space-y-4 shadow-sm text-center">
        {/* Instagram style Lock Icon */}
        <div className="mx-auto w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>

        {!submitted ? (
          <>
            <h2 className="font-bold text-[#064e3b]">Trouble Logging In?</h2>
            <p className="text-xs text-gray-500 px-2">
              Enter your email and we'll send you a link to get back into your account.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-gray-50 border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="w-full btn-primary text-sm py-1.5">
                Send Login Link
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            <h2 className="font-bold text-[#064e3b]">Email Sent!</h2>
            <p className="text-xs text-gray-500">
              Check your inbox for a link to reset your password.
            </p>
          </div>
        )}

        <div className="flex items-center space-x-2 py-2">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-gray-400 text-[10px] font-bold uppercase">OR</span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        <Link href="/register" className="text-xs font-bold hover:text-gray-500 transition-colors">
          Create New Account
        </Link>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-3 w-full max-w-[350px] text-center">
        <Link href="/login" className="text-sm font-bold text-[#064e3b] hover:text-[#d4af37]">
          Back to Login
        </Link>
      </div>
    </div>
  );
}