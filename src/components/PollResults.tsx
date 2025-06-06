'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useCollection } from 'react-firebase-hooks/firestore'
import { votesCollection } from '@/lib/firebase'
import { countVotes } from '@/lib/pollHelpers'
import Loading from './Loading'

interface PollResultsProps {
  pollId: string
  options: string[]
}

const COLORS = [
  '#4ade80', // green-400
  '#facc15', // yellow-400
  '#f87171', // red-400
  '#a78bfa', // violet-400
  '#38bdf8', // sky-400
  '#f472b6', // pink-400
]

export default function PollResults({ pollId, options }: PollResultsProps) {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([])
  const [snapshot, loading, error] = useCollection(votesCollection(pollId))

  useEffect(() => {
    if (snapshot && options) {
      const data = countVotes(snapshot, options)
      setChartData(data)
    }
  }, [snapshot, options])

  if (loading) return <Loading />
  if (error) return <p className="text-red-500">Error loading results</p>

  const totalVotes = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total Votes: {totalVotes}
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => 
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={false}
              animationDuration={1000}
              animationBegin={0}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} votes`, 'Votes']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 