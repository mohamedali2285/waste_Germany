import { useState, useEffect } from 'react';

export interface CurrentDateInfo {
  currentDate: Date;
  currentDay: number;
  currentMonth: number; // 0-indexed (0 for January, 11 for December)
  currentYear: number;
  formattedDate: string;
  dayName: string;
  monthName: string;
}

export function useCurrentDate(): CurrentDateInfo {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  return {
    currentDate,
    currentDay: currentDate.getDate(),
    currentMonth: currentDate.getMonth(), // 0-indexed
    currentYear: currentDate.getFullYear(),
    formattedDate: currentDate.toLocaleDateString('de-DE'),
    dayName: dayNames[currentDate.getDay()],
    monthName: monthNames[currentDate.getMonth()],
  };
}
