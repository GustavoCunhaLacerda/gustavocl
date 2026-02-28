<template>
  <section class="contact-section" id="contact">
    <div class="container">
      <div class="contact-content fade-in">
        <h2 class="section-title">{{ $t('contact.title') }}</h2>
        <p class="contact-text">
          {{ $t('contact.text') }}
        </p>
        <a href="mailto:gustavocunhalacerda@gmail.com" class="btn btn-primary contact-cta">
          {{ $t('contact.sendEmail') }}
        </a>
        <div class="social-row">
          <a href="https://www.linkedin.com/in/gustavocunhalacerda/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <IconLinkedIn :size="20" />
          </a>
          <a href="https://github.com/GustavoCunhaLacerda" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <IconGitHub :size="20" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import IconLinkedIn from './icons/IconLinkedIn.vue';
import IconGitHub from './icons/IconGitHub.vue';
</script>

<style scoped>
.contact-section {
  padding: 8rem 0 6rem;
  position: relative;
}

.contact-content {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
}

.contact-text {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.contact-cta {
  font-size: 0.85rem;
  padding: 0.8rem 2rem;
  letter-spacing: 1.5px;
}

.social-row {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.social-row a {
  color: var(--color-text-muted);
  transition: color 0.2s ease;
  display: flex;
}

.social-row a:hover {
  color: var(--color-accent);
}

@media (max-width: 480px) {
  .contact-section {
    padding: 4rem 0 3rem;
  }
}
</style>
