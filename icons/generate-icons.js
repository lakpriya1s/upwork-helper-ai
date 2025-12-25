#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const sizes = [16, 48, 128];
const svgPath = path.join(__dirname, 'icon.svg');
const outputDir = __dirname;

async function generateIcons() {
  console.log('🎨 Generating PNG icons from SVG...\n');
  
  // Read SVG file
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  
  // Create a data URL from SVG
  const svgDataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');
  
  for (const size of sizes) {
    try {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Load the SVG image
      const image = await loadImage(svgDataUrl);
      
      // Draw the image on canvas
      ctx.drawImage(image, 0, 0, size, size);
      
      // Save to PNG
      const outputPath = path.join(outputDir, `icon${size}.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`✅ Generated icon${size}.png (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Error generating ${size}x${size} icon:`, error.message);
    }
  }
  
  console.log('\n🎉 Icon generation complete!');
}

generateIcons().catch(console.error);
