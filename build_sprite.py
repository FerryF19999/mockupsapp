"""Build a self-hosted subset of Lucide icons used by the Nemu prototype."""
from pathlib import Path
from xml.etree import ElementTree as ET

assets = Path(__file__).parent / 'assets'
icons = {
    'bag':'shopping-bag','food':'utensils','camera':'camera','leaf':'leaf',
    'chat':'message-circle','search':'search','pin':'map-pin','heart':'heart',
    'spark':'sparkles','user':'user','edit':'pencil','send':'send','close':'x',
    'back':'chevron-left','tag':'tag','phone':'smartphone','shirt':'shirt',
    'house':'house','headphones':'headphones','pot':'cooking-pot',
    'drumstick':'drumstick','soup':'soup','coffee':'coffee',
}
symbols=[]
for symbol_id, filename in icons.items():
    root=ET.parse(assets/(filename+'.svg')).getroot()
    children=''.join(ET.tostring(child,encoding='unicode') for child in root)
    view=root.attrib.get('viewBox','0 0 24 24')
    symbols.append(f'<symbol id="{symbol_id}" viewBox="{view}">{children}</symbol>')
doc='<svg xmlns="http://www.w3.org/2000/svg" style="display:none" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+''.join(symbols)+'</svg>'
(assets/'sprite.svg').write_text(doc,encoding='utf-8')
