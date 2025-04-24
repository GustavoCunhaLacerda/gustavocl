<template>
  <div class="contact-section" id="contact">
    <div class="container">
      <h2 class="section-title fade-in">Contato</h2>
      <div class="contact-content fade-in">
        <p>Interessado em trabalhar juntos? Entre em contato comigo através das redes sociais ou envie um email.</p>
        <div class="contact-links">
          <a href="https://www.linkedin.com/in/gustavocunhalacerda/" target="_blank" class="contact-link">
            <span class="contact-icon">in</span>
            LinkedIn
          </a>
          <a href="https://github.com/gustavocunhalacerda" target="_blank" class="contact-link">
            <span class="contact-icon">gh</span>
            GitHub
          </a>
          <a href="mailto:contato@gustavolacerda.com" class="contact-link">
            <span class="contact-icon">@</span>
            Email
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Componente de contato simples sem props necessários
</script>

<style scoped>
.contact-section {
  padding: 8rem 0;
  position: relative;
}

.section-title {
  margin-bottom: 3rem;
  text-align: center;
}

.contact-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.contact-content p {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 2rem;
}

.contact-link {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(0, 217, 255, 0.1);
  border: 1px solid var(--color-accent);
  border-radius: 50%;
  margin-bottom: 0.8rem;
  font-size: 1.5rem;
  color: var(--color-accent);
  transition: all 0.3s ease;
}

.contact-link:hover {
  transform: translateY(-5px);
}

.contact-link:hover .contact-icon {
  background: var(--color-accent);
  color: var(--color-space-black);
}

@media (max-width: 768px) {
  .contact-section {
    padding: 4rem 0;
  }
  
  .contact-links {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
}
</style>
