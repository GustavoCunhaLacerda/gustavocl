<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <p class="copyright">&copy; {{ new Date().getFullYear() }} Gustavo Cunha Lacerda</p>
        <p class="easter-egg-hint">{{ $t('footer.easterEggHint') }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-space-dark);
  padding: 2rem 0;
  position: relative;
  z-index: 10;
  border-top: 1px solid var(--border-subtle);
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.copyright {
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  margin: 0;
}

.easter-egg-hint {
  font-size: 0.7rem;
  color: rgba(168, 152, 128, 0.2);
  font-family: var(--font-mono);
  margin: 0;
  letter-spacing: 0.5px;
}
</style>
