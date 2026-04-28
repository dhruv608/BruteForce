"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RecentQuestionsContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const RecentQuestionsContext = createContext<RecentQuestionsContextType | undefined>(undefined);

export function RecentQuestionsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default to today's date in YYYY-MM-DD format
  const today = new Date();
  const todayStr = today.getFullYear() + '-' + 
    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
    String(today.getDate()).padStart(2, '0');
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <RecentQuestionsContext.Provider value={{ isOpen, setIsOpen, toggleSidebar, selectedDate, setSelectedDate }}>
      {children}
    </RecentQuestionsContext.Provider>
  );
}

export function useRecentQuestions() {
  const context = useContext(RecentQuestionsContext);
  if (context === undefined) {
    throw new Error('useRecentQuestions must be used within a RecentQuestionsProvider');
  }
  return context;
}
