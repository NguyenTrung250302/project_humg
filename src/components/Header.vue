<template>
  <header class="header">
    <div class="header-container">
      <!-- Banner Background -->
      <div class="banner">
        <img src="../assets/imgs/auth_imgs/banner.png" alt="Banner Background" />
      </div>

      <!-- Logo Container -->
      <div class="logo-container">
        <!-- School Logo -->
        <div class="logo school-logo">
          <img src="../assets/imgs/auth_imgs/schoollogo.png" alt="School Logo" />
        </div>

        <!-- Youth Union Logo -->
        <div class="logo union-logo">
          <img src="../assets/imgs/logo.ico" alt="Youth Union Logo" />
        </div>
      </div>

      <!-- Title -->
      <div class="title-container">
        <h1>
          ĐOÀN THANH NIÊN - HỘI SINH VIÊN
          <span>TRƯỜNG ĐẠI HỌC MỎ ĐỊA CHẤT HÀ NỘI</span>
        </h1>
      </div>
    </div>
  </header>
</template>

<script setup>
// Add any required logic here
</script>

<style scoped>
.header {
  width: 100%;
  position: relative;
  background-color: #004fee;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-container {
  position: relative;
  height: 20vh;
  overflow: hidden;
}

/* Banner Styles */
.banner {
  width: 100%;
  height: 100%;
  position: relative;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
}

/* Logo Container Styles */
.logo-container {
  position: absolute;
  top: 50%;
  left: 5%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.school-logo img {
  width: 80px;
  height: auto;
}

.union-logo img {
  width: 70px;
  height: auto;
}

/* Title Styles */
.title-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 60%;
}

h1 {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  line-height: 1.4;
}

h1 span {
  display: block;
  font-size: 1.5rem;
  margin-top: 5px;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .logo-container {
    left: 3%;
  }

  .title-container {
    width: 70%;
  }

  h1 {
    font-size: 1.6rem;
  }

  h1 span {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .header-container {
    height: 25vh;
  }

  .logo-container {
    flex-direction: column;
    gap: 10px;
    left: 2%;
  }

  .logo img {
    width: 60px;
  }

  .title-container {
    width: 80%;
  }

  h1 {
    font-size: 1.4rem;
  }

  h1 span {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .header-container {
    height: 30vh;
  }

  .logo-container {
    position: relative;
    top: 0;
    left: 0;
    transform: none;
    justify-content: center;
    padding-top: 10px;
  }

  .title-container {
    width: 90%;
    top: 60%;
  }

  h1 {
    font-size: 1.2rem;
  }

  h1 span {
    font-size: 1rem;
  }
}
</style>