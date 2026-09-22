function readString(name: keyof ImportMetaEnv, fallback: string): string {
  const value = import.meta.env[name]
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback
}

export const env = {
  appName: readString('VITE_APP_NAME', 'ZipTrip Todos'),
  apiBaseUrl: readString('VITE_API_BASE_URL', 'http://localhost:4000/api'),
} as const
