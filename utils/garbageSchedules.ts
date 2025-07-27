// Location-based garbage collection schedules for German cities
export interface LocationSchedule {
  city: string;
  postcode: string;
  wasteTypes: {
    restmuell: { dayOfWeek: number; weeks: number[]; color: string };
    biomuell: { dayOfWeek: number; weeks: number[]; color: string };
    papier: { dayOfWeek: number; weeks: number[]; color: string };
    gelberSack: { dayOfWeek: number; weeks: number[]; color: string };
    altglas: { available: boolean; color: string };
  };
}

// Garbage collection schedules by location
export const garbageSchedules: { [key: string]: LocationSchedule } = {
  // Heidenheim an der Brenz - Core
  '89522': {
    city: 'Heidenheim an der Brenz',
    postcode: '89522',
    wasteTypes: {
      restmuell: { dayOfWeek: 2, weeks: [1, 3], color: '#2F4F4F' }, // Tuesday, every 2 weeks
      biomuell: { dayOfWeek: 4, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Thursday, weekly
      papier: { dayOfWeek: 1, weeks: [2, 4], color: '#4169E1' }, // Monday, every 2 weeks
      gelberSack: { dayOfWeek: 3, weeks: [1, 3], color: '#FFD700' }, // Wednesday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Heidenheim an der Brenz - Schnaitheim
  '89518': {
    city: 'Heidenheim an der Brenz (Schnaitheim)',
    postcode: '89518',
    wasteTypes: {
      restmuell: { dayOfWeek: 3, weeks: [2, 4], color: '#2F4F4F' }, // Wednesday, every 2 weeks
      biomuell: { dayOfWeek: 5, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Friday, weekly
      papier: { dayOfWeek: 2, weeks: [1, 3], color: '#4169E1' }, // Tuesday, every 2 weeks
      gelberSack: { dayOfWeek: 4, weeks: [2, 4], color: '#FFD700' }, // Thursday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Heidenheim an der Brenz - Mergelstetten
  '89520': {
    city: 'Heidenheim an der Brenz (Mergelstetten)',
    postcode: '89520',
    wasteTypes: {
      restmuell: { dayOfWeek: 1, weeks: [1, 3], color: '#2F4F4F' }, // Monday, every 2 weeks
      biomuell: { dayOfWeek: 3, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Wednesday, weekly
      papier: { dayOfWeek: 5, weeks: [2, 4], color: '#4169E1' }, // Friday, every 2 weeks
      gelberSack: { dayOfWeek: 2, weeks: [1, 3], color: '#FFD700' }, // Tuesday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Heidenheim an der Brenz - Oggenhausen
  '89523': {
    city: 'Heidenheim an der Brenz (Oggenhausen)',
    postcode: '89523',
    wasteTypes: {
      restmuell: { dayOfWeek: 4, weeks: [1, 3], color: '#2F4F4F' }, // Thursday, every 2 weeks
      biomuell: { dayOfWeek: 2, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Tuesday, weekly
      papier: { dayOfWeek: 1, weeks: [2, 4], color: '#4169E1' }, // Monday, every 2 weeks
      gelberSack: { dayOfWeek: 5, weeks: [1, 3], color: '#FFD700' }, // Friday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Heidenheim an der Brenz - Großkuchen
  '89551': {
    city: 'Heidenheim an der Brenz (Großkuchen)',
    postcode: '89551',
    wasteTypes: {
      restmuell: { dayOfWeek: 5, weeks: [2, 4], color: '#2F4F4F' }, // Friday, every 2 weeks
      biomuell: { dayOfWeek: 1, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Monday, weekly
      papier: { dayOfWeek: 3, weeks: [1, 3], color: '#4169E1' }, // Wednesday, every 2 weeks
      gelberSack: { dayOfWeek: 4, weeks: [2, 4], color: '#FFD700' }, // Thursday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Nattheim
  '89564': {
    city: 'Nattheim',
    postcode: '89564',
    wasteTypes: {
      restmuell: { dayOfWeek: 3, weeks: [1, 3], color: '#2F4F4F' }, // Wednesday, every 2 weeks
      biomuell: { dayOfWeek: 1, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Monday, weekly
      papier: { dayOfWeek: 5, weeks: [2, 4], color: '#4169E1' }, // Friday, every 2 weeks
      gelberSack: { dayOfWeek: 2, weeks: [1, 3], color: '#FFD700' }, // Tuesday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Fleinheim
  '89542': {
    city: 'Fleinheim',
    postcode: '89542',
    wasteTypes: {
      restmuell: { dayOfWeek: 4, weeks: [2, 4], color: '#2F4F4F' }, // Thursday, every 2 weeks
      biomuell: { dayOfWeek: 1, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Monday, weekly
      papier: { dayOfWeek: 3, weeks: [1, 3], color: '#4169E1' }, // Wednesday, every 2 weeks
      gelberSack: { dayOfWeek: 5, weeks: [2, 4], color: '#FFD700' }, // Friday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Stuttgart
  '70173': {
    city: 'Stuttgart',
    postcode: '70173',
    wasteTypes: {
      restmuell: { dayOfWeek: 1, weeks: [1, 2, 3, 4], color: '#2F4F4F' }, // Monday, weekly
      biomuell: { dayOfWeek: 3, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Wednesday, weekly
      papier: { dayOfWeek: 5, weeks: [2, 4], color: '#4169E1' }, // Friday, every 2 weeks
      gelberSack: { dayOfWeek: 2, weeks: [1, 3], color: '#FFD700' }, // Tuesday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Munich
  '80331': {
    city: 'München',
    postcode: '80331',
    wasteTypes: {
      restmuell: { dayOfWeek: 4, weeks: [1, 2, 3, 4], color: '#2F4F4F' }, // Thursday, weekly
      biomuell: { dayOfWeek: 2, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Tuesday, weekly
      papier: { dayOfWeek: 1, weeks: [1, 3], color: '#4169E1' }, // Monday, every 2 weeks
      gelberSack: { dayOfWeek: 5, weeks: [2, 4], color: '#FFD700' }, // Friday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Berlin
  '10115': {
    city: 'Berlin',
    postcode: '10115',
    wasteTypes: {
      restmuell: { dayOfWeek: 3, weeks: [1, 2, 3, 4], color: '#2F4F4F' }, // Wednesday, weekly
      biomuell: { dayOfWeek: 1, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Monday, weekly
      papier: { dayOfWeek: 4, weeks: [1, 3], color: '#4169E1' }, // Thursday, every 2 weeks
      gelberSack: { dayOfWeek: 2, weeks: [2, 4], color: '#FFD700' }, // Tuesday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Hamburg
  '20095': {
    city: 'Hamburg',
    postcode: '20095',
    wasteTypes: {
      restmuell: { dayOfWeek: 5, weeks: [1, 2, 3, 4], color: '#2F4F4F' }, // Friday, weekly
      biomuell: { dayOfWeek: 2, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Tuesday, weekly
      papier: { dayOfWeek: 3, weeks: [2, 4], color: '#4169E1' }, // Wednesday, every 2 weeks
      gelberSack: { dayOfWeek: 1, weeks: [1, 3], color: '#FFD700' }, // Monday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  }
};

// Get next collection date for a specific waste type
export function getNextCollectionDate(
  wasteType: 'restmuell' | 'biomuell' | 'papier' | 'gelberSack',
  schedule: LocationSchedule,
  currentDate: Date = new Date()
): Date {
  const wasteConfig = schedule.wasteTypes[wasteType];
  const targetDayOfWeek = wasteConfig.dayOfWeek; // 1 = Monday, 2 = Tuesday, etc.
  const collectionWeeks = wasteConfig.weeks;
  
  // Find next occurrence
  let nextDate = new Date(currentDate);
  let found = false;
  let attempts = 0;
  
  while (!found && attempts < 60) { // Max 60 days ahead
    const dayOfWeek = nextDate.getDay() === 0 ? 7 : nextDate.getDay(); // Convert Sunday from 0 to 7
    const weekOfMonth = Math.ceil(nextDate.getDate() / 7);
    
    if (dayOfWeek === targetDayOfWeek && collectionWeeks.includes(weekOfMonth)) {
      if (nextDate.getTime() >= currentDate.getTime()) { // Ensure it's today or in the future
        found = true;
      }
    }
    
    if (!found) {
      nextDate.setDate(nextDate.getDate() + 1);
      attempts++;
    }
  }
  
  return nextDate;
}

// Get all collection dates for a specific waste type within a given year
export function getCollectionDatesForYear(
  wasteType: 'restmuell' | 'biomuell' | 'papier' | 'gelberSack',
  schedule: LocationSchedule,
  year: number
): Date[] {
  const wasteConfig = schedule.wasteTypes[wasteType];
  const targetDayOfWeek = wasteConfig.dayOfWeek;
  const collectionWeeks = wasteConfig.weeks;
  const dates: Date[] = [];

  let current = new Date(year, 0, 1); // Start from January 1st of the given year
  const end = new Date(year + 1, 0, 1); // End before January 1st of the next year

  while (current < end) {
    const dayOfWeek = current.getDay() === 0 ? 7 : current.getDay();
    const weekOfMonth = Math.ceil(current.getDate() / 7);

    if (dayOfWeek === targetDayOfWeek && collectionWeeks.includes(weekOfMonth)) {
      dates.push(new Date(current)); // Add a copy of the date
    }
    current.setDate(current.getDate() + 1); // Move to the next day
  }
  return dates;
}

// Get schedule by postcode
export function getScheduleByPostcode(postcode: string): LocationSchedule | null {
  return garbageSchedules[postcode] || null;
}

// Default schedule (Heidenheim)
export function getDefaultSchedule(): LocationSchedule {
  return garbageSchedules['89522'];
}
