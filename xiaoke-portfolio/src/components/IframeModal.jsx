import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

const IframeModal = ({ isOpen, onClose, url, title }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-pure-black/90 backdrop-blur-sm p-4 md:p-8"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl h-[85vh] bg-white rounded-sm overflow-hidden shadow-2xl border border-pure-white/10 flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-pure-black text-pure-white">
            <h3 className="text-sm font-bold tracking-widest uppercase truncate max-w-[70%]">
              {title || '在线体验'}
            </h3>
            <div className="flex items-center gap-4">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pure-white/60 hover:text-pure-white transition-colors"
                title="在新窗口打开"
              >
                <ExternalLink size={18} />
              </a>
              <button
                onClick={onClose}
                className="text-pure-white/60 hover:text-pure-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Iframe Container */}
          <div className="flex-1 bg-light-grey relative">
            <iframe
              src={url}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IframeModal;
