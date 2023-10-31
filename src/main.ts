import 'style/index.scss'
import App from './app.svelte'

const app = new App({
  target: document.getElementById('app')!,
})
export default app

// const test = new Test({
//   target: document.getElementById("app")!,
// });
// export default test;
