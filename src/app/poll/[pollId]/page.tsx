"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { pollDocRef, votesCollection } from "@/lib/firebase";
import PollResults from "@/components/PollResults";
import OptionButtons from "@/components/OptionButtons";
import Loading from "@/components/Loading";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function VotePage({ params }: { params: { pollId: string } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [pollData, setPollData] = useState<null | {
    question: string;
    options: string[];
    isActive: boolean;
    expiresAt: Timestamp;
  }>(null);
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch poll data
  useEffect(() => {
    if (!params.pollId) return;
    const fetchPoll = async () => {
      try {
        const docSnap = await getDoc(pollDocRef(params.pollId));
        if (!docSnap.exists()) {
          showToast("Poll not found", "error");
          router.replace("/");
          return;
        }
        const data = docSnap.data() as {
          question: string;
          options: string[];
          isActive: boolean;
          expiresAt: Timestamp;
        };
        setPollData(data);
      } catch (err) {
        showToast("Error fetching poll", "error");
      }
    };
    fetchPoll();
  }, [params.pollId, router, showToast]);

  // Check if user already voted
  useEffect(() => {
    if (!params.pollId || !user) return;
    const checkVote = async () => {
      try {
        const voteSnap = await getDoc(doc(votesCollection(params.pollId), user.uid));
        if (voteSnap.exists()) {
          setHasVoted(true);
          const data = voteSnap.data() as { choice: string };
          setUserChoice(data.choice);
        }
      } catch (err) {
        console.error("Error checking vote:", err);
      }
    };
    checkVote();
  }, [params.pollId, user]);

  const handleVote = async (choice: string) => {
    if (!user || !params.pollId) return;
    setIsSubmitting(true);
    try {
      await setDoc(doc(votesCollection(params.pollId), user.uid), {
        choice,
        votedAt: serverTimestamp(),
      });
      setUserChoice(choice);
      setHasVoted(true);
      showToast("Vote recorded successfully!", "success");
    } catch (err: any) {
      showToast("Failed to record vote: " + err.message, "error");
    }
    setIsSubmitting(false);
  };

  if (authLoading || !pollData) {
    return <Loading />;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">{pollData.question}</h1>

        {!pollData.isActive ? (
          <div>
            <p className="text-red-500 font-medium mb-4">Poll Closed</p>
            <PollResults pollId={params.pollId} options={pollData.options} />
          </div>
        ) : hasVoted ? (
          <div>
            <p className="font-medium mb-2">
              You voted for:{" "}
              <span className="text-primary font-semibold">{userChoice}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Live results:
            </p>
            <PollResults pollId={params.pollId} options={pollData.options} />
          </div>
        ) : (
          <div>
            <p className="mb-4">Select an option:</p>
            <OptionButtons
              options={pollData.options}
              onSelect={handleVote}
              disabledChoices={isSubmitting ? pollData.options : []}
            />
            {isSubmitting && <Loading />}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 