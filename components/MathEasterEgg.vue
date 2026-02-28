<template>
  <div>
    <div 
      v-for="(formula, index) in mathFormulas" 
      :key="index" 
      class="math-easter-egg"
      :style="getRandomPosition()"
      @mouseover="revealFormula(index)">
      {{ formula.hidden ? '?' : formula.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Fórmulas matemáticas para easter eggs
const mathFormulas = ref([
  { text: 'e^{iπ} + 1 = 0', hidden: true },
  { text: '∫_{0}^{∞} e^{-x^2} dx = \\frac{\\sqrt{π}}{2}', hidden: true },
  { text: 'F_{n} = F_{n-1} + F_{n-2}', hidden: true },
  { text: '\\sum_{n=1}^{∞} \\frac{1}{n^2} = \\frac{π^2}{6}', hidden: true },
  { text: '\\lim_{n \\to ∞} (1 + \\frac{1}{n})^n = e', hidden: true },
  { text: 'a^2 + b^2 = c^2', hidden: true },
  { text: '\\nabla \\times \\vec{E} = -\\frac{∂\\vec{B}}{∂t}', hidden: true },
  { text: 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}', hidden: true }
]);

// Revelar fórmula ao passar o mouse
const revealFormula = (index) => {
  mathFormulas.value[index].hidden = false;
};

// Gerar posição aleatória para cada fórmula
const getRandomPosition = () => {
  const x = Math.random() * 80 + 10; // 10% a 90% da largura
  const y = Math.random() * 80 + 10; // 10% a 90% da altura
  const rotation = Math.random() * 40 - 20; // -20° a 20°
  const size = Math.random() * 0.5 + 0.8; // 0.8 a 1.3 do tamanho original
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: `rotate(${rotation}deg) scale(${size})`,
    fontSize: `${Math.random() * 0.5 + 0.8}rem`
  };
};

// Adicionar evento de teclado para revelar todas as fórmulas com uma combinação secreta
let keySequence = '';
const secretCode = 'math';

const handleKeydown = (e) => {
  keySequence += e.key.toLowerCase();
  keySequence = keySequence.slice(-4); // Manter apenas os últimos 4 caracteres
  
  if (keySequence === secretCode) {
    mathFormulas.value.forEach(formula => {
      formula.hidden = false;
    });
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>
