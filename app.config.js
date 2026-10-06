import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    EXPO_PUBLIC_GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
});
