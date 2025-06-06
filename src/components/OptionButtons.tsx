import { motion } from 'framer-motion'

interface OptionButtonsProps {
  options: string[]
  onSelect: (choice: string) => void
  disabledChoices?: string[]
}

export default function OptionButtons({ options, onSelect, disabledChoices = [] }: OptionButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <motion.button
          key={option}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(option)}
          disabled={disabledChoices.includes(option)}
          className={`
            w-full bg-white dark:bg-gray-800 
            border-2 border-primary dark:border-primary
            text-primary dark:text-primary
            py-3 px-6 rounded-lg
            hover:bg-primary hover:text-white dark:hover:bg-primary
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:bg-white dark:disabled:hover:bg-gray-800
            disabled:hover:text-primary dark:disabled:hover:text-primary
          `}
        >
          {option}
        </motion.button>
      ))}
    </div>
  )
} 