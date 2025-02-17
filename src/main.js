import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Thêm icon vào thư viện
library.add(faFacebook, faTwitter, faLinkedin, faInstagram);

const app = createApp(App);

app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon); // Đăng ký FontAwesomeIcon làm component toàn cục

app.mount('#app');
