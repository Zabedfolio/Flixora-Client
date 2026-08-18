'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: 'What is Flixora?',
    answer:
      'Flixora is a modern streaming platform where you can discover movies and TV shows, explore trending content, and manage your personal watchlist.',
  },
  {
    id: 2,
    question: 'Is Flixora free to use?',
    answer:
      'Yes, Flixora provides free content. Some premium content or features may require a subscription depending on your account plan.',
  },
  {
    id: 3,
    question: 'Can I create my own watchlist?',
    answer:
      'Yes. You can add movies and TV shows to your My List section and easily access them later.',
  },
  {
    id: 4,
    question: 'Can I watch movies on mobile devices?',
    answer:
      'Yes. Flixora is fully responsive and can be accessed from smartphones, tablets, laptops, and desktop devices.',
  },
  {
    id: 5,
    question: 'How can I search for a movie or TV show?',
    answer:
      'Use the search bar in the navigation area to search for movies, TV shows, actors, or other available content.',
  },
  {
    id: 6,
    question: 'Can I switch between different profiles?',
    answer:
      'Yes. Flixora supports profile switching so users can manage their own personalized experience.',
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(current => (current === index ? null : index));
  };

  return (
    <section className="w-full bg-black py-20 sm:py-24 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =====================================
            HEADER
        ====================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          className="text-center mb-12"
        >
          <span className="inline-block mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF4C00]">
            FAQ
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
            Everything you need to know about Flixora. Find answers to the most
            common questions below.
          </p>
        </motion.div>

        {/* =====================================
            FAQ LIST
        ====================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="space-y-3"
        >
          {FAQ_DATA.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <motion.div
                key={faq.id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.45,
                      ease: 'easeOut',
                    },
                  },
                }}
                className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
                  isOpen
                    ? 'border-[#FF4C00]/50 bg-[#111111]'
                    : 'border-[#1A1A1A] bg-[#080808]'
                }`}
              >
                {/* Question */}
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 sm:px-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#FF4C00] focus-visible:ring-inset"
                >
                  <span
                    className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${
                      isOpen ? 'text-[#FF4C00]' : 'text-white'
                    }`}
                  >
                    {faq.question}
                  </span>

                  <motion.span
                    animate={{
                      rotate: isOpen ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="shrink-0 text-zinc-400"
                  >
                    <FaChevronDown className="text-sm" />
                  </motion.span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        height: {
                          duration: 0.35,
                          ease: 'easeInOut',
                        },
                        opacity: {
                          duration: 0.2,
                        },
                      }}
                    >
                      <div className="border-t border-[#1A1A1A] px-5 pb-5 pt-4 sm:px-6">
                        <p className="text-sm leading-7 text-zinc-400">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* =====================================
            BOTTOM CTA
        ====================================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-zinc-500">Still have questions?</p>

          <button
            type="button"
            className="mt-3 text-sm font-semibold text-[#FF4C00] transition-colors hover:text-orange-400"
          >
            Contact Support →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
