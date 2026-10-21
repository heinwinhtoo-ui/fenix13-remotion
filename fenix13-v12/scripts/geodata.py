"""Prepare public-domain Natural Earth vectors for the FENIX geographic sequence.

Source: nvkelso/natural-earth-vector/geojson on GitHub (see ASSETS.md).
World uses 110m outlines; Myanmar, Shan, lakes and roads use genuine 10m data.
This is a regional locator map, not a street map or restaurant-address pin.
"""
from pathlib import Path
import json
import urllib.request



root=Path(__file__).resolve().parent.parent
cache=root/'out/geodata-source'
cache.mkdir(parents=True,exist_ok=True)
def source(name):
    destination=cache/name
    if not destination.exists():
        url='https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'+name
        urllib.request.urlretrieve(url,destination)
    return destination
def load(p):return json.loads(Path(p).read_text())['features']
def compact(f,keys=()):
    return dict(type='Feature',properties={k:f['properties'].get(k) for k in keys},geometry=f['geometry'])
def coords(g):
    def flatten(c):
        if isinstance(c[0],(int,float)):yield c
        else:
            for part in c:yield from flatten(part)
    return flatten(g['coordinates'])
def intersects(f,bbox):
    x0,y0,x1,y1=bbox
    return any(x0<=p[0]<=x1 and y0<=p[1]<=y1 for p in coords(f['geometry']))
world=[compact(f,['ADMIN','ISO_A3']) for f in load(root/'public/geo/world.geojson')]
countries=load(source('ne_10m_admin_0_countries.geojson'))
myanmar=next(compact(f,['ADMIN']) for f in countries if f['properties'].get('ADMIN')=='Myanmar')
states=[compact(f,['name']) for f in load(source('ne_10m_admin_1_states_provinces.geojson')) if f['properties'].get('admin')=='Myanmar']
lakes=[compact(f,['name']) for f in load(source('ne_10m_lakes.geojson')) if intersects(f,[96.2,20,98,21.8])]
roads=[]
for f in load(source('ne_10m_roads.geojson')):
    if not intersects(f,[96.25,20.15,97.85,21.55]):continue
    if f['geometry']['type']!='LineString':continue
    pts=[p for p in f['geometry']['coordinates'] if 95.8<p[0]<98.3 and 19.8<p[1]<22]
    if len(pts)>1:roads.append(dict(type='Feature',properties={},geometry=dict(type='LineString',coordinates=pts)))
places=[compact(f,['NAME']) for f in load(source('ne_10m_populated_places.geojson')) if intersects(f,[95.8,19.8,98,21.8])]
taunggyi=next(f['geometry']['coordinates'] for f in places if f['properties']['NAME']=='Taunggyi')
result=dict(world=world,myanmar=myanmar,states=states,lakes=lakes,roads=roads,places=places,taunggyi=taunggyi,
            attribution='Map data: Natural Earth / public domain',map_type='Taunggyi regional locator; city pin, not venue address')
(root/'src/geodata.json').write_text(json.dumps(result,separators=(',',':')))
print(f'Prepared {len(world)} world countries, Myanmar, {len(states)} states, {len(roads)} regional road lines, {len(lakes)} lakes.')
print('Taunggyi:',taunggyi)
