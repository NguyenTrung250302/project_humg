<script setup>
import { onMounted } from "vue";
import img1 from '../assets/imgs/auth_imgs/thanhnienvietnam.jpg';
import img2 from '../assets/imgs/auth_imgs/universitylogo.jpg';
import img3 from '../assets/imgs/auth_imgs/hoctapvalamtheoloibac.jpg';
import img4 from '../assets/imgs/auth_imgs/universitylogo.jpg';
import img5 from '../assets/imgs/auth_imgs/thanhnienvietnam.jpg';

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
                <h3>HUMG</h3>
            </div>
            <div class="panel active" :style="{ backgroundImage: `url(${img3})` }">
                <h3>HUMG University</h3>
            </div>
            <div class="panel" :style="{ backgroundImage: `url(${img4})` }">
                <h3>HUMG</h3>
            </div>
            <div class="panel" :style="{ backgroundImage: `url(${img5})` }">
                <h3>Thanh Niên Việt Nam</h3>
            </div>
        </div>
    </section>
</template>

<style scoped>
h1{
    text-align: center;
    background-color: aqua;
    color: blue;
    border-radius: 40px;
    max-width: 80vw;
    margin: 0 auto;
}

body {
    overflow-x: hidden;
}

.container{
    display: flex;
    width: 100%; 
    max-width: 100vw; 
}

@keyframes FadeIn{
    from{
        opacity: 0;
    }
    to{
        opacity: 1;
    }
}

.panel{
    position: relative;
    height: 70vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50px;
    color: white;
    cursor: pointer;
    flex: 1;
    margin: 10px;
    animation: FadeIn ease-out 1.7s;
    transition: flex 0.8s;
}


.panel h3{
    position: absolute;
    margin: 0;
    font-size: 24px;
    bottom: 20px;
    left: 20px;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 20px;
    padding: 0 8px;
}

.panel.active{
    flex: 10;
}

.panel.active h3{
    opacity: 1;
    transition: opacity 1s 0.8s;
}

/* Ẩn bớt phần tử khi màn hình nhỏ */
@media (max-width: 720px){
    .panel:nth-of-type(4),
    .panel:nth-of-type(5){
        display: none;
    }
}
</style>
