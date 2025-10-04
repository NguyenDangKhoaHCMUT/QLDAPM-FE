<template>
  <div class="about-container">
    <h1 class="title">Về Chúng Tôi</h1>
    <div class="content">
      <div class="mission-section">
        <h2>Sứ Mệnh</h2>
        <p>Chúng tôi cam kết cung cấp dịch vụ thuê xe điện chất lượng cao, thân thiện với môi trường và góp phần xây dựng một tương lai xanh cho Việt Nam.</p>
      </div>
      
      <div class="team-section">
        <h2>Đội Ngũ</h2>
        <p>Đội ngũ của chúng tôi bao gồm các chuyên gia giàu kinh nghiệm trong lĩnh vực công nghệ, ô tô điện và dịch vụ khách hàng, luôn sẵn sàng phục vụ bạn 24/7.</p>
      </div>

      <div class="values-section">
        <h2>Giá Trị Cốt Lõi</h2>
        <ul>
          <li>🌱 Bảo vệ môi trường</li>
          <li>🔒 An toàn và tin cậy</li>
          <li>⚡ Công nghệ tiên tiến</li>
          <li>❤️ Tận tâm với khách hàng</li>
          <li>💡 Đổi mới sáng tạo</li>
        </ul>
      </div>

      <div class="stats-section">
        <h2>Thành Tựu</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">250+</div>
            <div class="stat-label">Xe điện</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">15K+</div>
            <div class="stat-label">Khách hàng</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50K+</div>
            <div class="stat-label">Chuyến đi</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">12+</div>
            <div class="stat-label">Thành phố</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO metadata
// @ts-ignore
useHead({
  title: 'Về Chúng Tôi - EV Sharing',
  meta: [
    { name: 'description', content: 'Tìm hiểu về EV Sharing - đơn vị cho thuê xe điện hàng đầu Việt Nam. Sứ mệnh, giá trị và đội ngũ chuyên nghiệp.' }
  ]
})
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.content {
  display: grid;
  gap: 2rem;
}

.mission-section,
.team-section,
.values-section,
.stats-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.mission-section:hover,
.team-section:hover,
.values-section:hover,
.stats-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.15);
}

h2 {
  color: #16a34a;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

p {
  line-height: 1.6;
  color: #4b5563;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.8rem 0;
  padding-left: 0;
  color: #4b5563;
  font-weight: 500;
}

.stats-section {
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #16a34a;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .about-container {
    padding: 1rem;
  }
  
  .title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .mission-section,
  .team-section,
  .values-section,
  .stats-section {
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}
</style>