"""Derive editable extrusion contours from the prepared brand artwork.
This analyzes the raster identity; it does not edit or replace that image.
Requires opencv-python-headless and NumPy for regeneration only.
"""
from pathlib import Path
import json
import cv2
import numpy as np

root=Path(__file__).resolve().parent.parent
im=cv2.imread(str(root/'public/brand/fenix13-chill-grill.png'))[:,:,::-1]
r,g,b=[im[:,:,i].astype(float) for i in range(3)]
white=(r>115)&(g>110)&(b>80)&((r-g)<65)&((g-b)<65)
orange=(r>100)&(r>g*1.12)&(r>b*1.25)&~white
cuts=[206,367,530,720,782,945.5,1039,1108.5,1245]
items=[]
for group,top,bottom in [('crest',0,801)]+[(f'glyph{i}',801,965) for i in range(8)]:
 for color,mask in [('ivory',white),('orange',orange)]:
  m=np.zeros(mask.shape,np.uint8);m[top:bottom]=mask[top:bottom]*255
  if group.startswith('glyph'):
   i=int(group[5:]);m[:,:int(cuts[i])]=0;m[:,int(cuts[i+1]):]=0
  contours,hierarchy=cv2.findContours(m,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)
  if hierarchy is None:continue
  hierarchy=hierarchy[0]
  def polygon(c):return cv2.approxPolyDP(c,.85,True).reshape(-1,2).tolist()
  for n,c in enumerate(contours):
   if hierarchy[n][3]!=-1 or cv2.contourArea(c)<45:continue
   holes=[];child=hierarchy[n][2]
   while child!=-1:
    if cv2.contourArea(contours[child])>18:holes.append(polygon(contours[child]))
    child=hierarchy[child][0]
   items.append(dict(group=group,color=color,outer=polygon(c),holes=holes))
(root/'src/logo-geometry.json').write_text(json.dumps(items,separators=(',',':')))
print('Logo extrusion shapes:',len(items))
