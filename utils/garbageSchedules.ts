// Location-based garbage collection schedules for German cities
export interface WasteTypeConfig {
  dayOfWeek?: number; // 1 = Monday, 7 = Sunday
  weeks?: number[];   // e.g., [1, 3] for 1st and 3rd weeks
  specificDates?: string[]; // YYYY-MM-DD format for exact dates
  color: string;
}

export interface LocationSchedule {
  city: string;
  postcode: string;
  wasteTypes: {
    restmuell: WasteTypeConfig;
    biomuell: WasteTypeConfig;
    papiertonne: WasteTypeConfig;
    altpapier: WasteTypeConfig;
    gelberSack: WasteTypeConfig;
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
      papiertonne: { dayOfWeek: 1, weeks: [2, 4], color: '#4169E1' }, // Monday, every 2 weeks (original papier)
      altpapier: { dayOfWeek: 5, weeks: [1, 3], color: '#87CEEB' }, // Friday, every 2 weeks (new placeholder)
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
      papiertonne: { dayOfWeek: 2, weeks: [1, 3], color: '#4169E1' }, // Tuesday, every 2 weeks (original papier)
      altpapier: { dayOfWeek: 5, weeks: [1, 3], color: '#87CEEB' }, // Friday, every 2 weeks (new placeholder)
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
      papiertonne: { dayOfWeek: 5, weeks: [2, 4], color: '#4169E1' }, // Friday, every 2 weeks (original papier)
      altpapier: { dayOfWeek: 5, weeks: [1, 3], color: '#87CEEB' }, // Friday, every 2 weeks (new placeholder)
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
      papiertonne: { dayOfWeek: 1, weeks: [2, 4], color: '#4169E1' }, // Monday, every 2 weeks (original papier)
      altpapier: { dayOfWeek: 5, weeks: [1, 3], color: '#87CEEB' }, // Friday, every 2 weeks (new placeholder)
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
      papiertonne: { dayOfWeek: 3, weeks: [1, 3], color: '#4169E1' }, // Wednesday, every 2 weeks (original papier)
      altpapier: { dayOfWeek: 5, weeks: [1, 3], color: '#87CEEB' }, // Friday, every 2 weeks (new placeholder)
      gelberSack: { dayOfWeek: 4, weeks: [2, 4], color: '#FFD700' }, // Thursday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Fleinheim / Nattheim (Updated for 2025 specific dates)
  '89564': {
    city: 'Fleinheim / Nattheim',
    postcode: '89564',
    wasteTypes: {
      restmuell: { 
        color: '#2F4F4F',
        specificDates: [
          '2025-01-02', '2025-01-10', '2025-01-23',
          '2025-02-06', '2025-02-20',
          '2025-03-06', '2025-03-20',
          '2025-04-03', '2025-04-17',
          '2025-05-02', '2025-05-15', '2025-05-30',
          '2025-06-13', '2025-06-26',
          '2025-07-10', '2025-07-24',
          '2025-08-07', '2025-08-21',
          '2025-09-04', '2025-09-18',
          '2025-10-02', '2025-10-16', '2025-10-30',
          '2025-11-13', '2025-11-27',
          '2025-12-11', '2025-12-24',
        ]
      },
      biomuell: { 
        color: '#8FBC8F',
        specificDates: [
          '2025-01-11', '2025-01-24',
          '2025-02-07', '2025-02-21',
          '2025-03-07', '2025-03-21',
          '2025-04-04', '2025-04-19',
          '2025-05-03', '2025-05-16', '2025-05-23', '2025-05-31',
          '2025-06-06', '2025-06-14', '2025-06-21', '2025-06-27',
          '2025-07-04', '2025-07-11', '2025-07-18', '2025-07-25',
          '2025-08-01', '2025-08-08', '2025-08-15', '2025-08-22', '2025-08-29',
          '2025-09-05', '2025-09-12', '2025-09-19',
          '2025-10-04', '2025-10-17', '2025-10-31',
          '2025-11-14', '2025-11-28',
          '2025-12-12', '2025-12-27',
        ]
      },
      gelberSack: { 
        color: '#FFD700',
        specificDates: [
          '2025-01-07', '2025-01-20',
          '2025-02-03', '2025-02-17',
          '2025-03-03', '2025-03-17', '2025-03-31',
          '2025-04-14', '2025-04-28',
          '2025-05-12', '2025-05-26',
          '2025-06-10', '2025-06-23',
          '2025-07-07', '2025-07-21',
          '2025-08-04', '2025-08-18',
          '2025-09-01', '2025-09-15', '2025-09-29',
          '2025-10-13', '2025-10-27',
          '2025-11-10', '2025-11-24',
          '2025-12-08', '2025-12-20',
        ]
      },
      papiertonne: { 
        color: '#4169E1',
        specificDates: [
          '2025-01-16',
          '2025-02-13',
          '2025-03-13',
          '2025-04-10',
          '2025-05-08',
          '2025-06-05',
          '2025-07-10',
          '2025-08-07',
          '2025-09-11',
          '2025-10-16',
          '2025-11-13',
          '2025-12-11',
        ]
      },
      altpapier: { 
        color: '#87CEEB',
        specificDates: [
          '2025-01-04',
          '2025-03-01',
          '2025-04-05',
          '2025-05-03',
          '2025-06-07',
          '2025-07-12',
          '2025-09-06',
          '2025-10-04',
          '2025-11-08',
          '2025-12-06',
        ]
      },
      altglas: { available: true, color: '#90EE90' }
    }
  },
  // Herbrechtingen (New entry with placeholder schedule)
  '89542': {
    city: 'Herbrechtingen',
    postcode: '89542',
    wasteTypes: {
      restmuell: { dayOfWeek: 2, weeks: [1, 3], color: '#2F4F4F' }, // Tuesday, every 2 weeks (placeholder)
      biomuell: { dayOfWeek: 4, weeks: [1, 2, 3, 4], color: '#8FBC8F' }, // Thursday, weekly (placeholder)
      papiertonne: { dayOfWeek: 1, weeks: [2, 4], color: '#4169E1' }, // Monday, every 2 weeks (placeholder, original papier)
      altpapier: { dayOfWeek: 5, weeks: [1, 3], color: '#87CEEB' }, // Friday, every 2 weeks (new placeholder)
      gelberSack: { dayOfWeek: 3, weeks: [1, 3], color: '#FFD700' }, // Wednesday, every 2 weeks (placeholder)
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
      papiertonne: { dayOfWeek: 5, weeks: [2, 4], color: '#4169E1' }, // Friday, every 2 weeks (original papier)
      altpapier: { dayOfWeek: 5, weeks: [1, 3], color: '#87CEEB' }, // Friday, every 2 weeks (new placeholder)
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
      papiertonne: { dayOfWeek: 1, weeks: [1, 3], color: '#4169E1' }, // Monday, every 2 weeks (original papier)
      altpapier: { dayOfWeek: 5, weeks: [1, 3], color: '#87CEEB' }, // Friday, every 2 weeks (new placeholder)
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
      papiertonne: { dayOfWeek: 4, weeks: [1, 3], color: '#4169E1' }, // Thursday, every 2 weeks (original papier)
      altpapier: { dayOfWeek: 5, weeks: [1, 3], color: '#87CEEB' }, // Friday, every 2 weeks (new placeholder)
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
      papiertonne: { dayOfWeek: 3, weeks: [2, 4], color: '#4169E1' }, // Wednesday, every 2 weeks (original papier)
      altpapier: { dayOfWeek: 5, weeks: [1, 3], color: '#87CEEB' }, // Friday, every 2 weeks (new placeholder)
      gelberSack: { dayOfWeek: 1, weeks: [1, 3], color: '#FFD700' }, // Monday, every 2 weeks
      altglas: { available: true, color: '#90EE90' }
    }
  }
};

// Helper to parse YYYY-MM-DD string to Date
function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // Month is 0-indexed
}

