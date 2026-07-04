<template>
  <section class="hero-carousel">
    <!-- 轮播内容 -->
    <div class="carousel-inner">
      <TransitionGroup :name="transitionName">
        <div 
          v-for="(slide, index) in slides" 
          :key="index" 
          :style="itemStyle(index)" 
          class="carousel-item"
          :class="{ active: currentIndex === index }"
        >
          <!-- 背景媒体 -->
          <div class="media-wrapper">
            <div class="overlay"></div>
            <video 
              v-if="slide.type === 'video'" 
              :src="slide.media" 
              autoplay 
              muted 
              loop
              playsinline
              class="carousel-media"
            ></video>
            <img 
              v-else 
              :src="slide.media" 
              class="carousel-media" 
              :alt="slide.title"
            >
          </div>

          <!-- 文字描述 -->
          <div class="carousel-caption">
            <div class="caption-content">
              <h1 class="title">{{ slide.title }}</h1>
              <p class="description">{{ slide.description }}</p>
              <div class="carousel-actions" v-if="slide.buttons && slide.buttons.length">
                <a 
                  v-for="(btn, i) in slide.buttons" 
                  :key="i" 
                  :href="btn.link"
                  class="action-btn"
                  :class="i === 0 ? 'primary' : 'secondary'"
                >
                  {{ btn.text }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 导航控件 -->
    <div class="carousel-navigation">
      <button class="nav-btn prev" @click="prevSlide" aria-label="上一张">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div class="indicators">
        <button 
          v-for="(_, index) in slides" 
          :key="index"
          class="indicator"
          :class="{ active: currentIndex === index }"
          @click="jumpToSlide(index)"
          :aria-label="`跳到第 ${index + 1} 张`"
        ></button>
      </div>
      <button class="nav-btn next" @click="nextSlide" aria-label="下一张">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const slides = ref([
  {
    media: '/img/qyg.jpg',
    title: '欢迎来到 Mahoo Town',
    description: '一个由玩家创造的 Minecraft 服务器，这里有你想要的一切。',
    buttons: [
      { text: '即刻游玩', link: '/overview' }
    ]
  },
  {
    media: '/img/end.jpg',
    title: '欲买桂花同载酒，终不似，少年游',
    description: '本服务器用于怀念过去在 Minecraft 中度过的美好游戏时光。',
    buttons: [
      { text: '查看教程', link: '/tutorial' },
      { text: '常见问题', link: '/faq' }
    ]
  },
  {
    type: 'video',
    media: '/img/banner.mp4',
    title: '田园牧歌，我们的家园',
    description: '我们等你一起，探索田园牧歌式的人类宜居家园。',
    buttons: [
      { text: 'MC 启动', link: '/play/get-started' }
    ]
  }
])

const transitionName = ref('slide-next')
const currentIndex = ref(0)
let autoPlayTimer = null

const itemStyle = computed(() => (index) => {
  return {
    transform: currentIndex.value === index
      ? 'translateX(0)'
      : `translateX(${index > currentIndex.value ? '100%' : '-100%'})`,
    zIndex: currentIndex.value === index ? 1 : 0
  }
})

const startAutoPlay = () => {
  autoPlayTimer = setInterval(nextSlide, 8000)
}

const resetAutoPlay = () => {
  clearInterval(autoPlayTimer)
  startAutoPlay()
}

const nextSlide = () => {
  transitionName.value = 'slide-next'
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
  resetAutoPlay()
}

const prevSlide = () => {
  transitionName.value = 'slide-prev'
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
  resetAutoPlay()
}

const jumpToSlide = (index) => {
  transitionName.value = index > currentIndex.value ? 'slide-next' : 'slide-prev'
  currentIndex.value = index
  resetAutoPlay()
}

onMounted(() => {
  startAutoPlay()
})

onBeforeUnmount(() => {
  clearInterval(autoPlayTimer)
})
</script>

<style scoped>
.hero-carousel {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  background-color: #000;
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
  backface-visibility: hidden;
}

.carousel-item:not(.active) {
  pointer-events: none;
}

.media-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.carousel-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 1;
}

.carousel-caption {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  padding: 2rem;
}

.caption-content {
  text-align: center;
  max-width: 800px;
  color: #fff;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}

.carousel-item.active .caption-content {
  opacity: 1;
  transform: translateY(0);
}

.title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

.description {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  line-height: 1.5;
  margin: 0 0 2.5rem;
  opacity: 0.9;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.carousel-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 100px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background-color: #fff;
  color: #000;
}

.action-btn.primary:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.action-btn.secondary {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
}

.action-btn.secondary:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.carousel-navigation {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 2rem;
  z-index: 10;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  backdrop-filter: blur(8px);
}

.nav-btn {
  background: transparent;
  border: none;
  color: #fff;
  opacity: 0.6;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.nav-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.indicators {
  display: flex;
  gap: 0.75rem;
}

.indicator {
  width: 48px;
  height: 4px;
  border-radius: 2px;
  background-color: #fff;
  border: none;
  opacity: 0.3;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator:hover {
  opacity: 0.6;
}

.indicator.active {
  opacity: 1;
}

/* Animations */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-next-enter-from { transform: translateX(100%); }
.slide-next-leave-to { transform: translateX(-100%); }
.slide-prev-enter-from { transform: translateX(-100%); }
.slide-prev-leave-to { transform: translateX(100%); }

@media (max-width: 768px) {
  .carousel-caption { padding: 1.5rem; }
  .carousel-navigation { bottom: 2rem; }
  .indicator { width: 32px; }
  .action-btn { padding: 0.875rem 2rem; font-size: 1rem; }
}
</style>
