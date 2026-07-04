<template>
  <section class="team-section">
    <div class="team-container">
      <header class="team-header">
        <h2>我们的团队</h2>
        <p>Mahoo Town 的运营团队从玩家中来，致力于打造扁平化的管理组。</p>
      </header>

      <div class="team-grid">
        <div class="team-member">
          <img class="avatar" src="https://avatars.githubusercontent.com/u/45908451?v=4" alt="Mahoo">
          <h3>Mahoo</h3>
          <p>服主</p>
        </div>
        <div class="team-member">
          <img class="avatar" src="https://avatars.githubusercontent.com/u/45908451?v=4" alt="Mahoo">
          <h3>Mahoo</h3>
          <p>管理员</p>
        </div>
        <div class="team-member">
          <img class="avatar" src="https://avatars.githubusercontent.com/u/45908451?v=4" alt="Mahoo">
          <h3>Mahoo</h3>
          <p>技术支持</p>
        </div>
        <div class="team-member">
          <img class="avatar" src="https://avatars.githubusercontent.com/u/45908451?v=4" alt="Mahoo">
          <h3>Mahoo</h3>
          <p>建筑师</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team-section {
  background-color: #fdfbf7;
  color: #1a1918;
  padding: 6rem 1.5rem;
}

.team-container {
  max-width: 1200px;
  margin: 0 auto;
}

.team-header {
  margin-bottom: 4rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 2rem;
  max-width: 600px;
}

.team-header h2 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem 0;
  color: #1a1918;
}

.team-header p {
  font-size: 1.125rem;
  color: #6b6661;
  margin: 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem 2rem;
  text-align: center;
}

.team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 4px solid #ffffff;
  transition: transform 0.3s ease;
}

.team-member:hover .avatar {
  transform: translateY(-4px);
}

.team-member h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #1a1918;
}

.team-member p {
  font-size: 0.875rem;
  color: #6b6661;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
