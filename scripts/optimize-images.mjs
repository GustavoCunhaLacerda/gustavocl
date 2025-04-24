// Arquivo de otimização de imagens
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Configuração de diretórios
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, 'assets/images');
const optimizedDir = path.join(__dirname, 'public/images');

// Criar diretório de saída se não existir
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Função para otimizar imagens
async function optimizeImages() {
  try {
    // Verificar se o diretório de imagens existe
    if (!fs.existsSync(imagesDir)) {
      console.log('Diretório de imagens não encontrado. Pulando otimização de imagens.');
      return;
    }

    const files = fs.readdirSync(imagesDir);
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
        const inputPath = path.join(imagesDir, file);
        const outputPath = path.join(optimizedDir, file);
        
        console.log(`Otimizando: ${file}`);
        
        // Otimizar imagem com sharp
        await sharp(inputPath)
          .resize(1200, null, { withoutEnlargement: true }) // Redimensionar para largura máxima de 1200px
          .webp({ quality: 80 }) // Converter para WebP com qualidade 80%
          .toFile(outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
        
        console.log(`Imagem otimizada: ${file} -> ${file.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`);
      }
    }
    
    console.log('Otimização de imagens concluída!');
  } catch (error) {
    console.error('Erro ao otimizar imagens:', error);
  }
}

// Executar otimização
optimizeImages();
