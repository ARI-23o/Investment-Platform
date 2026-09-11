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

# Extract structured cards
# In GoDaddy website builder, product blocks have images, title, price, description
# Let us search for sections or text surrounding each product name
with open('extracted_products.json', 'r', encoding='utf-8') as f:
    products_names = json.load(f)

extracted_data = []

# Pattern to search for each product in html and find surrounding text, price, image
for name in products_names:
    escaped_name = re.escape(name)
    pattern = rf'(<img[^>]+src=[\"\']([^\"\']+)[\"\'][^>]*>)?.*?{escaped_name}(.*?)(?=<h[2-5]|\Z)'
    match = re.search(pattern, html, re.DOTALL | re.IGNORECASE)
    
    img_url = ''
    desc = ''
    price = ''
    
    # Try another approach: search by name window
    idx = html.find(name)
    if idx != -1:
        snippet = html[max(0, idx-500):min(len(html), idx+800)]
        # Find img src in snippet
        img_match = re.search(r'<img[^>]+src=[\"\']([^\"\']+)[\"\']', snippet)
        if img_match:
            img_url = img_match.group(1)
            if img_url.startswith('//'):
                img_url = 'https:' + img_url
        
        # Find price or rupee
        price_match = re.search(r'(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d+)?)', snippet)
        if price_match:
            price = price_match.group(1).replace(',', '')
            
        # Extract text snippets
        clean_text = re.sub(r'<[^>]+>', ' ', snippet)
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        desc = clean_text

    extracted_data.append({
        'name': name,
        'image': img_url,
        'price': price,
        'snippet': desc[:200]
    })

print(f'Extracted structured details for {len(extracted_data)} products.')
with open('all_gspinvest_products.json', 'w', encoding='utf-8') as f:
    json.dump(extracted_data, f, indent=2, ensure_ascii=False)

for p in extracted_data[:10]:
    print(p['name'], '--> Image:', bool(p['image']), '--> Price:', p['price'])
