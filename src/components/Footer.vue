<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Bản đồ chỉ dẫn -->
      <div class="footer-section">
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
      <div class="footer-section">
        <h3>MẠNG XÃ HỘI</h3>
        <div class="social-icons">
          <a v-for="icon in socialIcons" :key="icon.name" :href="icon.link" target="_blank">
            <img :src="icon.src" :alt="icon.name" class="icon" />
          </a>
        </div>
      </div>

      <!-- Đơn vị trực thuộc -->
      <div class="footer-section">
        <h3>ĐƠN VỊ TRỰC THUỘC</h3>
        <p>BAN CHUYÊN MÔN</p>
        <p>LIÊN CHI ĐOÀN - LIÊN CHI HỘI</p>
      </div>

      <!-- Đoàn TNCS -->
      <div class="footer-section">
        <h3>ĐOÀN TNCS HỒ CHÍ MINH ĐẠI HỌC MỎ ĐỊA CHẤT HÀ NỘI</h3>
        <p>📍 Văn phòng Đoàn Thanh niên Đại học Mỏ Địa Chất</p>
        <p>P205 - Nhà C, Số 58, Lê Văn Hiến, Đức Thắng, Quận Bắc Từ Liêm, Hà Nội.</p>
        <p>✉️ <a href="mailto:doanthanhnien@humg.edu.vn" class="email">doanthanhnien@humg.edu.vn</a></p>
      </div>
    </div>
    <div class="footer-bottom">
      Copyright © 2024 Hanoi University of Mining and Geology.
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      socialIcons: [
        { name: "Facebook", src: "facebook-icon.png", link: "#" },
        { name: "Twitter", src: "twitter-icon.png", link: "#" },
        { name: "LinkedIn", src: "linkedin-icon.png", link: "#" },
        { name: "Instagram", src: "instagram-icon.png", link: "#" },
      ],
    };
  },
};
</script>

<style scoped>
.footer {
  background-color: #2196f3;
  color: white;
  padding: 20px 0;
  text-align: center;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: start;
  padding: 10px 20px;
}

.footer-section {
  width: 22%;
  text-align: left;
}

.footer-section h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.map-frame {
  width: 100%;
  height: 200px;
  border: none;
  border-radius: 8px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s;
}

.icon:hover {
  transform: scale(1.2);
}

.email {
  color: white;
  text-decoration: underline;
}

.footer-bottom {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid white;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
  }
  .footer-section {
    width: 90%;
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
