<template>
  <div class="flex flex-col gap-5 py-5">
    <h1 class="text-xl text-gray-900 font-semibold dark:text-orange">
      Sobre Mim
    </h1>
    <ul
      class="list-disc pl-10 [&_strong]:text-darkGray [&_strong]:font-semibold [&_*]:dark:text-white"
    >
      <li><strong>Nome completo:</strong> Gustavo Cunha Lacerda;</li>
      <li><strong>Local:</strong> Brasília, Brasil;</li>
      <li>
        <strong>Profisionalmente:</strong> Desenvolvedor Frontend @
        <a
          href="https://www.medware.com.br/"
          target="_blank"
          class="custom-hover-link cursor-pointer"
        >
          Medware Sistemas Médicos</a
        >;
      </li>
      <li><strong>Casualmente:</strong> Cubos mágicos e games;</li>
      <li><strong>Pronomes:</strong> ele/dele;</li>
      <li>
        <strong>Contato:</strong>
        <a
          href="mailto:gustavocunhalacerda@gmail.com"
          class="custom-hover-link cursor-pointer"
        >
          gustavocunhalacerda@gmail.com
        </a>
        <Tippy trigger="click" animation="scale">
          <button @click="copyEmailToClipboard">
            <ClipboardDocumentIcon class="w-4 h-4" />
          </button>
          <template #content> Copiado! </template>
        </Tippy>
      </li>
    </ul>

    <div></div>
  </div>
</template>

<script setup lang="ts">
import { ClipboardDocumentIcon } from "@heroicons/vue/24/outline";
import { Tippy } from "vue-tippy";

definePageMeta({
  layout: "main",
});

useSeoMeta({
  titleTemplate: "%s - Sobre",
  description: "O que se pode saber sobre Gustavo Lacerda.",
});

function copyEmailToClipboard() {
  navigator.clipboard.writeText("gustavocunhalacerda@gmail.com");
}
</script>
