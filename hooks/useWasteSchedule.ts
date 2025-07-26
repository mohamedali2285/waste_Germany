import { useState, useEffect } from 'react';
import { useCurrentDate } from './useCurrentDate';
import { storage } from '@/utils/storage';

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
    papier: true,
    gelberSack: true,
    altglas: true,
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const saved = await storage.getNotifications();
    if (saved) {
      setNotifications(saved);
    }
  };

  // Calculate next collection date based on current date
  const getNextCollectionDate = (baseDay: number) => {
    const today = currentDate.getDate();
    let targetDate: Date;
    
    if (baseDay >= today) {
      // Collection day hasn't passed this month
      targetDate = new Date(currentYear, currentMonth - 1, baseDay);
    } else {
      // Collection day has passed, show next month
      targetDate = new Date(currentYear, currentMonth, baseDay);
    }
    
    return {
      date: targetDate,
      dayOfMonth: baseDay,
      formattedDate: targetDate.toLocaleDateString('de-DE', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short' 
      })
    };
  };

  const wasteTypes: WasteCollection[] = [
    {
      id: 'restmuell',
      name: 'Restmüll',
      color: '#2F4F4F',
      ...getNextCollectionDate(27),
      enabled: notifications.restmuell,
    },
    {
      id: 'biomuell',
      name: 'Biomüll',
      color: '#8FBC8F',
      ...getNextCollectionDate(28),
      enabled: notifications.biomuell,
    },
    {
      id: 'papier',
      name: 'Papier',
      color: '#4169E1',
      ...getNextCollectionDate(30),
      enabled: notifications.papier,
    },
    {
      id: 'gelberSack',
      name: 'Gelber Sack',
      color: '#FFD700',
      ...getNextCollectionDate(31),
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
    .map(waste => {
      const collectionDate = waste.dayOfMonth >= currentDate.getDate() 
        ? new Date(currentYear, currentMonth - 1, waste.dayOfMonth)
        : new Date(currentYear, currentMonth, waste.dayOfMonth);
      
      return {
        type: waste.name,
        date: collectionDate.toLocaleDateString('de-DE', { 
          weekday: 'long', 
          day: '2-digit', 
          month: 'long' 
        }),
        time: '07:00',
        color: waste.color,
      };
    })
    .sort((a, b) => {
      // Sort by actual date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  return {
    wasteTypes: enabledWasteTypes,
    upcomingCollections,
    notifications,
    setNotifications,
  };
}