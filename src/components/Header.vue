<template>
  <header class="header">
    <div class="header-container">
      <!-- Banner Background -->
      <div class="banner">
        <img src="../assets/imgs/auth_imgs/banner.png" alt="Banner Background" />
      </div>

      <!-- Left Logo -->
      <div class="logo-container left-logo">
        <div class="logo school-logo">
          <img src="../assets/imgs/auth_imgs/schoollogo.png" alt="School Logo" />
        </div>
      </div>

      <!-- Title -->
      <div class="title-container">
        <h1>
          ĐOÀN THANH NIÊN - KHOA CNTT
          <span>TRƯỜNG ĐẠI HỌC MỎ ĐỊA CHẤT HÀ NỘI</span>
        </h1>
      </div>

      <!-- Right Logo -->
      <div class="logo-container right-logo">
        <div class="logo union-logo">
          <img src="../assets/imgs/logo.ico" alt="Youth Union Logo" />
        </div>
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
  background: linear-gradient(135deg, #1a237e, #3949ab);
  box-shadow: 0 4px 20px rgba(26, 35, 126, 0.2);
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('../assets/imgs/auth_imgs/banner.png') center/cover;
  opacity: 0.1;
  z-index: 1;
}

.header-container {
  position: relative;
  height: 22vh;
  min-height: 200px;
  max-height: 300px;
  overflow: hidden;
  z-index: 2;
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
  opacity: 0.15;
  filter: brightness(0.8) contrast(1.2);
  transform: scale(1.1);
  transition: transform 0.5s ease;
}

.banner:hover img {
  transform: scale(1.15);
}

/* Logo Container Styles */
.logo-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  z-index: 3;
}

.left-logo {
  left: 5%;
}

.right-logo {
  right: 5%;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.logo:hover {
  transform: scale(1.05) translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.school-logo img {
  width: 85px;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: all 0.3s ease;
}

.union-logo img {
  width: 75px;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: all 0.3s ease;
}

.logo:hover img {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Title Styles */
.title-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 60%;
  z-index: 3;
  background: rgba(255, 255, 255, 0.05);
  padding: 20px 30px;
  border-radius: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.title-container:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translate(-50%, -50%) scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

h1 {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  line-height: 1.4;
  letter-spacing: 0.5px;
}

h1 span {
  display: block;
  font-size: 1.6rem;
  margin-top: 8px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-container {
    height: 20vh;
  }

  .left-logo {
    left: 3%;
  }

  .right-logo {
    right: 3%;
  }

  .title-container {
    width: 70%;
    padding: 15px 25px;
  }

  h1 {
    font-size: 1.8rem;
  }

  h1 span {
    font-size: 1.4rem;
  }
}

@media (max-width: 768px) {
  .header-container {
    height: 25vh;
  }

  .left-logo {
    left: 2%;
  }

  .right-logo {
    right: 2%;
  }

  .logo {
    padding: 6px;
  }

  .school-logo img {
    width: 65px;
  }

  .union-logo img {
    width: 55px;
  }

  .title-container {
    width: 80%;
    padding: 12px 20px;
  }

  h1 {
    font-size: 1.5rem;
  }

  h1 span {
    font-size: 1.2rem;
    margin-top: 6px;
  }
}

@media (max-width: 480px) {
  .header-container {
    height: 30vh;
  }

  .logo-container {
    position: relative;
    top: 0;
    transform: none;
  }

  .left-logo {
    left: 0;
  }

  .right-logo {
    right: 0;
  }

  .logo {
    padding: 5px;
  }

  .school-logo img {
    width: 50px;
  }

  .union-logo img {
    width: 45px;
  }

  .title-container {
    width: 90%;
    top: 60%;
    padding: 10px 15px;
  }

  h1 {
    font-size: 1.3rem;
  }

  h1 span {
    font-size: 1.1rem;
    margin-top: 5px;
  }
}
</style>