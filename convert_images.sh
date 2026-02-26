#!/usr/bin/env bash
# Helper: convert JPG images in images/ to WebP and create thumbnails.
# Usage: ./convert_images.sh

set -e
IMG_DIR="images"
THUMB_DIR="$IMG_DIR/thumbs"
mkdir -p "$THUMB_DIR"

# Check for cwebp or fallback to ImageMagick 'convert'
if command -v cwebp >/dev/null 2>&1; then
  CONVERTER="cwebp"
elif command -v convert >/dev/null 2>&1; then
  CONVERTER="convert"
else
  echo "No image converter found. Install 'cwebp' (libwebp) or ImageMagick 'convert'."
  exit 1
fi

for img in "$IMG_DIR"/*.jpg; do
  [ -e "$img" ] || continue
  base=$(basename "$img" .jpg)
  webp="$IMG_DIR/$base.webp"
  thumb="$THUMB_DIR/${base}-thumb.jpg"

  if [ "$CONVERTER" = "cwebp" ]; then
    echo "Converting $img -> $webp"
    cwebp -q 80 "$img" -o "$webp"
    echo "Creating thumbnail $thumb"
    cwebp -q 70 -resize 400 0 "$img" -o "$IMG_DIR/tmp-thumb.webp"
    # convert tmp-thumb.webp to jpg if convert exists
    if command -v convert >/dev/null 2>&1; then
      convert "$IMG_DIR/tmp-thumb.webp" "$thumb"
      rm "$IMG_DIR/tmp-thumb.webp"
    else
      # move as webp thumbnail
      mv "$IMG_DIR/tmp-thumb.webp" "$THUMB_DIR/${base}-thumb.webp"
    fi
  else
    echo "Converting $img -> $webp (via convert)"
    convert "$img" -quality 80 "$webp"
    echo "Creating thumbnail $thumb"
    convert "$img" -resize 400 "$thumb"
  fi
done

echo "Done. WebP files in $IMG_DIR and thumbnails in $THUMB_DIR"
