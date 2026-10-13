import 'dotenv/config';
export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    eas: {
      projectId: "5110dfae-dd2a-4fe3-b490-d84fa94d2fcb"
    },
  },

  scheme: "smartnote",

  android: {
    ...config.android,
    package: "com.smartnoteai.app",
    googleServicesFile: './google-services.json'
  },

  plugins: [
    "expo-router"
  ]
});
