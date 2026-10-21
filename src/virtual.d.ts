// the app's theme config, served by the ui() vite plugin (vite.js)
declare module 'virtual:fisherrjd-ui' {
  const config: {
    themes: string[]
    defaultTheme: string
    defaultMode: 'light' | 'dark'
    locked: boolean
    keys: { theme: string; mode: string }
  }
  export default config
}
