<template>
  <footer class="footer">
    <div class="container">
      <div class="social-links">
        <a href="https://www.linkedin.com/in/gustavocunhalacerda/" target="_blank" class="social-link">
          LinkedIn
        </a>
        <a href="https://github.com/gustavocunhalacerda" target="_blank" class="social-link">
          GitHub
        </a>
      </div>
      <p>&copy; {{ new Date().getFullYear() }} Gustavo Cunha Lacerda. Todos os direitos reservados.</p>
      <p class="easter-egg-hint">Dica: Digite "math" para revelar easter eggs matemáticos e procure pelo cubo mágico!</p>
    </div>
  </footer>
</template>

<script setup>
// Componente de footer simples sem props necessários
</script>

<style scoped>
.footer {
  background-color: var(--color-space-dark);
  padding: 3rem 0;
  text-align: center;
  position: relative;
  z-index: 10;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.social-link {
  font-size: 1.2rem;
  color: var(--color-text);
  transition: all 0.3s ease;
  position: relative;
  padding-bottom: 0.3rem;
}

.social-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: var(--color-accent);
  transition: width 0.3s ease;
}

.social-link:hover {
  color: var(--color-accent);
}

.social-link:hover::after {
  width: 100%;
}

p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.easter-egg-hint {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 1.5rem;
  font-family: var(--font-mono);
}
</style>
