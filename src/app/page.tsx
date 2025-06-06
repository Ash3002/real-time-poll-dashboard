'use client'

import { useState, FormEvent } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import PollResults from "../components/PollResults";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { pollDocRef } from "@/lib/firebase";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [pollCode, setPollCode] = useState("");
  const [pollData, setPollData] = useState<null | {
    question: string;
    options: string[];
    isActive: boolean;
    id: string;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPollData(null);

    try {
      const docSnap = await getDoc(pollDocRef(pollCode));
      if (!docSnap.exists()) {
        showToast("Invalid Poll Code", "error");
        setIsLoading(false);
        return;
      }

      const data = docSnap.data() as {
        question: string;
        options: string[];
        isActive: boolean;
      };

      if (data.isActive) {
        // If poll is active and user is logged in, redirect to voting page
        if (user) {
          router.push(`/poll/${pollCode}`);
        } else {
          // If user is not logged in, redirect to login with return URL
          router.push(`/login?redirectTo=/poll/${pollCode}`);
        }
      } else {
        // Poll is closed, show results
        setPollData({
          question: data.question,
          options: data.options,
          isActive: false,
          id: pollCode,
        });
      }
    } catch (err) {
      showToast("Error fetching poll", "error");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          Real-Time Poll Dashboard
        </h1>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label
              htmlFor="pollCode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Enter Poll Code
            </label>
            <input
              id="pollCode"
              type="text"
              value={pollCode}
              onChange={(e) => setPollCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:ring-2 focus:ring-primary focus:border-transparent
                dark:bg-gray-700 dark:text-white"
              placeholder="e.g. ABC123"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md
              hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200"
          >
            {isLoading ? "Joining..." : "Join Poll"}
          </button>
        </form>

        {isLoading && <Loading />}

        {pollData && !pollData.isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold mb-2">{pollData.question}</h2>
              <p className="text-red-500 font-medium">This poll has ended</p>
            </div>
            <PollResults pollId={pollData.id} options={pollData.options} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 