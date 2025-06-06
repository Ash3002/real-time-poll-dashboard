import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`
          fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg
          ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
          text-white
        `}
        onAnimationComplete={() => {
          setTimeout(onClose, duration)
        }}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  )
} 