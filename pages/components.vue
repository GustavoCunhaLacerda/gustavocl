<template>
  <div class="w-screen h-screen">
    <div class="dark:bg-primaryBlue bg-white w-full h-full">
      <ColorSwitcher></ColorSwitcher>
      <button class="p-2 rounded text text-white m-2 bg-orange">Button</button>
      <button
        class="border p-2 rounded text text-primaryBlue m-2 border-primaryBlue dark:text-lightBlue dark:border-lightBlue"
      >
        Button
      </button>
      <h1 class="text-darkGray dark:text-white">TITULO</h1>
      <p class="text-darkGray dark:text-white"></p>
      <a href="" class="text-primaryBlue dark:text-orange">teste link</a>
    </div>
  </div>
</template>

<script setup>
import ColorSwitcher from "@/components/base/ColorSwitcher.vue";
</script>
