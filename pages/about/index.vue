<template>
  <div class="flex flex-col gap-5 py-5">
    <h1 class="text-lg text-blue-950 font-semibold">Sobre Mim</h1>
    <ul class="list-disc pl-10">
      <li><strong>Nome completo:</strong> Gustavo Cunha Lacerda</li>
      <li><strong>Local:</strong> Brasília, Brasil</li>
      <li>
        <strong>Profisionalmente:</strong> Desenvolvedor Frontend @ Medware
        Sistemas Médicos
      </li>
      <li>
        <strong>Casualmente:</strong> Live coding, hyperpop, cultura clubber
      </li>
      <li><strong>Pronomes:</strong> ele/dele</li>
      <li class="flex gap-1 items-center">
        <strong>Contato:</strong> gustavocunhalacerda@gmail.com
        <Tippy trigger="click" animation="scale">
          <button @click="copyEmailToClipboard">
            <ClipboardDocumentIcon class="w-4 h-4" />
          </button>

          <template #content> Copiado! </template>
        </Tippy>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ClipboardDocumentIcon } from "@heroicons/vue/24/outline";
import { Tippy } from "vue-tippy";

definePageMeta({
  layout: "main",
});

async function copyEmailToClipboard() {
  await navigator.clipboard.writeText("gustavocunhalacerda@gmail.com");
}
</script>
