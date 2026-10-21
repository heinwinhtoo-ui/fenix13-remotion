"""Analyze the supplied wordmark into extrusion polygons; never modify the JPEG."""
from pathlib import Path
import json,cv2,numpy as np
r=Path(__file__).resolve().parent.parent
im=cv2.imread(str(r/'public/brand/FENIX13_OFFICIAL_CREAM.jpg'))
mask=(np.max(im,axis=2)<180).astype(np.uint8)*255
mask[:665]=0;mask[794:]=0
active=np.where(np.sum(mask>0,axis=0)>6)[0]
runs=[]
for x in active:
 if not runs or x-runs[-1][-1]>3:runs.append([int(x)])
 else:runs[-1].append(int(x))
assert len(runs)==8,[(a[0],a[-1]) for a in runs]
items=[]
for group,xs in enumerate(runs):
 m=mask.copy();m[:,:xs[0]]=0;m[:,xs[-1]+1:]=0
 contours,hierarchy=cv2.findContours(m,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)
 def poly(c):return cv2.approxPolyDP(c,.45,True).reshape(-1,2).tolist()
 for n,c in enumerate(contours):
  if hierarchy[0][n][3]!=-1 or cv2.contourArea(c)<25:continue
  holes=[];child=hierarchy[0][n][2]
  while child!=-1:
   if cv2.contourArea(contours[child])>20:holes.append(poly(contours[child]))
   child=hierarchy[0][child][0]
  items.append(dict(glyph=group,cx=(xs[0]+xs[-1])/2,cy=730,outer=poly(c),holes=holes))
(r/'src/wordmark-geometry.json').write_text(json.dumps(items,separators=(',',':'))+'\n')
print('8 glyphs:',[(x[0],x[-1]) for x in runs],'; extruded polygons:',len(items))
