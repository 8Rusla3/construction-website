#!/usr/bin/env bash
set -euo pipefail

# Generate responsive WebP variants (480, 800, 1200 widths)
# Requires: ImageMagick (convert) and cwebp

mkdir -p images/responsive

for src in images/*.jpg; do
  # skip thumbnails
  if [[ "$src" == images/thumbs/* ]]; then
    continue
  fi
  filename=$(basename "$src")
  name="${filename%.*}"

  for w in 480 800 1200; do
    out="images/responsive/${name}-${w}.webp"
    if [[ -f "$out" ]]; then
      echo "Skipping existing $out"
      continue
    fi
    echo "Creating $out"
    # Resize and write WebP using ImageMagick
    convert "$src" -resize ${w}x -quality 85 "$out"
  done
done

echo "Responsive WebP variants created in images/responsive/"