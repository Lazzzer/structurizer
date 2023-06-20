"use client";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type StepType = {
  number: number;
  title: string;
};

type StepProps = {
  step: StepType;
  current: number;
};

export function Step({ step, current }: StepProps) {
  let status: "active" | "inactive" | "complete";

  if (current === step.number) {
    status = "active";
  } else if (current < step.number) {
    status = "inactive";
  } else {
    status = "complete";
  }

  return (
    <motion.div
      animate={status}
      initial={status}
      className="relative flex flex-col items-center"
    >
      <motion.div
        variants={backgroundVariants}
        transition={{ duration: 0.2 }}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-400 font-semibold text-slate-500"
      >
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {status === "complete" ? (
              <CheckIcon />
            ) : (
              <motion.span
                key="step"
                animate={{ opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute font-semibold text-xl"
              >
                {step.number}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <motion.div
        variants={backgroundVariants}
        transition={{ duration: 0.2 }}
        className={cn(
          step.number === current ? "font-bold" : "font-semibold",
          "text-xs leading-tight mt-2 w-16 h-6 flex items-center text-center justify-center"
        )}
      >
        <motion.span
          key="step"
          animate={{ opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="absolute"
        >
          {step.title}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-6 w-6 text-slate-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <motion.path
        variants={checkIconVariants}
        transition={checkIconTransition}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

const backgroundVariants = {
  inactive: {
    background: "var(--white)",
    borderColor: "var(--slate-300)",
    color: "var(--slate-300)",
  },
  active: {
    background: "var(--white)",
    borderColor: "var(--slate-800)",
    color: "var(--slate-800)",
  },
  complete: {
    background: "var(--white)",
    borderColor: "var(--slate-600)",
    color: "var(--slate-600)",
  },
};

const checkIconTransition = {
  ease: "easeOut",
  type: "tween",
  delay: 0.2,
  duration: 0.3,
};

const checkIconVariants = {
  complete: {
    pathLength: [0, 1],
  },
};
