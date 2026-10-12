#!/usr/bin/env bash
# Usage: ./scripts/make-frames.sh path/to/video.mp4
# Rebuilds public/frames/hd (1920px) and public/frames/sd (1280px) at 15 fps.
# After running, set FRAME_COUNT in src/components/Scene.tsx to the number printed.
set -euo pipefail
VIDEO="${1:?Pass the video path}"
rm -rf public/frames && mkdir -p public/frames/hd public/frames/sd
ffmpeg -v error -y -i "$VIDEO" -an -vf "fps=15,scale=1920:-2:flags=lanczos,unsharp=5:5:0.7:5:5:0.0" \
  -c:v libwebp -quality 76 -compression_level 6 public/frames/hd/%04d.webp
ffmpeg -v error -y -i "$VIDEO" -an -vf "fps=15,scale=1280:-2:flags=lanczos,unsharp=5:5:0.6:5:5:0.0" \
  -c:v libwebp -quality 76 -compression_level 6 public/frames/sd/%04d.webp
echo "FRAME_COUNT = $(ls public/frames/hd | wc -l)"

# v19: the site ships a condensed 80-frame cut (every 2nd frame while the lid opens/closes, every 8th while the
# movement is on show). To rebuild it from the full sequence keep indices: 0-58 step 2, 60-172 step 8, 180-246 step 2, 247.
