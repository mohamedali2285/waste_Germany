import { useState, useEffect } from 'react';
import { useCurrentDate } from './useCurrentDate';
import { storage } from '@/utils/storage';
import { getScheduleByPostcode, getDefaultSchedule, getNextCollectionDate, LocationSchedule } from '@/utils/garbageSchedules';

export interface WasteCollection {
  id: string;
  name: string;
  color: string;
  nextDate: string;
  dayOfMonth: number;
  enabled: boolean;
  actualDate: Date;
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
  const [currentSchedule, setCurrentSchedule] = useState<LocationSchedule>(getDefaultSchedule());
  const [userAddress, setUserAddress] = useState({
    street: 'Grabenstraße',
    houseNumber: '15',
    postcode: '89522',
    city: 'Heidenheim an der Brenz',
  });

  useEffect(() => {
    loadNotifications();
    loadAddress();
  }, []);

  useEffect(() => {
    // Update schedule when address changes
    updateScheduleForLocation(userAddress.postcode);
  }, [userAddress.postcode]);

  const loadNotifications = async () => {
    const saved = await storage.getNotifications();
    if (saved) {
      setNotifications(saved);
    }
  };

  const loadAddress = async () => {
    const saved = await storage.getAddress();
    if (saved) {
      setUserAddress(saved);
    }
  };

  const updateScheduleForLocation = (postcode: string) => {
    const schedule = getScheduleByPostcode(postcode);
    if (schedule) {
      setCurrentSchedule(schedule);
    } else {
      // Use default schedule if postcode not found
      setCurrentSchedule(getDefaultSchedule());
    }
  };

  const updateAddressAndSchedule = async (newAddress: any) => {
    setUserAddress(newAddress);
    await storage.saveAddress(newAddress);
    updateScheduleForLocation(newAddress.postcode);
  };

  // Generate waste collections based on current schedule
  const generateWasteCollections = (): WasteCollection[] => {
    const collections: WasteCollection[] = [];

    // Restmüll
    const restmuellDate = getNextCollectionDate('restmuell', currentSchedule, currentDate);
    collections.push({
      id: 'restmuell',
      name: 'Restmüll',
      color: currentSchedule.wasteTypes.restmuell.color,
      nextDate: restmuellDate.toLocaleDateString('de-DE', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short' 
      }),
      dayOfMonth: restmuellDate.getDate(),
      enabled: notifications.restmuell,
      actualDate: restmuellDate,
    });

    // Biomüll
    const biomuellDate = getNextCollectionDate('biomuell', currentSchedule, currentDate);
    collections.push({
      id: 'biomuell',
      name: 'Biomüll',
      color: currentSchedule.wasteTypes.biomuell.color,
      nextDate: biomuellDate.toLocaleDateString('de-DE', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short' 
      }),
      dayOfMonth: biomuellDate.getDate(),
      enabled: notifications.biomuell,
      actualDate: biomuellDate,
    });

    // Papier
    const papierDate = getNextCollectionDate('papier', currentSchedule, currentDate);
    collections.push({
      id: 'papier',
      name: 'Papier',
      color: currentSchedule.wasteTypes.papier.color,
      nextDate: papierDate.toLocaleDateString('de-DE', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short' 
      }),
      dayOfMonth: papierDate.getDate(),
      enabled: notifications.papier,
      actualDate: papierDate,
    });

    // Gelber Sack
    const gelberSackDate = getNextCollectionDate('gelberSack', currentSchedule, currentDate);
    collections.push({
      id: 'gelberSack',
      name: 'Gelber Sack',
      color: currentSchedule.wasteTypes.gelberSack.color,
      nextDate: gelberSackDate.toLocaleDateString('de-DE', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short' 
      }),
      dayOfMonth: gelberSackDate.getDate(),
      enabled: notifications.gelberSack,
      actualDate: gelberSackDate,
    });

    // Altglas (always available)
    if (currentSchedule.wasteTypes.altglas.available) {
      collections.push({
        id: 'altglas',
        name: 'Altglas',
        color: currentSchedule.wasteTypes.altglas.color,
        nextDate: 'Immer verfügbar',
        dayOfMonth: 0,
        enabled: notifications.altglas,
        actualDate: new Date(),
      });
    }

    return collections;
  };

  const wasteTypes = generateWasteCollections();
  
  // For upcoming collections, only show enabled ones
  const upcomingCollections = wasteTypes
    .filter(waste => waste.enabled && waste.dayOfMonth > 0)
    .map(waste => ({
      type: waste.name,
      date: waste.actualDate.toLocaleDateString('de-DE', { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long' 
      }),
      time: '07:00',
      color: waste.color,
    }))
    .sort((a, b) => {
      const dateA = wasteTypes.find(w => w.name === a.type)?.actualDate || new Date();
      const dateB = wasteTypes.find(w => w.name === b.type)?.actualDate || new Date();
      return dateA.getTime() - dateB.getTime();
    });

  // For calendar, only show enabled waste types
  const calendarWasteTypes = wasteTypes
    .filter(waste => waste.enabled && waste.dayOfMonth > 0)
    .reduce((acc, waste) => {
      acc[waste.dayOfMonth] = { type: waste.name, color: waste.color };
      return acc;
    }, {} as { [key: number]: { type: string; color: string } });

  return {
    wasteTypes, // All waste types (for display)
    upcomingCollections, // Only enabled ones
    calendarWasteTypes, // Only enabled ones for calendar
    notifications,
    setNotifications,
    currentSchedule,
    userAddress,
    updateAddressAndSchedule,
  };
}