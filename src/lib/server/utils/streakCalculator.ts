/**
 * Streak Calculation Utility
 * Calculates current streak and max streak based on student progress dates
 */

import { StreakResult, QuestionAvailability } from '@/lib/server/types/utility.types';

/**
 * Calculate streak based on daily problem solving activity
 * A streak is maintained if student solves at least one problem per day
 */
export function calculateStreak(syncDates: Date[]): StreakResult {
  if (syncDates.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Sort dates in descending order (newest first)
  const sortedDates = syncDates.sort((a, b) => b.getTime() - a.getTime());
  
  // Convert to date strings (YYYY-MM-DD) to compare days
  const dateStrings = sortedDates.map(date => 
    date.toISOString().split('T')[0]
  );
  
  // Remove duplicates (same day multiple submissions)
  const uniqueDates = [...new Set(dateStrings)];
  
  // Calculate current streak
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  
  const today = new Date().toISOString().split('T')[0];
  let expectedDate = new Date(today);
  
  // Check current streak from today backwards
  for (const dateStr of uniqueDates) {
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (dateStr === expectedDateStr) {
      currentStreak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (dateStr < expectedDateStr) {
      // Break the streak if there's a gap
      break;
    }
  }
  
  // Calculate max streak by going through all dates
  let previousDate: Date | null = null;
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i]);
    
    if (previousDate === null) {
      // Start new streak
      tempStreak = 1;
    } else {
      const daysDiff = Math.floor((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - continue streak
        tempStreak++;
      } else {
        // Break in streak - reset and start new streak
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    previousDate = currentDate;
  }
  
  // Final check for max streak
  maxStreak = Math.max(maxStreak, tempStreak);
  
  return {
    currentStreak,
    maxStreak
  };
}

/**
 * Calculate streak based on daily problem solving activity with freeze logic
 * A streak is maintained if:
 * 1. Student solves at least one problem per day when questions are available
 * 2. Questions are not uploaded on a day (freeze day - streak is preserved)
 */
export function calculateStreakWithFreeze(syncDates: Date[], questionAvailability: QuestionAvailability[]): StreakResult {
  if (syncDates.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Sort dates in descending order (newest first)
  const sortedDates = syncDates.sort((a, b) => b.getTime() - a.getTime());
  
  // Convert to date strings (YYYY-MM-DD) to compare days
  const dateStrings = sortedDates.map(date => 
    date.toISOString().split('T')[0]
  );
  
  // Remove duplicates (same day multiple submissions)
  const uniqueDates = [...new Set(dateStrings)];
  
  // Create a map for quick question availability lookup
  const questionMap = new Map(questionAvailability.map(q => [q.date, q.hasQuestion]));
  
  // Calculate current streak
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  
  const today = new Date().toISOString().split('T')[0];
  let expectedDate = new Date(today);
  
  // Check current streak from today backwards
  for (const dateStr of uniqueDates) {
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (dateStr === expectedDateStr) {
      currentStreak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      // Check if there are any days without questions between expectedDate and dateStr
      let currentDate = new Date(expectedDate);
      currentDate.setDate(currentDate.getDate() - 1);
      
      let hasAllQuestions = true;
      while (currentDate.toISOString().split('T')[0] > dateStr) {
        const currentDateStr = currentDate.toISOString().split('T')[0];
        const hasQuestion = questionMap.get(currentDateStr) ?? true; // Assume questions available if not specified
        
        if (!hasQuestion) {
          // Skip freeze days
          currentDate.setDate(currentDate.getDate() - 1);
          continue;
        } else {
          // Found a day with questions but no activity - break streak
          hasAllQuestions = false;
          break;
        }
      }
      
      if (!hasAllQuestions) {
        break;
      }
      
      // If we get here, all intermediate days were freeze days, so continue streak
      currentStreak++;
      expectedDate.setDate(new Date(dateStr).getDate() - 1);
    }
  }
  
  // Calculate max streak by going through all dates
  let previousDate: Date | null = null;
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i]);
    
    if (previousDate === null) {
      // Start new streak
      tempStreak = 1;
    } else {
      const daysDiff = Math.floor((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - continue streak
        tempStreak++;
      } else if (daysDiff > 1) {
        // Check if all intermediate days were freeze days
        let hasAllQuestions = true;
        let checkDate = new Date(previousDate);
        checkDate.setDate(checkDate.getDate() - 1);
        
        while (checkDate > currentDate) {
          const checkDateStr = checkDate.toISOString().split('T')[0];
          const hasQuestion = questionMap.get(checkDateStr) ?? true;
          
          if (!hasQuestion) {
            // Freeze day - skip
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          } else {
            // Day with questions but no activity - break streak
            hasAllQuestions = false;
            break;
          }
        }
        
        if (hasAllQuestions) {
          // All intermediate days were freeze days - continue streak
          tempStreak++;
        } else {
          // Break in streak - reset and start new streak
          maxStreak = Math.max(maxStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    
    previousDate = currentDate;
  }
  
  // Final check for max streak
  maxStreak = Math.max(maxStreak, tempStreak);
  
  return {
    currentStreak,
    maxStreak
  };
}


/**
 * Calculate streak based on completion status
 * A streak is maintained if:
 * 1. Student solves at least one problem per day when they have pending questions
 * 2. Student completed all assigned questions (freeze day - streak is preserved)
 */
export function calculateStreakWithCompletionFreeze(
  activityDates: Date[], 
  studentId: number,
  hasCompletedAllQuestions: boolean
): StreakResult {
  if (activityDates.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Sort dates in descending order (newest first)
  const sortedDates = activityDates.sort((a, b) => b.getTime() - a.getTime());
  
  // Convert to date strings (YYYY-MM-DD) in local timezone to compare days
  const dateStrings = sortedDates.map(date => {
    const localDate = new Date(date);
    return localDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
  });
  
  // Remove duplicates (same day multiple submissions)
  const uniqueDates = [...new Set(dateStrings)];
  
  // Use local timezone for today
  const todayDate = new Date();
  const today = todayDate.toLocaleDateString('en-CA');
  
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toLocaleDateString('en-CA');

  const lastActivityDate = uniqueDates[0];

  // 1. Calculate the streak ending on the last activity date
  let lastActivityStreak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const curr = new Date(uniqueDates[i]);
    const prev = new Date(uniqueDates[i+1]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      lastActivityStreak++;
    } else {
      break;
    }
  }

  // 2. Determine current streak
  let currentStreak = 0;
  
  if (lastActivityDate === today || lastActivityDate === yesterday) {
    // Student was active today or yesterday, streak is alive
    currentStreak = lastActivityStreak;
  } else {
    // Gap exists between last activity and today (more than 1 day)
    if (hasCompletedAllQuestions) {
      // FREEZE: Student has no pending questions. Keep their streak alive.
      currentStreak = lastActivityStreak;
    } else {
      // BREAK: Student has pending questions but didn't practice.
      currentStreak = 0;
    }
  }

  // 3. Calculate max streak overall (just looking at consecutive activity days)
  let maxStreak = 0;
  let tempStreak = 1;
  
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const curr = new Date(uniqueDates[i]);
    const prev = new Date(uniqueDates[i+1]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
    } else {
      // Break in streak - update max and reset temp
      maxStreak = Math.max(maxStreak, tempStreak);
      tempStreak = 1;
    }
  }
  
  // Final check for max streak
  maxStreak = Math.max(maxStreak, tempStreak);
  
  // If currentStreak is somehow higher due to freeze, ensure maxStreak reflects it
  maxStreak = Math.max(maxStreak, currentStreak);

  return {
    currentStreak,
    maxStreak
  };
}
