import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
}

export default function FloatingChatButton({ onClick }: FloatingChatButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-brand-accent via-brand-primary to-brand-secondary shadow-2xl z-50 flex items-center justify-center group"
    >
      <div className="absolute -inset-1 bg-brand-primary blur opacity-40 group-hover:opacity-60 transition-opacity" />
      <MessageSquare className="relative text-white w-7 h-7" />
    </motion.button>
  );
}
