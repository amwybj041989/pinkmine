import { createApp } from 'vue';
import { createHead } from '@unhead/vue';
import App from '@/App.vue';
import router from '@/router';
import pinia from '@/stores';
import 'virtual:uno.css';
import '@/styles/app.less';
import '@/styles/var.less';
import { i18n } from '@/utils/i18n';

// import { createPinia } from 'pinia'
// const pinia = createPinia()
// Vant 桌面端适配
import '@vant/touch-emulator';

/* --------------------------------
Vant 中有个别组件是以函数的形式提供的，
包括 Toast，Dialog，Notify 和 ImagePreview 组件。
在使用函数组件时，unplugin-vue-components
无法自动引入对应的样式，因此需要手动引入样式。
------------------------------------- */
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';

const app = createApp(App);
const head = createHead();
import filter from '@/utils/filter.js';
for (let key in filter) {
  let item: any = filter[key];
  app.directive(key, (el: any, binding: any) => {
    item(el, binding);
  });
}
app.config.errorHandler = (err, vm, info) => {
  // 处理错误
  // `err` 是错误对象
  // `vm` 是发生错误的组件实例
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  console.error(err, info);
};
app.use(pinia);
app.use(head);
app.use(router);
app.use(i18n);
app.mount('#app');
