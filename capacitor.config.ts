import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.labcollection.app',
  appName: 'Lab Collection',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    url: 'http://192.168.18.174:3000', // REPLACE THIS with your computer's IP (e.g. 192.168.1.5:3000) or production URL
    cleartext: true
  }
};

export default config;
