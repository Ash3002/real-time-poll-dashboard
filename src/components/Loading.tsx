import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="flex justify-center items-center p-4">
      <motion.div
        className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
} 