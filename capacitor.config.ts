import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.labcollection.app',
  appName: 'Lab Collection',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    url: 'https://demo.sukrahod.com',
    cleartext: true
  }
};

export default config;
