<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="#" class="brand-logo">
            <img class="logo-img" src="/img/logo.png" alt="Mahoo Town Logo">
          </a>
          <h5 class="brand-slogan">田园牧歌 我们的家园</h5>
        </div>

        <div class="footer-links">
          <h5>站点</h5>
          <ul>
            <li><a href="#">主站</a></li>
            <li><a href="/wiki">Wiki</a></li>
            <li><a href="#">博物馆</a></li>
            <li><a href="#">卫星云图</a></li>
            <li><a href="#">服务状态</a></li>
          </ul>
        </div>

        <div class="footer-links">
          <h5>联系我们</h5>
          <ul>
            <li><a href="//url.rxgzs.cn/tucao">报告问题</a></li>
            <li><a href="https://github.com/Mahoo12138/mahoo-town">Github</a></li>
            <li><a href="mailto:mahoo12138@qq.com">电子邮箱</a></li>
          </ul>
        </div>

        <div class="footer-links">
          <h5>关于我们</h5>
          <ul>
            <li><a href="#">工作机会</a></li>
            <li><a href="#">大事记</a></li>
            <li><a href="#">开放平台</a></li>
            <li><a href="https://blog.mahoo12138.cn">Mahoo Blog</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-friends">
          <span>友情连接：</span>
          <a href="https://zh.minecraft.wiki/" target="_blank">MC Wiki</a>
          <a href="https://www.mcmod.cn/" target="_blank">MC 百科</a>
          <a href="https://www.mualliance.cn" target="_blank">中国MC高校联盟</a>
        </div>
        <div class="footer-legal">
          <div class="legal-links">
            <a href="#" target="_blank">市民公约</a>
            <span class="divider">|</span>
            <a href="#" target="_blank">服务条款</a>
            <span class="divider">|</span>
            <a href="#" target="_blank">隐私政策</a>
            <span class="divider">|</span>
            <a href="#" target="_blank">Mahoo12138</a>
          </div>
          <p class="copyright">Copyright © 2024~2025 <a href="https://mahoo12138.cn" target="_blank">Mahoo12138</a> All rights reserved.</p>
          <p class="operator">Operated by Mahoo12138.</p>
          <p class="version">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><line x1="3" y1="12" x2="9" y2="12"></line><line x1="15" y1="12" x2="21" y2="12"></line><line x1="12" y1="3" x2="12" y2="9"></line><line x1="12" y1="15" x2="12" y2="21"></line></svg>
            Version: {{ VERSION }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const VERSION = "1.1.0"
</script>

<style scoped>
.site-footer {
  background-color: #fcfbf9;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 5rem 1.5rem 3rem;
  color: #5c5853;
  font-size: 0.875rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 4rem 2rem;
  margin-bottom: 4rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.brand-logo {
  display: inline-block;
}

.logo-img {
  height: 48px;
  width: auto;
  object-fit: contain;
}

.brand-slogan {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1918;
  margin: 0;
}

.footer-links h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1918;
  margin: 0 0 1.5rem 0;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links a {
  color: #6b6661;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #1e3c2f;
}

.footer-bottom {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
}

.footer-friends {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  color: #8c8782;
}

.footer-friends a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-friends a:hover {
  color: #1e3c2f;
}

.footer-legal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #8c8782;
}

.legal-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.legal-links a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.legal-links a:hover {
  color: #1e3c2f;
}

.divider {
  opacity: 0.3;
}

.copyright a {
  color: inherit;
  text-decoration: none;
}

.copyright a:hover {
  text-decoration: underline;
}

.version {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-brand {
    grid-column: span 2;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .footer-brand {
    grid-column: 1;
  }
}
</style>
