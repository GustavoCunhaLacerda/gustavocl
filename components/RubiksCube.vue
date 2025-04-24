<template>
  <div class="rubiks-cube-container" @click="toggleCube">
    <div class="rubiks-cube" ref="cubeRef">
      <div v-for="(face, index) in faces" :key="index" 
           :class="['cube-face', face.class]"
           :style="{ backgroundColor: face.color }">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';

const cubeRef = ref(null);
const isAnimating = ref(false);
const rotationCount = ref(0);

// Cores do cubo mágico
const faces = [
  { class: 'front', color: '#ff0000' },  // Vermelho
  { class: 'back', color: '#ff8000' },   // Laranja
  { class: 'top', color: '#ffffff' },    // Branco
  { class: 'bottom', color: '#ffff00' }, // Amarelo
  { class: 'left', color: '#00ff00' },   // Verde
  { class: 'right', color: '#0000ff' }   // Azul
];

// Função para animar o cubo quando clicado
const toggleCube = () => {
  if (isAnimating.value) return;
  
  isAnimating.value = true;
  rotationCount.value++;
  
  // Sequência de animação diferente baseada no número de cliques
  const sequence = rotationCount.value % 4;
  
  switch(sequence) {
    case 1:
      // Rotação no eixo Y
      gsap.to(cubeRef.value, {
        rotationY: '+=90',
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => { isAnimating.value = false; }
      });
      break;
    case 2:
      // Rotação no eixo X
      gsap.to(cubeRef.value, {
        rotationX: '+=90',
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => { isAnimating.value = false; }
      });
      break;
    case 3:
      // Rotação no eixo Z
      gsap.to(cubeRef.value, {
        rotationZ: '+=90',
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => { isAnimating.value = false; }
      });
      break;
    case 0:
      // Sequência especial após 4 cliques
      gsap.timeline()
        .to(cubeRef.value, {
          rotationY: '+=180',
          duration: 0.6,
          ease: 'power2.inOut'
        })
        .to(cubeRef.value, {
          rotationX: '+=180',
          duration: 0.6,
          ease: 'power2.inOut'
        })
        .to(cubeRef.value, {
          rotationZ: '+=180',
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => { 
            isAnimating.value = false;
            // Easter egg após completar a sequência
            if (rotationCount.value % 12 === 0) {
              showEasterEgg();
            }
          }
        });
      break;
  }
};

// Easter egg especial após completar uma sequência completa
const showEasterEgg = () => {
  // Criar um elemento temporário com uma mensagem ou animação
  const message = document.createElement('div');
  message.textContent = "Você resolveu o cubo! 🧩";
  message.style.position = 'fixed';
  message.style.bottom = '70px';
  message.style.right = '20px';
  message.style.backgroundColor = 'rgba(0, 217, 255, 0.2)';
  message.style.color = '#00d9ff';
  message.style.padding = '10px 15px';
  message.style.borderRadius = '5px';
  message.style.fontFamily = 'var(--font-mono)';
  message.style.zIndex = '100';
  message.style.opacity = '0';
  
  document.body.appendChild(message);
  
  // Animar a mensagem
  gsap.to(message, {
    opacity: 1,
    y: -10,
    duration: 0.5,
    onComplete: () => {
      setTimeout(() => {
        gsap.to(message, {
          opacity: 0,
          y: 10,
          duration: 0.5,
          onComplete: () => {
            document.body.removeChild(message);
          }
        });
      }, 3000);
    }
  });
};

onMounted(() => {
  // Inicializar o cubo com uma rotação aleatória
  gsap.set(cubeRef.value, {
    rotationX: Math.random() * 360,
    rotationY: Math.random() * 360
  });
});
</script>

<style scoped>
.rubiks-cube-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  perspective: 400px;
  z-index: 100;
  cursor: pointer;
}

.rubiks-cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.2s ease;
}

.rubiks-cube:hover {
  transform: scale(1.2);
}

.cube-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}

.front {
  transform: translateZ(20px);
}

.back {
  transform: rotateY(180deg) translateZ(20px);
}

.top {
  transform: rotateX(90deg) translateZ(20px);
}

.bottom {
  transform: rotateX(-90deg) translateZ(20px);
}

.left {
  transform: rotateY(-90deg) translateZ(20px);
}

.right {
  transform: rotateY(90deg) translateZ(20px);
}
</style>
