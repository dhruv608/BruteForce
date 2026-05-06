"use client";

import React, { useRef } from "react";
import { MapPin, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { YourRankProps } from '@/types/student/index.types';

export function YourRank({ yourRank }: YourRankProps) {
  const constraintsRef = useRef(null);

  if (!yourRank) return null;

  // Check for empty state
  const hasNoData =
    (yourRank.easy_solved || 0) === 0 &&
    (yourRank.medium_solved || 0) === 0 &&
    (yourRank.hard_solved || 0) === 0 &&
    !yourRank.total_assigned;

  if (hasNoData) {
    return (
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-100">
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          dragMomentum={false}
          className="pointer-events-auto absolute"
          initial={{ x: 20, y: 120 }}
        >
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-3 py-1.5 rounded-lg  bg-primary text-black text-sm font-semibold shadow hover:scale-105 transition">
                Rank #{yourRank.rank}
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              align="center"
              className="w-[280px] p-0 border-none bg-transparent shadow-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="bg-background/95 backdrop-blur-xl   rounded-2xl p-5 shadow-lg"
              >
                <div className="text-center space-y-3 rounded-2xl">
                  <div className="w-12 h-12 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                    <span className="text-lg font-bold text-muted-foreground">
                      #{yourRank.rank}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      {yourRank.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      You're not ranked in this batch yet.
                      <br />
                      This leaderboard is for the 2025 batch.
                      <br />
                      Complete assigned questions to appear here.
                    </p>
                  </div>
                </div>
              </motion.div>
            </PopoverContent>
          </Popover>
        </motion.div>
      </div>
    );
  }

  const easy = yourRank.easy_solved || 0;
  const medium = yourRank.medium_solved || 0;
  const hard = yourRank.hard_solved || 0;
  const totalSolved = Number(yourRank.total_solved) || (easy + medium + hard);
  const totalAssigned = yourRank.total_assigned || 1;
  const unsolved = Math.max(0, totalAssigned - totalSolved);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const easyDash = (easy / totalAssigned) * circumference;
  const mediumDash = (medium / totalAssigned) * circumference;
  const hardDash = (hard / totalAssigned) * circumference;
  const mediumOffset = easyDash;
  const hardOffset = easyDash + mediumDash;

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragMomentum={false}
        className="pointer-events-auto absolute"
        initial={{ x: 20, y: 120 }}
      >
        <Popover >
          <PopoverTrigger asChild>
            <button className="px-3 py-1.5 rounded-lg  bg-primary text-black text-sm font-semibold shadow hover:scale-105 transition">
            Your Rank #{yourRank.rank}
            </button>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="center"
            className="w-[280px]  rounded-2xl  bg-transparent -p-2 shadow-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="bg-background/95 backdrop-blur-xl   rounded-2xl p-3 shadow-lg"
            >
              {/* Profile Section */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">

                  {yourRank.profile_image_url ?

                    <img
                      src={yourRank.profile_image_url || "/default-avatar.png"}
                      className="w-12 h-12 rounded-full border-2 border-primary/30 object-cover"
                    />
                    :
                    <ProfileAvatar username={yourRank.username || ""}  />
                }

                  <div className="absolute -bottom-1 -right-1 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    #{yourRank.rank}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{yourRank.name}</h3>
                  <span className="text-xs text-muted-foreground block truncate">
                    @{yourRank.username}
                  </span>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 bg-muted/50 rounded-full flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {yourRank.city_name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-muted/50 rounded-full flex items-center gap-0.5">
                      <GraduationCap className="w-2.5 h-2.5" />
                      {yourRank.batch_year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Unified Donut - Easy/Medium/Hard/Unsolved in one circle */}
              <div className="flex justify-center mb-4">
                <div className="relative w-[140px] h-[140px]">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Base ring (= unsolved) */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      className="text-muted/30"
                    />
                    {/* Easy segment */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="#22c55e"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${easyDash} ${circumference}`}
                      strokeDashoffset={0}
                      strokeLinecap="butt"
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={{ strokeDasharray: `${easyDash} ${circumference}` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    {/* Medium segment */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="#f59e0b"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${mediumDash} ${circumference}`}
                      strokeDashoffset={-mediumOffset}
                      strokeLinecap="butt"
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={{ strokeDasharray: `${mediumDash} ${circumference}` }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                    />
                    {/* Hard segment */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="#ef4444"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${hardDash} ${circumference}`}
                      strokeDashoffset={-hardOffset}
                      strokeLinecap="butt"
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={{ strokeDasharray: `${hardDash} ${circumference}` }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-foreground leading-none">
                      {totalSolved}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">
                      of {totalAssigned}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compact legend */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3 px-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                    <span className="text-muted-foreground">Easy</span>
                  </span>
                  <span className="font-semibold text-foreground">{easy}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    <span className="text-muted-foreground">Medium</span>
                  </span>
                  <span className="font-semibold text-foreground">{medium}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                    <span className="text-muted-foreground">Hard</span>
                  </span>
                  <span className="font-semibold text-foreground">{hard}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted/60 border border-border" />
                    <span className="text-muted-foreground">Unsolved</span>
                  </span>
                  <span className="font-semibold text-foreground">{unsolved}</span>
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-primary/10 rounded-2xl p-2.5 text-center border border-primary/20">
                  <div className="text-xs text-muted-foreground">Score</div>
                  <div className="font-bold text-sm text-primary">
                    {yourRank.score}
                  </div>
                </div>
                <div className="bg-muted/40 rounded-2xl p-2.5 text-center border border-border/50">
                  <div className="text-xs text-muted-foreground">Max Streak</div>
                  <div className="font-bold text-sm">
                    {yourRank.max_streak}
                  </div>
                </div>
              </div>
            </motion.div>
          </PopoverContent>
        </Popover>
      </motion.div>
    </div>
  );
}