// Get next collection date for a specific waste type
export function getNextCollectionDate(
  wasteType: 'restmuell' | 'biomuell' | 'papiertonne' | 'altpapier' | 'gelberSack',
  schedule: LocationSchedule,
  currentDate: Date = new Date()
): Date {
  const wasteConfig = schedule.wasteTypes[wasteType];
  
  // 1. Prioritize specificDates if available
  if (wasteConfig.specificDates && wasteConfig.specificDates.length > 0) {
    const futureDates = wasteConfig.specificDates
      .map(parseDateString)
      .filter(date => date.getTime() >= currentDate.getTime())
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (futureDates.length > 0) {
      return futureDates[0];
    }
  }

  // 2. Fallback to dayOfWeek and weeks if specificDates are not available or exhausted
  if (wasteConfig.dayOfWeek !== undefined && wasteConfig.weeks !== undefined) {
    const targetDayOfWeek = wasteConfig.dayOfWeek; // 1 = Monday, 2 = Tuesday, etc.
    const collectionWeeks = wasteConfig.weeks;
    
    let nextDate = new Date(currentDate);
    let found = false;
    let attempts = 0;
    
    while (!found && attempts < 60) { // Max 60 days ahead to find a recurring date
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
  
  // If neither specificDates nor recurring schedule is defined, return current date as a fallback
  return new Date(currentDate);
}

// Get all collection dates for a specific waste type within a given year
export function getCollectionDatesForYear(
  wasteType: 'restmuell' | 'biomuell' | 'papiertonne' | 'altpapier' | 'gelberSack',
  schedule: LocationSchedule,
  year: number
): Date[] {
  const wasteConfig = schedule.wasteTypes[wasteType];
  const dates: Date[] = [];

  // 1. Prioritize specificDates if available
  if (wasteConfig.specificDates && wasteConfig.specificDates.length > 0) {
    return wasteConfig.specificDates
      .map(parseDateString)
      .filter(date => date.getFullYear() === year)
      .sort((a, b) => a.getTime() - b.getTime());
  }

  // 2. Fallback to dayOfWeek and weeks if specificDates are not available
  if (wasteConfig.dayOfWeek !== undefined && wasteConfig.weeks !== undefined) {
    const targetDayOfWeek = wasteConfig.dayOfWeek;
    const collectionWeeks = wasteConfig.weeks;

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
