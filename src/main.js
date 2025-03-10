import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router'; 
import { createPinia } from 'pinia';
import GlobalDialog from './components/GlobalDialog.vue'; 


const app = createApp(App);
app.use(router); 
app.mount('#app');


const pinia = createPinia();
app.use(pinia);

// Mount dialog vào #global-dialog
const dialogApp = createApp(GlobalDialog);
dialogApp.mount("#global-dialog");