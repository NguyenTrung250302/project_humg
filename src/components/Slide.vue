<script setup>
import { onMounted } from "vue";
import img1 from '../assets/imgs/auth_imgs/thanhnienvietnam.jpg';
import img2 from '../assets/imgs/auth_imgs/university.jpg';
import img3 from '../assets/imgs/auth_imgs/hoctapvalamtheoloibac.jpg';
import img4 from '../assets/imgs/auth_imgs/universitylogo.jpg';
import img5 from '../assets/imgs/auth_imgs/codoan.gif';

onMounted(() => {
  const panels = document.querySelectorAll(".panel");
  let currentIndex = 2; 

  function removeActive() {
    panels.forEach((panel) => {
      panel.classList.remove("active");
    });
  }

  function changeSlide() {
    removeActive();
    panels[currentIndex].classList.add("active");
    currentIndex = (currentIndex + 1) % panels.length; 
  }

  setInterval(changeSlide, 2000);

  panels.forEach((panel, index) => {
    panel.addEventListener("click", () => {
      removeActive();
      panel.classList.add("active");
      currentIndex = index; 
    });
  });

});
</script>

<template>
  <section class="slideImg">
    <div class="container">
      <div class="panel" :style="{ backgroundImage: `url(${img1})` }">
        <h3>Thanh Niên Việt Nam</h3>
      </div>
      <div class="panel" :style="{ backgroundImage: `url(${img2})` }">
        <h3>HUMG University</h3>
      </div>
      <div class="panel active" :style="{ backgroundImage: `url(${img3})` }">
        <h3>Chủ Tịch Hồ Chí Minh</h3>
      </div>
      <div class="panel" :style="{ backgroundImage: `url(${img4})` }">
        <h3>HUMG</h3>
      </div>
      <div class="panel" :style="{ backgroundImage: `url(${img5})` }">
        <h3>Đoàn Thanh Niên Cộng Sản Việt Nam</h3>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  display: flex;
  width: 100%;
  max-width: 100vw;
  gap: 15px;
  padding: 20px;
  box-sizing: border-box;
  height: 70vh;
}

.panel {
  position: relative;
  height: 100%;
  flex: 0.5;
  border-radius: 30px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.10);
  cursor: pointer;
  transform: scale(0.98);
}

.panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  transition: opacity 0.5s;
  opacity: 0;
  z-index: 1;
}

.panel:hover::before {
  opacity: 1;
}

.panel h3 {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 2;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  padding: 8px 16px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.panel.active {
  flex: 4;
  transform: scale(1);
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.3);
}

.panel.active::before {
  opacity: 1;
}

.panel.active h3 {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 720px) {
  .container {
    height: 50vh;
    padding: 10px;
    gap: 10px;
  }

  .panel:nth-of-type(4),
  .panel:nth-of-type(5) {
    display: none;
  }

  .panel h3 {
    font-size: 18px;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .container {
    height: 40vh;
  }
  
  .panel h3 {
    font-size: 16px;
  }
}
</style>
