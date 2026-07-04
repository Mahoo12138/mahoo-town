<template>
  <section class="showcase-section">
    <div class="showcase-container">
      <header class="showcase-header">
        <h2>小镇风光</h2>
        <p>每一块砖石都记录着玩家们的奇思妙想与辛勤汗水。更多建筑即将呈现。</p>
      </header>

      <div class="showcase-grid">
        <!-- 占位图块，留白设计 -->
        <div class="showcase-placeholder">
          <div class="placeholder-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <span>虚位以待</span>
        </div>
        <div class="showcase-placeholder">
          <div class="placeholder-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <span>虚位以待</span>
        </div>
        <div class="showcase-placeholder">
          <div class="placeholder-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <span>虚位以待</span>
        </div>
        <div class="showcase-placeholder">
          <div class="placeholder-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <span>虚位以待</span>
        </div>
        <div class="showcase-placeholder">
          <div class="placeholder-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <span>虚位以待</span>
        </div>
        <div class="showcase-placeholder">
          <div class="placeholder-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          <span>虚位以待</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.showcase-section {
  background-color: #ffffff;
  color: #1a1918;
  padding: 6rem 1.5rem;
}

.showcase-container {
  max-width: 1200px;
  margin: 0 auto;
}

.showcase-header {
  margin-bottom: 4rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 2rem;
  max-width: 600px;
}

.showcase-header h2 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem 0;
  color: #1a1918;
}

.showcase-header p {
  font-size: 1.125rem;
  color: #6b6661;
  margin: 0;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.showcase-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #fdfbf7;
  border-radius: 16px;
  border: 1px dashed rgba(0, 0, 0, 0.12);
  color: #a39e99;
  transition: transform 0.3s ease, background-color 0.3s ease;
  cursor: default;
}

.showcase-placeholder:hover {
  transform: translateY(-4px);
  background-color: #f5f4f0;
  color: #8c8782;
}

.placeholder-icon {
  margin-bottom: 0.75rem;
  opacity: 0.5;
}

.showcase-placeholder span {
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}
</style>
