# Tile rendered frames into one contact sheet: python3 scripts/sheet.py <dir> <out.png> [cols]
import sys, glob, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
fs = sorted(glob.glob(os.path.join(d, 't*.png')), key=lambda f: float(os.path.basename(f)[1:-4]))
ims = [Image.open(f).convert('RGB') for f in fs]
w, h = ims[0].size
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (w * cols, h * rows), 'white')
dr = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = (i % cols) * w, (i // cols) * h
    sheet.paste(im, (x, y))
    dr.rectangle([x, y, x + 70, y + 22], fill='black')
    dr.text((x + 4, y + 4), os.path.basename(f)[1:-4] + 's', fill='white')
sheet.save(out)
print(out, sheet.size)
