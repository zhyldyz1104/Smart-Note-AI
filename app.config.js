import 'dotenv/config';

export default ({ config }) => ({
  ...config,

  // Correct placement for EAS project ID
  eas: {
    projectId: "5110dfae-dd2a-4fe3-b490-d84fa94d2fcb"
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
