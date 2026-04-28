"use client";

import { Award, ExternalLink, Trophy } from "lucide-react";
import Image from "next/image";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import Link from "next/link";
import { PodiumCardProps } from "@/types/student/index.types";

export const MobilePodiumCard = ({ student, rank }: PodiumCardProps) => {
  if (!student) return null;

  // 🎨 Color logic
  const ringColor =
    rank === 1
      ? "shadow-[0_0_25px_var(--chart-1)]"
      : rank === 2
      ? "shadow-[0_0_25px_var(--chart-2)]"
      : "shadow-[0_0_25px_var(--chart-5)]";

  const borderColor =
    rank === 1
      ? "border-[color:var(--chart-1)]"
      : rank === 2
      ? "border-[color:var(--chart-2)]"
      : "border-[color:var(--chart-5)]";

  const textColor =
    rank === 1
      ? "text-[color:var(--chart-1)]"
      : rank === 2
      ? "text-[color:var(--chart-2)]"
      : "text-[color:var(--chart-5)]";

  const badgeColor =
    rank === 1
      ? "bg-[color:var(--chart-1)] text-black"
      : rank === 2
      ? "bg-[color:var(--chart-2)] text-black"
      : "bg-[color:var(--chart-5)] text-black";

  const bgColor =
    rank === 1
      ? "bg-[color:var(--chart-1)/10]"
      : rank === 2
      ? "bg-[color:var(--chart-2)/10]"
      : "bg-[color:var(--chart-5)/10]";

  return (
    <div className="relative backdrop-blur-sm">
      <div
        className={`relative glass rounded-2xl px-3 py-4 w-full text-center border ${borderColor} shadow-xl`}
      >
        {/* 👑 Trophy */}
        {rank === 1 && (
          <Trophy className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 text-[color:var(--chart-1)]" />
        )}
        {rank === 2 && (
          <Award className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 text-[color:var(--chart-2)]" />
        )}
        {rank === 3 && (
          <Award className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 text-[color:var(--chart-5)]" />
        )}

        {/* Avatar */}
        <div className="relative mb-2 flex justify-center">
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-full blur-md opacity-70 ${ringColor}`}
            />
            <div
              className={`relative w-16 h-16 rounded-full border-2 ${borderColor} bg-card overflow-hidden flex items-center justify-center`}
            >
              {student?.profile_image_url ? (
                <Image
                  src={student.profile_image_url}
                  alt={student.name || "profile"}
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <ProfileAvatar
                  username={student?.username || ""}
                  bgcolor={
                    rank === 1
                      ? "var(--chart-1)"
                      : rank === 2
                      ? "var(--chart-2)"
                      : "var(--chart-5)"
                  }
                  size={64}
                />
              )}
            </div>

            {/* Rank */}
            <div
              className={`absolute bottom-0 right-0 text-xs px-2 py-0.5 rounded-2xl font-bold ${badgeColor}`}
            >
              {rank}
            </div>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-sm truncate">
          {student.name}
        </h3>

        {/* Username */}
        <p className={`text-[10px] ${textColor} truncate flex justify-center`}>
          <Link href={`/profile/${student?.username}`} className="flex items-center gap-1">
            @{student.username}
            <ExternalLink className="w-3 h-3" />
          </Link>
        </p>

        {/* City */}
        <p className="text-[10px] text-muted-foreground uppercase mt-1">
          {student.city_name || "PW IOI"}
        </p>

        {/* Score */}
        <div className={`mt-2 rounded-2xl border border-border  py-2 ${bgColor}`}>
          <p className="text-[10px] text-muted-foreground">Score</p>
          <p className={`text-sm font-bold ${textColor}`}>
            {student.score}
          </p>
        </div>
      </div>
    </div>
  );
};