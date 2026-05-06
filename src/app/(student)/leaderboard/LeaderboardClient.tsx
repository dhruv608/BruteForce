"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { studentLeaderboardService } from "@/services/student/leaderboard.service";
import { studentAuthService } from "@/services/student/auth.service";
import { EvaluationModal } from "@/components/student/leaderboard/EvaluationModal";
import { LeaderboardTable } from "@/components/student/leaderboard/LeaderboardTable";
import { TimerLeaderboard } from "@/components/student/leaderboard/TimerLeaderboard";
import { YourRank } from "@/components/student/leaderboard/YourRank";
import { isStudentToken, clearAuthTokens } from "@/lib/auth-utils";
import PodiumSection from "@/components/student/leaderboard/PodiumSection";
import MobilePodiumSection from "@/components/student/leaderboard/MobilePodiumSection";
import { LeaderboardHeader } from "@/components/student/leaderboard/LeaderboardHeader";
import { LeaderboardCity, LeaderboardData } from '@/types/student/index.types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export default function LeaderboardClient() {
  const [lCity, setLCity] = useState<LeaderboardCity['city_name']>('All Cities');
  const [lYear, setLYear] = useState<number | null>(null);
  const [lSearch, setLSearch] = useState('');
  const debouncedSearch = useDebouncedValue(lSearch, 500);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Get current student data to set default city and year
  const { data: studentData } = useQuery({
    queryKey: ['currentStudent'],
    queryFn: async () => {
      const response = await studentAuthService.getCurrentStudent();
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false
  });

  // Extract available years from API response
  const { data: leaderboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['studentLeaderboard', lCity === 'all' ? 'all' : lCity, lYear, debouncedSearch],
    queryFn: async () => {
      // Check if we have a student token before making the request
      if (!isStudentToken()) {
        clearAuthTokens(); // Clear invalid tokens
        const error = new Error('Access denied. Students only.');
        (error as { response?: { status: number; data?: { error: string } } }).response = { status: 403, data: { error: 'Access denied. Students only.' } };
        throw error;
      }

      // Don't make request if we don't have a valid year yet
      if (!lYear) {
        return null;
      }

      const filters = {
        city: lCity === 'All Cities' ? 'all' : lCity,
        year: lYear,
      };

      return await studentLeaderboardService.getLeaderboard(filters, debouncedSearch);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!lYear, // Only run query when we have a valid year

    // 🔥 ADD THESE
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Compute year options similar to admin leaderboard
  const yearOptions = useMemo(() => {
    if (!leaderboardData?.available_cities) return [];
    if (lCity === 'all' || lCity === 'All Cities') {
      const allCitiesEntry = leaderboardData.available_cities.find(
        (city: LeaderboardCity) => city.city_name === "All Cities"
      );
      return allCitiesEntry?.available_years || [];
    }
    const cityData = leaderboardData.available_cities.find(
      (city: LeaderboardCity) => city.city_name === lCity
    );
    return cityData?.available_years || [];
  }, [leaderboardData?.available_cities, lCity]);

  // Set default city and year based on logged-in student
  useEffect(() => {
    if (studentData) {
      const student = studentData;
      const batchYear = student.batch?.year;
      setLCity(student.city?.city_name || 'all');
      setLYear(batchYear || null); // Use null instead of hardcoded fallback
      setIsInitialLoading(false); // Stop initial loading once year is set
    }
  }, [studentData]);

  // Reset year when city changes (similar to admin)
  useEffect(() => {
    if (yearOptions.length > 0 && !yearOptions.includes(lYear)) {
      setLYear(yearOptions[0]);
    }
  }, [lCity, yearOptions, lYear]);

  const data = leaderboardData;
  const combinedLoading = isLoading || isInitialLoading;
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <>

      <YourRank yourRank={data?.yourRank} />
      <div className="max-w-375 xl:max-w-275 2xl:max-w-375  mx-auto px-8 py-2">

        <LeaderboardHeader
          lCity={lCity}
          lYear={lYear}
          lastUpdated={data?.last_calculated}
          lSearch={lSearch}
          setLSearch={setLSearch}
          setLCity={setLCity}
          setLYear={setLYear}
          cityOptionsObj={[
            ...(isLoading ? [
              { value: 'loading', label: 'Loading...' }
            ] : []),
            ...(data?.available_cities?.map((city: LeaderboardCity) => ({
              value: city.city_name,
              label: city.city_name
            })) || [])
          ]}
          yearOptionsObj={[
            ...(isLoading ? [] : yearOptions.map((y: number) => ({
              value: y.toString(),
              label: y.toString()
            })))
          ]}
          allYears={isLoading ? [] : yearOptions}
          isLoading={combinedLoading}
        />
        {/* Mobile Podium - Vertical Layout */}
        <div className="md:hidden">
          <MobilePodiumSection
            top3={data?.top10?.slice(0, 3) || []}
            loading={combinedLoading}
            error={error?.message}
            selectedCity={lCity === 'All Cities' ? 'all' : lCity}
          />
        </div>

        {/* Desktop Podium - Horizontal Layout */}
        <div className="hidden md:block">
          <PodiumSection
            top3={data?.top10?.slice(0, 3) || []}
            loading={combinedLoading}
            error={error?.message}
            selectedCity={lCity === 'All Cities' ? 'all' : lCity}
          />
        </div>
        <div className="flex flex-col space-y-6">

          <LeaderboardTable
            data={{ leaderboard: data?.top10 || [], total: data?.top10?.length || 0 }}
            loading={combinedLoading}
            error={error?.message}
            selectedCity={lCity === 'All Cities' ? 'all' : lCity}
            page={1}
            limit={10}
            setPage={() => { }}
            setLimit={() => { }}
            mode="student"
          />
        </div>
      </div>
    </>
  );
}