<template>
    <section class="carousel">
        <!-- 指示器 -->
        <div class="carousel-indicators">
            <button v-for="(slide, index) in slides" class="carousel-indicator" :key="index"
                :class="{ active: currentIndex === index }" @click="jumpToSlide(index)"
                :aria-label="'Slide ' + (index + 1)"></button>
        </div>

        <!-- 轮播内容 -->
        <div class="carousel-inner">
            <TransitionGroup :name="transitionName">
                <div v-for="(slide, index) in slides" :key="index" :style="itemStyle(index)" class="carousel-item"
                    :class="{ active: currentIndex === index }">
                    <!-- 图片/视频内容 -->
                    <video v-if="slide.type === 'video'" :src="slide.media" autoplay muted loop
                        class="carousel-background"></video>
                    <img v-else :src="slide.media" class="carousel-background" :alt="slide.title">

                    <!-- 文字描述 -->
                    <div class="carousel-caption">
                        <h1>{{ slide.title }}</h1>
                        <p>{{ slide.description }}</p>
                        <div class="carousel-buttons">
                            <a v-if="slide.buttons" v-for="(btn, i) in slide.buttons" :key="i" :href="btn.link"
                                class="btn btn-outline-light btn-sm">
                                {{ btn.text }}
                            </a>
                        </div>
                    </div>
                </div>
            </TransitionGroup>
        </div>

        <!-- 导航按钮 -->
        <div class="carousel-controls">
            <button class="carousel-control" @click="prevSlide">
                <span class="carousel-control__icon is-prev"></span>
            </button>
            <button class="carousel-control" @click="nextSlide">
                <span class="carousel-control__icon is-next"></span>
            </button>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const slides = ref([
    {
        media: 'img/qyg.jpg',
        title: '欢迎来到 Mahoo Town',
        description: '一个由玩家创造的 Minecraft 服务器，这里有你想要的一切。',
        buttons: [
            { text: '即刻游玩', link: '/overview' }
        ]
    },
    {
        media: 'img/end.jpg',
        title: '欲买桂花同载酒，终不似，少年游。',
        description: '本服务器用于怀念过去在 Minecraft 中度过的美好游戏时光。',
        buttons: [
            { text: '查看教程', link: '/tutorial' },
            { text: '常见问题', link: '/faq' }
        ]
    },
    {
        type: 'video',
        media: 'img/banner.mp4',
        title: '田园牧歌，我们的家园。',
        description: '我们等你一起，探索田园牧歌式的人类宜居家园。',
        buttons: [
            { text: 'MC 启动', link: '/get-started' }
        ]
    },

])

// 新增状态管理
const transitionName = ref('slide-next')
const slideDirection = ref(1) // 1: 正向滑动，-1: 反向滑动

// 新增计算属性
const itemStyle = computed(() => (index) => {
    return {
        transform: currentIndex.value === index
            ? 'translateX(0)'
            : `translateX(${index > currentIndex.value ? '100%' : '-100%'})`,
        zIndex: currentIndex.value === index ? 1 : 0
    }
})
const currentIndex = ref(0)
let autoPlayTimer = null

// 自动播放逻辑
const startAutoPlay = () => {
    autoPlayTimer = setInterval(() => {
        nextSlide()
    }, 5000)
}

const nextSlide = () => {
    slideDirection.value = 1
    transitionName.value = 'slide-next'
    currentIndex.value = (currentIndex.value + 1) % slides.value.length
}

const prevSlide = () => {
    slideDirection.value = -1
    transitionName.value = 'slide-prev'
    currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
}

const jumpToSlide = (index) => {
    currentIndex.value = index
}

onMounted(() => {
    startAutoPlay()
})

onBeforeUnmount(() => {
    clearInterval(autoPlayTimer)
})
</script>

<style scoped lang="scss">
.carousel {
    position: relative;

    &-item {
        height: 100%;
        width: 100%;
        position: absolute;
        backface-visibility: hidden;
        transition: transform 0.6s ease-in-out;
        will-change: transform;

        /* 防止点击穿透 */
        &:not(.active) {
            pointer-events: none;
        }

        &.active {
            transform: translateX(0);
        }

        .carousel-background {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .carousel-caption {
            position: absolute;
            right: 15%;
            bottom: 1.25rem;
            left: 15%;
            top: 40%;
            padding-top: 1.25rem;
            padding-bottom: 1.25rem;
            color: rgb(255, 255, 255);
            text-align: center;

            h1 {
                font-weight: 700;
            }
            p {
                margin-bottom: 1rem;
            }
        }

        .carousel-buttons {
            display: flex;
            justify-content: center;
            gap: 8px;
        }
    }

    &-inner {
        position: relative;
        width: 100%;
        overflow: hidden;
        height: 100%;
        z-index: 1;
    }

    &-indicators {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        display: flex;
        justify-content: center;
        padding: 0;
        margin-right: 15%;
        margin-bottom: 1rem;
        margin-left: 15%;

        .active {
            opacity: 1;
        }

        button {
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 3px;
            padding: 0;
            margin-right: 3px;
            margin-left: 3px;
            text-indent: -999px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border: 0;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6sease;
        }
    }

    &-controls {
        position: absolute;
        top: 50%;
        transform: translateY(100%);
        width: 100%;
        padding: 0 5%;
        display: flex;
        justify-content: space-between;
        z-index: 2;

        .carousel-control {
            transform: translateY(-150%);
            background: transparent;
            border: none;
            color: #fff;
            opacity: .5;
            transition: opacity .15s ease;

            &:hover {
                opacity: .9;
            }

            &__icon {
                display: inline-block;
                width: 2rem;
                height: 2rem;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: 100% 100%;

                &.is-next {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e")
                }

                &.is-prev {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e")
                }
            }
        }
    }
}

// 下一张动画
.slide-next-enter-active,
.slide-next-leave-active {
    transition: transform 0.6s ease-in-out;
}

.slide-next-enter-from {
    transform: translateX(100%);
}

.slide-next-leave-to {
    transform: translateX(-100%);
}

// 上一张动画
.slide-prev-enter-active,
.slide-prev-leave-active {
    transition: transform 0.6s ease-in-out;
}

.slide-prev-enter-from {
    transform: translateX(-100%);
}

.slide-prev-leave-to {
    transform: translateX(100%);
}
</style>