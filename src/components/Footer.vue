<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Bản đồ chỉ dẫn -->
      <div class="footer-section map-section">
        <h3>BẢN ĐỒ CHỈ DẪN</h3>
        <iframe
          class="map-frame"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.5087125824525!2d105.76550507540622!3d21.053087885956456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313503c113fbdc6b%3A0x8fdeb466946a1663!2zMTggUC4gVmnhu4duLCDEkOG7k25nIE5nYWMsIELhuq9jIFThu5ljIFThu6sgTOG7pW0sIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1708428885000!5m2!1svi!2s"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <!-- Mạng xã hội -->
      <div class="footer-section social-section">
        <h3>MẠNG XÃ HỘI</h3>
        <div class="social-icons">
          <a v-for="icon in socialIcons" :key="icon.name" :href="icon.link" target="_blank" class="social-link">
            <i :class="icon.iconClass"></i>
            <span>{{ icon.name }}</span>
          </a>
        </div>
      </div>

      <!-- Đơn vị trực thuộc -->
      <div class="footer-section units-section">
        <h3>ĐƠN VỊ TRỰC THUỘC</h3>
        <ul class="units-list">
          <li>Ban Tổ chức</li>
          <li>Ban Kiểm tra</li>
          <li>Ban Tuyên giáo</li>
          <li>Ban Phong trào</li>
          <li>Văn phòng Đoàn trường</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 Đoàn Thanh niên - Trường Đại học Mỏ - Địa chất. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
const socialIcons = [
  { name: 'Facebook', link: 'https://facebook.com', iconClass: 'fab fa-facebook' },
  { name: 'Youtube', link: 'https://youtube.com', iconClass: 'fab fa-youtube' },
  { name: 'Instagram', link: 'https://instagram.com', iconClass: 'fab fa-instagram' },
  { name: 'Twitter', link: 'https://twitter.com', iconClass: 'fab fa-twitter' }
];
</script>

<style scoped>
.footer {
  background-color: #2d3b8d;
  color: #ffffff;
  padding: 40px 0 0;
  font-family: 'Segoe UI', sans-serif;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  padding: 0 20px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-section h3 {
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 2px;
  background-color: #ff9800;
}

/* Map Section */
.map-section .map-frame {
  width: 100%;
  height: 200px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Social Section */
.social-icons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  color: #ffffff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 5px;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.1);
}

.social-link:hover {
  background-color: #ff9800;
  transform: translateY(-2px);
}

.social-link i {
  margin-right: 10px;
  font-size: 1.2rem;
}

/* Units Section */
.units-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.units-list li {
  margin-bottom: 12px;
  padding-left: 20px;
  position: relative;
}

.units-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #ff9800;
}

/* Footer Bottom */
.footer-bottom {
  margin-top: 40px;
  padding: 20px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
}

.footer-bottom p {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
  }

  .footer-section {
    align-items: center;
    text-align: center;
  }

  .footer-section h3::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .social-icons {
    justify-content: center;
  }

  .units-list {
    text-align: left;
  }
}
</style>
