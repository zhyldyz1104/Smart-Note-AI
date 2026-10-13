import 'dotenv/config';

export default ({ config }) => ({
  ...config,

  // Correct placement for EAS project ID
  eas: {
    projectId: "b3a0f2ef-92fe-446a-ad18-b0516a46bcc8"
  },

  extra: {
    ...config.extra,
    geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY
  },

  scheme: "smartnotes",

  android: {
    ...config.android,
    package: "com.smartnoteai.app",
    googleServicesFile: "./google-services.json"
  },

  plugins: [
    // ❌ Removed invalid Firebase plugin
    // "@react-native-firebase/app-check",

    // ✔ Valid Expo plugin
    "expo-router"
  ]
});
