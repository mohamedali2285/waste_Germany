import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredSettings {
  language: string;
  notificationTime: string;
  notifications: {
    restmuell: boolean;
    biomuell: boolean;
    papier: boolean;
    gelberSack: boolean;
    altglas: boolean;
  };
  address: {
    street: string;
    houseNumber: string;
    postcode: string;
    city: string;
  };
}

const STORAGE_KEYS = {
  SETTINGS: '@wastewise_settings',
  ADDRESS: '@wastewise_address',
  NOTIFICATIONS: '@wastewise_notifications',
};

export const storage = {
  async getSettings(): Promise<Partial<StoredSettings>> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error loading settings:', error);
      return {};
    }
  },

  async saveSettings(settings: Partial<StoredSettings>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  async getAddress() {
    try {
      const address = await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS);
      return address ? JSON.parse(address) : null;
    } catch (error) {
      console.error('Error loading address:', error);
      return null;
    }
  },

  async saveAddress(address: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ADDRESS, JSON.stringify(address));
    } catch (error) {
      console.error('Error saving address:', error);
    }
  },

  async getNotifications() {
    try {
      const notifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return notifications ? JSON.parse(notifications) : null;
    } catch (error) {
      console.error('Error loading notifications:', error);
      return null;
    }
  },

  async saveNotifications(notifications: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  },
};