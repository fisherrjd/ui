// the app's resolved theme, served by the ui() vite plugin (vite.js)
declare module 'virtual:fisherrjd-ui' {
  const theme: import('./theme/derive').Theme
  export default theme
}
