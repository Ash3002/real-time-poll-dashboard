'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Real-Time Poll Dashboard</h1>
        <p className="text-xl text-gray-600 mb-8">
          Create and participate in real-time polls with instant results
        </p>
        {!user ? (
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              href="/create"
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
            >
              Create New Poll
            </Link>
            <Link
              href="/polls"
              className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600"
            >
              View My Polls
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Create Polls</h2>
          <p className="text-gray-600 mb-4">
            Create custom polls with multiple options and real-time results tracking.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Multiple choice questions</li>
            <li>Real-time updates</li>
            <li>Customizable options</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Participate</h2>
          <p className="text-gray-600 mb-4">
            Vote on polls and see results update instantly.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Instant voting</li>
            <li>Live results</li>
            <li>Share with others</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 