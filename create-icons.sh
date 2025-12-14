#!/bin/bash

# Simple script to create placeholder icons for the Chrome extension
# Requires ImageMagick (install with: brew install imagemagick on Mac)

cd "$(dirname "$0")/icons"

echo "Creating extension icons..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed."
    echo "Install it with: brew install imagemagick (Mac) or sudo apt-get install imagemagick (Linux)"
    exit 1
fi

# Create 128x128 icon
convert -size 128x128 \
    xc:none \
    -draw "fill #667eea roundrectangle 0,0,128,128,20,20" \
    -gravity center \
    -pointsize 72 \
    -fill white \
    -font Arial-Bold \
    -annotate +0+0 "UH" \
    icon128.png

# Create 48x48 icon
convert icon128.png -resize 48x48 icon48.png

# Create 16x16 icon
convert icon128.png -resize 16x16 icon16.png

echo "✓ Icons created successfully!"
echo "  - icon16.png (16x16)"
echo "  - icon48.png (48x48)"
echo "  - icon128.png (128x128)"

