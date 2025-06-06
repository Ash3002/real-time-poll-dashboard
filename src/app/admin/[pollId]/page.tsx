"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loading from "@/components/Loading";
import PollResults from "@/components/PollResults";
import { pollDocRef } from "@/lib/firebase";
import { formatRemainingTime } from "@/lib/pollHelpers";

export default function AdminPollPage({ params }: { params: { pollId: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [pollData, setPollData] = useState<{
    question: string;
    options: string[];
    createdBy: string;
    isActive: boolean;
    expiresAt: Timestamp;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("--:--");
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Fetch poll data and subscribe to updates
  useEffect(() => {
    const unsubscribe = onSnapshot(
      pollDocRef(params.pollId),
      (snapshot) => {
        if (!snapshot.exists()) {
          showToast("Poll not found", "error");
          router.push("/admin/create");
          return;
        }

        const data = snapshot.data() as {
          question: string;
          options: string[];
          createdBy: string;
          isActive: boolean;
          expiresAt: Timestamp;
        };
        setPollData({
          question: data.question,
          options: data.options,
          createdBy: data.createdBy,
          isActive: data.isActive,
          expiresAt: data.expiresAt,
        });
        setIsLoading(false);
      },
      (error) => {
        showToast("Error loading poll: " + error.message, "error");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [params.pollId, router, showToast]);

  // Check if user is the poll creator
  useEffect(() => {
    if (pollData && user && pollData.createdBy !== user.uid) {
      showToast("You do not have permission to view this poll", "error");
      router.push("/");
    }
  }, [pollData, user, router, showToast]);

  // Countdown timer effect
  useEffect(() => {
    if (!pollData) return;

    const interval = setInterval(async () => {
      const remainingMs = pollData.expiresAt.toDate().getTime() - Date.now();
      
      if (remainingMs <= 0 && pollData.isActive) {
        // Auto-close poll when time expires
        try {
          await updateDoc(pollDocRef(params.pollId), { isActive: false });
          showToast("Poll has ended", "success");
        } catch (err: any) {
          showToast("Error closing poll: " + err.message, "error");
        }
      } else {
        setTimeLeft(formatRemainingTime(pollData.expiresAt));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pollData, params.pollId, showToast]);

  const handleClosePoll = async () => {
    if (!pollData?.isActive) return;
    setIsClosing(true);

    try {
      await updateDoc(pollDocRef(params.pollId), { isActive: false });
      showToast("Poll closed successfully", "success");
    } catch (err: any) {
      showToast("Error closing poll: " + err.message, "error");
    }
    setIsClosing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!pollData) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {pollData.question}
            </h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Poll ID: {params.pollId}
                </span>
                <AnimatePresence>
                  {pollData.isActive ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Active
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    >
                      Closed
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {pollData.isActive && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Time left: {timeLeft}
                  </span>
                  <button
                    onClick={handleClosePoll}
                    disabled={isClosing}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md
                      hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                      focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors duration-200"
                  >
                    {isClosing ? <Loading /> : "Close Poll"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Results
            </h2>
            <PollResults pollId={params.pollId} options={pollData.options} />
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
} 