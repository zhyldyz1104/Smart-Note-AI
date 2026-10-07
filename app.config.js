import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  
  extra: {
    ...config.extra,
    EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    // Add this EAS object here:
    eas: {
      projectId: "b3a0f2ef-92fe-446a-ad18-b0516a46bcc8"
    }
  },
  
  scheme: "smartnotes",
  
  android: {
    ...config.android,
    package: "com.smartnotes.app",
    googleServicesFile: "./google-services.json"
  },
  
  plugins: [
    "@react-native-firebase/app",
    "@react-native-firebase/app-check",
    "expo-router"
  ]
});