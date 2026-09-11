import urllib.request
import re
import json
from html import unescape

req = urllib.request.Request(
    'https://gspinvest.com/products',
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# Extract all img + h + p blocks
cards = re.findall(r'<div[^>]*data-aid=\"PRODUCT_ITEM_CONTAINER_RENDERED\"[^>]*>(.*?)</div>\s*</div>', html, re.DOTALL)
if not cards:
    # Generic block split
    cards = re.findall(r'<div[^>]*class=\"[^\"]*c1-[^\"]*\"[^>]*>(.*?)</div>', html, re.DOTALL)

headings = re.findall(r'<h[2-5][^>]*>(.*?)</h[2-5]>', html, re.DOTALL)

products = []
for h in headings:
    name = unescape(re.sub(r'<[^>]+>', '', h).strip())
    if name and name not in ['Products', 'Unlisted Shares', 'This website uses cookies.', 'Contact Us', 'Navigation', 'About Us', 'GSP Investment Private Limited', 'All Rights Reserved']:
        if name not in products:
            products.append(name)

print(f'Total Products Extracted: {len(products)}')
with open('extracted_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

for i, p in enumerate(products, 1):
    print(f'{i}. {p}')
