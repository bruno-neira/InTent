import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple SVG icon for the extension
const iconSvg = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="20" fill="#0077B5"/>
  <text x="64" y="80" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">IL</text>
</svg>
`;

// Convert SVG to different sizes
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const scaledSvg = iconSvg.replace('width="128"', `width="${size}"`).replace('height="128"', `height="${size}"`);
  const iconPath = path.join(__dirname, '..', 'icons', `icon${size}.png`);
  
  // For now, we'll create a simple text file as placeholder
  // In a real implementation, you'd use a library like sharp to convert SVG to PNG
  fs.writeFileSync(iconPath.replace('.png', '.svg'), scaledSvg);
  console.log(`Created icon${size}.svg`);
});

console.log('Icon generation complete! Note: These are SVG placeholders. For production, convert to PNG.'); 