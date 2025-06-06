"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { pollsCollection } from "@/lib/firebase";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";

export default function CreatePollPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [duration, setDuration] = useState<number>(60);
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate question
    if (!question.trim()) {
      showToast("Please enter a question", "error");
      setIsLoading(false);
      return;
    }

    // Validate options
    const validOptions = options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      showToast("Please enter at least two options", "error");
      setIsLoading(false);
      return;
    }

    try {
      const expiresAt = Timestamp.fromDate(new Date(Date.now() + duration * 1000));
      const docRef = await addDoc(pollsCollection(), {
        question: question.trim(),
        options: validOptions,
        createdBy: user?.uid,
        createdAt: serverTimestamp(),
        isActive: true,
        expiresAt,
      });

      showToast("Poll created successfully!", "success");
      router.push(`/admin/${docRef.id}`);
    } catch (err: any) {
      showToast("Error creating poll: " + err.message, "error");
    }
    setIsLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Create New Poll
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Poll Question
              </label>
              <input
                id="question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  dark:bg-gray-700 dark:text-white"
                placeholder="Enter your question here..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Options
              </label>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                        focus:ring-2 focus:ring-primary focus:border-transparent
                        dark:bg-gray-700 dark:text-white"
                      placeholder={`Option ${index + 1}`}
                      required={index < 2}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="p-2 text-red-500 hover:text-red-600 focus:outline-none"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-3 text-sm text-primary hover:text-primary-dark focus:outline-none"
              >
                + Add Option
              </button>
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Duration (seconds)
              </label>
              <input
                id="duration"
                type="number"
                min={10}
                max={3600}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  dark:bg-gray-700 dark:text-white"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Minimum: 10 seconds, Maximum: 1 hour
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium
                text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2
                focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200"
            >
              {isLoading ? <Loading /> : "Create Poll"}
            </button>
          </form>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
} 