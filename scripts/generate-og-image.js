/* eslint-env node */
/* global Buffer, console, process */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT_PATH = join(__dirname, '../public/og-image.png');
const LOGO_PATH = join(__dirname, '../public/xclusive-website-logo.png');

async function generateOgImage() {
  try {
    // Read logo
    const logoBuffer = readFileSync(LOGO_PATH);
    const logoMetadata = await sharp(logoBuffer).metadata();

    // Calculate logo size (scale to fit nicely in center)
    const logoScale = 0.6; // 60% of canvas width
    const logoWidth = Math.floor(WIDTH * logoScale);
    const logoHeight = Math.floor((logoWidth / logoMetadata.width) * logoMetadata.height);

    // Create SVG for gradient background
    const gradientSvg = `
      <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1890ff;stop-opacity:1" />
            <stop offset="16%" style="stop-color:#096dd9;stop-opacity:1" />
            <stop offset="33%" style="stop-color:#722ed1;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#eb2f96;stop-opacity:1" />
            <stop offset="66%" style="stop-color:#fa541c;stop-opacity:1" />
            <stop offset="83%" style="stop-color:#fa8c16;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#fadb14;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradient)"/>
      </svg>
    `;

    // Create main image with gradient background (layer 1: bottom)
    const image = sharp(Buffer.from(gradientSvg))
      .resize(WIDTH, HEIGHT);

    // Create dark overlay SVG (layer 2: middle)
    const overlaySvg = `
      <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.25)"/>
      </svg>
    `;
    const overlayBuffer = Buffer.from(overlaySvg);

    // Composite logo in center
    const logoX = Math.floor((WIDTH - logoWidth) / 2);
    const logoY = Math.floor((HEIGHT - logoHeight) / 2) - 80; // Offset up a bit for text below

    const logoResized = await sharp(logoBuffer)
      .resize(logoWidth, logoHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    // Create text SVG for tagline
    const textY = logoY + logoHeight + 60;
    const taglineSvg = `
      <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <text
          x="50%"
          y="${textY}"
          font-family="system-ui, -apple-system, sans-serif"
          font-size="48"
          font-weight="600"
          fill="white"
          text-anchor="middle"
        >Professional Wallet Tools</text>
        <text
          x="50%"
          y="${textY + 60}"
          font-family="system-ui, -apple-system, sans-serif"
          font-size="32"
          font-weight="400"
          fill="rgba(255, 255, 255, 0.95)"
          text-anchor="middle"
        >Mnemonic • EVM • Cosmos SDK • RPC Tester • Encryption</text>
      </svg>
    `;
    const textBuffer = Buffer.from(taglineSvg);

    // Composite everything together in correct order:
    // 1. Background gradient (already in image)
    // 2. Dark overlay (middle layer)
    // 3. Logo (top layer)
    // 4. Text (top layer)
    await image
      .composite([
        {
          input: overlayBuffer,
          left: 0,
          top: 0
        },
        {
          input: logoResized,
          left: logoX,
          top: logoY
        },
        {
          input: textBuffer,
          left: 0,
          top: 0
        }
      ])
      .png()
      .toFile(OUTPUT_PATH);

    console.log('✅ OG image generated successfully!');
    console.log(`📁 Output: ${OUTPUT_PATH}`);
    console.log(`📐 Size: ${WIDTH}x${HEIGHT}px`);
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    process.exit(1);
  }
}

generateOgImage();

