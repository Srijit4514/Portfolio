"""
Zoom / crop an existing image (`final.png`) to isolate the central logo and
export a cleaned, centered PNG suitable for favicons and logos.

Behavior:
 - If `final.png` has transparency, crop to the bounding box of non-transparent pixels.
 - Otherwise, estimate the background color by sampling the image corners and
   create a mask of pixels that differ from the background (color distance).
 - If the mask yields a content bbox, crop to it; otherwise fall back to a center
   square crop with a configurable zoom factor.
 - The cropped content is fit onto a square transparent canvas and saved in
   multiple sizes: final-logo.png (512x512), favicon-16x16.png, 32x32, 48x48, 180x180.

Requirements:
 - Python 3.8+
 - Pillow (pip install pillow)

Usage:
    python3 scripts/zoom_logo.py path/to/final.png output_dir/

Notes:
 - The script preserves original logo colors and does not add effects.
 - If the automatic crop doesn't match your expectation, adjust the `ZOOM_FACTOR`
   or run a manual crop in an image editor.
"""

import sys
import os
from PIL import Image, ImageStat
import math

# Config
OUTPUT_SIZES = [512, 180, 48, 32, 16]
DEFAULT_OUTPUT_NAME = 'final-logo.png'
ZOOM_FACTOR = 0.85  # fraction of min(image_width, image_height) to use for center crop fallback
COLOR_DIFF_THRESHOLD = 20  # color distance threshold to detect non-background pixels


def color_distance(c1, c2):
    return math.sqrt(sum((a-b)**2 for a,b in zip(c1, c2)))


def estimate_background_color(img: Image.Image):
    w,h = img.size
    # sample corners (10x10 pixels) and average
    samples = []
    box_size = max(1, int(min(w,h) * 0.03))
    corners = [ (0,0,box_size,box_size), (w-box_size,0,w,box_size), (0,h-box_size,box_size,h), (w-box_size,h-box_size,w,h) ]
    for box in corners:
        crop = img.crop(box).convert('RGB')
        stat = ImageStat.Stat(crop)
        samples.append(tuple(map(int, stat.mean)))
    # return average
    avg = tuple(int(sum(c[i] for c in samples)/len(samples)) for i in range(3))
    return avg


def bbox_from_mask(mask):
    # mask: L mode (0..255)
    bbox = mask.getbbox()
    return bbox


def auto_crop(img: Image.Image):
    """Attempt to crop to content.
    Returns cropped image.
    """
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    w,h = img.size

    # If alpha channel present with transparency, use it
    alpha = img.split()[-1]
    if alpha.getextrema()[0] < 255:
        bbox = alpha.getbbox()
        if bbox:
            return img.crop(bbox)

    # Otherwise estimate background color and build mask
    rgb = img.convert('RGB')
    bg = estimate_background_color(rgb)
    # build mask where pixels differ from bg by threshold
    mask = Image.new('L', (w,h), 0)
    pixels = rgb.load()
    mpx = mask.load()
    for y in range(h):
        for x in range(w):
            if color_distance(pixels[x,y], bg) > COLOR_DIFF_THRESHOLD:
                mpx[x,y] = 255
    bbox = bbox_from_mask(mask)
    if bbox:
        return img.crop(bbox)

    # fallback: center square crop (zoom)
    min_dim = min(w,h)
    side = int(min_dim * ZOOM_FACTOR)
    left = max(0, (w - side)//2)
    upper = max(0, (h - side)//2)
    return img.crop((left, upper, left+side, upper+side))


def fit_on_square_canvas(img: Image.Image, size: int) -> Image.Image:
    img = img.convert('RGBA')
    w,h = img.size
    # scale to fit the target size while preserving aspect ratio
    scale = min(size / w, size / h)
    new_w = max(1, int(w * scale))
    new_h = max(1, int(h * scale))
    resized = img.resize((new_w, new_h), Image.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0,0,0,0))
    offset = ((size - new_w)//2, (size - new_h)//2)
    canvas.paste(resized, offset, resized)
    return canvas


def generate(source_path: str, out_dir: str):
    if not os.path.isfile(source_path):
        print('Source not found:', source_path)
        return
    os.makedirs(out_dir, exist_ok=True)
    img = Image.open(source_path)
    print('Source image size:', img.size, 'mode:', img.mode)

    cropped = auto_crop(img)
    print('Cropped size:', cropped.size)

    # Save a large final logo
    final_logo_path = os.path.join(out_dir, DEFAULT_OUTPUT_NAME)
    final_large = fit_on_square_canvas(cropped, OUTPUT_SIZES[0])
    final_large.save(final_logo_path)
    print('Saved:', final_logo_path)

    # Save smaller sizes
    for s in OUTPUT_SIZES[1:]:
        out_path = os.path.join(out_dir, f'favicon-{s}x{s}.png')
        out_img = fit_on_square_canvas(cropped, s)
        out_img.save(out_path)
        print(f"Saved: {out_path}")

    print('All favicons generated. You can also create a combined favicon.ico with ImageMagick:')
    print('convert favicon-16x16.png favicon-32x32.png favicon-48x48.png -colors 256 favicon.ico')


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: python3 scripts/zoom_logo.py path/to/final.png output_dir')
        sys.exit(1)
    src = sys.argv[1]
    out = sys.argv[2]
    generate(src, out)
