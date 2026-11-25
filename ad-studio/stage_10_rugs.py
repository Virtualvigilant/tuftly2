import os
from PIL import Image, ImageFilter

dl = r'C:\Users\Blessing Orodi\Downloads'
dst = r'c:\Users\Blessing Orodi\Desktop\tuftly2\ad-studio\public\status-rugs'
os.makedirs(dst, exist_ok=True)

patterns = [
    'TARA ROOM',
    'Manchester United Rug',
    'Pink Abstract Wavy carpet',
    'Your search for the pe',
    'Modern Wavy Green Hand Tufted Rug',
    'download (1).jpg',
    'alfombra sobre cristo.jpg',
    'BoujeeSzn.jpg',
    'Felpudo original.jpg',
    'download.jpg',
]

all_files = os.listdir(dl)
for idx, pat in enumerate(patterns, start=1):
    exact = [f for f in all_files if f.lower() == pat.lower()]
    fname = exact[0] if exact else [f for f in all_files if pat.lower() in f.lower()][0]
    im = Image.open(os.path.join(dl, fname)).convert('RGB')

    out_file = os.path.join(dst, f'rug-{idx:02d}.jpg')
    im.save(out_file, quality=95)
    print(f'Staged rug-{idx:02d}.jpg ({im.width}x{im.height})')
