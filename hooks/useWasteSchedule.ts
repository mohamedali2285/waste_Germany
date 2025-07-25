import { useState, useEffect } from 'react';
import { useCurrentDate } from './useCurrentDate';

export interface WasteCollection {
  id: string;
  name: string;
  color: string;
  nextDate: string;
  dayOfMonth: number;
  enabled: boolean;
}

export function useWasteSchedule() {
  const { currentDate, currentMonth, currentYear } = useCurrentDate();
  const [notifications, setNotifications] = useState({
    restmuell: true,
    biomuell: true,
    papier: false,
    gelberSack: true,
    altglas: false,
  });

  // Calculate next collection dates based on current date
  const getNextCollectionDate = (baseDay: number, wasteType: string) => {
    const today = currentDate.getDate();
    const currentMonthDate = new Date(currentYear, currentMonth - 1, baseDay);
    
    // If the collection day has passed this month, show next month
    if (baseDay < today) {
      const nextMonth = new Date(currentYear, currentMonth, baseDay);
      return {
        date: nextMonth,
        dayOfMonth: baseDay,
        formattedDate: nextMonth.toLocaleDateString('de-DE', { 
          weekday: 'short', 
          day: '2-digit', 
          month: 'short' 
        })
      };
    } else {
      return {
        date: currentMonthDate,
        dayOfMonth: baseDay,
        formattedDate: currentMonthDate.toLocaleDateString('de-DE', { 
          weekday: 'short', 
          day: '2-digit', 
          month: 'short' 
        })
      };
    }
  };

  const wasteTypes: WasteCollection[] = [
    {
      id: 'restmuell',
      name: 'Restmüll',
      color: '#2F4F4F',
      ...getNextCollectionDate(27, 'restmuell'),
      enabled: notifications.restmuell,
    },
    {
      id: 'biomuell',
      name: 'Biomüll',
      color: '#8FBC8F',
      ...getNextCollectionDate(28, 'biomuell'),
      enabled: notifications.biomuell,
    },
    {
      id: 'papier',
      name: 'Papier',
      color: '#4169E1',
      ...getNextCollectionDate(30, 'papier'),
      enabled: notifications.papier,
    },
    {
      id: 'gelberSack',
      name: 'Gelber Sack',
      color: '#FFD700',
      ...getNextCollectionDate(31, 'gelberSack'),
      enabled: notifications.gelberSack,
    },
    {
      id: 'altglas',
      name: 'Altglas',
      color: '#90EE90',
      nextDate: 'Immer verfügbar',
      dayOfMonth: 0,
      formattedDate: 'Immer verfügbar',
      enabled: notifications.altglas,
    },
  ].map(waste => ({
    ...waste,
    nextDate: waste.formattedDate
  }));

  const enabledWasteTypes = wasteTypes.filter(waste => waste.enabled);
  
  const upcomingCollections = enabledWasteTypes
    .filter(waste => waste.dayOfMonth > 0)
    .map(waste => ({
      type: waste.name,
      date: new Date(currentYear, currentMonth - 1, waste.dayOfMonth).toLocaleDateString('de-DE', { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long' 
      }),
      time: '07:00',
      color: waste.color,
    }));

  return {
    wasteTypes: enabledWasteTypes,
    upcomingCollections,
    notifications,
    setNotifications,
  };
}