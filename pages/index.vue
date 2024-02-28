<template>
  <div class="flex flex-col grow">
    <div class="">
      <div class="">
        <h4 class="">Olá, eu sou o Gustavo!</h4>
        <h6>
          Eu sou o Gustavo, tenho 23 anos e sou um desenvolvedor de software
          formado em ciência da computação. Sou especialista em Nuxt, TypesCript
          e solucição de problemas com software.
        </h6>
      </div>
      <div class="flex justify-items-center align items-center">
        <!-- <img src="/assets/images/me-art.jpeg" height="500" width="500" /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "main",
});

useSeoMeta({
  titleTemplate: "%s - Home",
  description: "Espaço pessoal para divulgar meu trabalho como desenvolvedor.",
});
</script>
