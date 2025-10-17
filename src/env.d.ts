declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{'s'}, {'d'}, any>;
  export default component;
}
