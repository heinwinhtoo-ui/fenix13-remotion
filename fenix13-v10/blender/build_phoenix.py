"""FENIX V10: full volumetric feather meshes, articulated skeleton, authored flight.
Run: blender -b --python blender/build_phoenix.py
Coordinates: Y up, Z toward camera; exporter converts to glTF conventions.
"""
import bpy, math, random, json
from mathutils import Vector
from pathlib import Path
R=Path(__file__).resolve().parent.parent
random.seed(13)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)

def material(name,col,rough=.5,metal=.03,emission=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*col,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*col,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 p.inputs['Emission Color'].default_value=(*col,1);p.inputs['Emission Strength'].default_value=emission
 return m
ivory=material('Ivory keratin',(0.90,.78,.58),.48)
feathermat=material('Ivory vanes with amber tips',(1,1,1),.47)
node=feathermat.node_tree.nodes.new('ShaderNodeVertexColor');node.layer_name='Color'
feathermat.node_tree.links.new(node.outputs['Color'],feathermat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
fire=material('Controlled ember tips',(1,.20,.018),.43,.03,.65)
beakmat=material('Warm horn',(0.48,.40,.27),.29,.05)
black=material('Eye and talon obsidian',(.008,.006,.004),.19,.02)
iris=material('Amber iris',(.8,.22,.012),.22,.1,.6)
objects=[]

def mesh(name,verts,faces,mat,bone,uvs=None,cols=None):
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update()
 ob=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(ob);ob.data.materials.append(mat)
 for p in me.polygons:p.use_smooth=True
 if uvs:
  uv=me.uv_layers.new(name='UVMap')
  for p in me.polygons:
   for li in p.loop_indices:uv.data[li].uv=uvs[me.loops[li].vertex_index]
 if cols:
  attr=me.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='POINT')
  for i,c in enumerate(cols):attr.data[i].color=(*c,1)
 g=ob.vertex_groups.new(name=bone);g.add(list(range(len(verts))),1,'REPLACE');objects.append(ob)
 return ob

def egg(name,p,s,bone,mat=ivory):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,location=p)
 ob=bpy.context.object;ob.name=name;ob.scale=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 ob.data.materials.append(mat)
 for f in ob.data.polygons:f.use_smooth=True
 g=ob.vertex_groups.new(name=bone);g.add(list(range(len(ob.data.vertices))),1,'REPLACE');objects.append(ob);return ob

def feather(name,a,b,width,bone,tip=True,bow=.08,twist=0,normal=(0,0,1)):
 a,b=Vector(a),Vector(b);d=b-a;n=Vector(normal).normalized();side=d.cross(n).normalized();verts=[];uv=[];cols=[];faces=[];N=24;W=6
 if name.startswith("Fine down"):N=5;W=2
 elif name.startswith(("Contour","Neck","Covert")):N=10;W=4
 for j in range(N+1):
  u=j/N;c=a+d*u+n*(math.sin(u*math.pi)*bow)
  if name.startswith('Tail'):c.x+=math.sin(u*math.pi)*(-.42+width)+math.sin(u*math.pi*2)*.10
  w=width*(math.sin(math.pi*u)**.65)*(.7+.3*u)
  for k in range(W+1):
   q=k/W*2-1
   p=c+side*q*w+n*((1-q*q)*width*.18+math.sin(u*math.pi*42+abs(q)*3)*.0025*abs(q)+q*twist*u)
   verts.append(tuple(p));uv.append(((q+1)/2,u))
   heat=max(0,min(1,(u-.48)/.52)) if tip else 0
   base=(.78,.69,.55);end=(1,.065,.003)
   # Thin dark rachis and etched vane ribs remain physical feather material.
   shade=1-.09*(1-abs(q))**20
   cols.append(tuple((base[z]*(1-heat)+end[z]*heat)*shade for z in range(3)))
 for j in range(N):
  for k in range(W):
   i=j*(W+1)+k;faces.append((i,i+1,i+W+2,i+W+1))
 ob=mesh(name,verts,faces,feathermat,bone,uv,cols)
 # Small geometric thickness; not flat image planes.
 mod=ob.modifiers.new('Keratin thickness','SOLIDIFY');mod.thickness=.007
 bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier=mod.name)
 return ob

# Armature. Bones aligned with anatomical landmarks; disconnected hand/feather
# bones inherit the articulated arm chain while retaining their rest positions.
arm=bpy.data.armatures.new('FENIX_Anatomy');rig=bpy.data.objects.new('FENIX_Articulated_Rig',arm);bpy.context.collection.objects.link(rig)
bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
def bone(n,a,b,parent=None):
 x=arm.edit_bones.new(n);x.head=a;x.tail=b
 if parent:x.parent=arm.edit_bones[parent]
 return x
bone('root',(0,-.5,0),(0,.5,0));bone('chest',(0,-.25,0),(0,.55,0),'root');bone('neck',(0,.5,.08),(.11,.95,.16),'chest');bone('head',(.11,.95,.16),(.25,1.25,.21),'neck')
for side in [-1,1]:bone('gaze'+str(side),(.403,1.066,.17+side*.181),(.403,1.096,.17+side*.181),'head')
for s,label in [(-1,'L'),(1,'R')]:
 bone('shoulder'+label,(s*.3,.38,0),(s*1.25,.75,0),'chest')
 bone('elbow'+label,(s*1.25,.75,0),(s*2.15,.78,0),'shoulder'+label)
 bone('wrist'+label,(s*2.15,.78,0),(s*2.75,1.03,0),'elbow'+label)
 for j in range(10):bone('tip'+label+str(j),(s*2.12,.73,0),(s*(2.5+j*.055),.15+j*.14,0),'wrist'+label)
 bone('leg'+label,(s*.18,-.45,.03),(s*.22,-.95,.12),'root')
for i in range(9):bone('tail'+str(i),((i-4)*.045,-.48,-.13),((i-4)*.16,-1.7,-.23),'root')
bpy.ops.object.mode_set(mode='OBJECT');rig.select_set(False)

# Tapered breast, back and abdomen, covered with overlapping small contour feathers.
egg('Breast',(0,.03,0),(.4,.65,.33),'chest');egg('Abdomen',(0,-.35,-.07),(.28,.42,.25),'root')
egg('Neck',(.06,.63,.10),(.18,.38,.19),'neck');egg('Skull',(.14,1.02,.17),(.27,.20,.20),'head')
for row in range(13):
 y=.56-row*.085;ratio=max(.28,math.sqrt(max(.03,1-((y-.05)/.72)**2)))
 for j in range(18):
  a=j/18*math.tau+(row%2)*.17;x=math.cos(a)*.4*ratio;z=math.sin(a)*.33*ratio
  n=(math.cos(a),0,math.sin(a))
  feather('Contour_%02d_%02d'%(row,j),(x,y,z),(x*1.04,y-.19,z*1.04),.048*ratio+.012,'chest',False,.018,normal=n)
for row in range(5):
 for j in range(12):
  a=j/12*math.tau; y=.56+row*.085
  feather('Neck plumage',(math.cos(a)*.185+.07,y,math.sin(a)*.195+.1),(math.cos(a)*.21+.07,y-.16,math.sin(a)*.21+.1),.042,'neck',False,.01,normal=(math.cos(a),0,math.sin(a)))
# Wings: layered coverts, secondaries, independently lagging outer primaries.
for s,label in [(-1,'L'),(1,'R')]:
 # All positions in rest-space. Weight groups provide true 3D articulation.
 mesh('Wing membrane '+label,[(s*.29,.4,-.015),(s*1.3,.79,-.015),(s*2.2,.8,-.02),(s*1.9,.05,-.04),(s*.5,-.05,-.02)],[(0,1,2,3,4)],ivory,'shoulder'+label)
 for j in range(13):
  q=j/12
  feather('Secondary '+label+str(j),(s*(.48+q*1.6),.48+q*.27,.035),(s*(.65+q*1.72),-.6+q*.44,-.04),.11,'shoulder'+label if q<.42 else 'elbow'+label,True,.12)
 for j in range(10):
  q=j/9
  feather('Primary '+label+str(j),(s*(1.98+q*.21),.61+q*.17,.025),(s*(2.26+1.13*math.sin(q*1.45)), -.68+q*2.15,-.13-q*.07),.125+q*.025,'tip'+label+str(j),True,.13,twist=s*.018)
 for row in range(4):
  for j in range(20):
   q=j/19;x=.32+q*2.08;y=.5+q*.26-row*.115;z=.08+row*.012
   feather('Covert '+label+str(row)+'_'+str(j),(s*x,y,z),(s*(x+.21),y-.32,z+.005),.073,'shoulder'+label if q<.42 else 'elbow'+label if q<.82 else 'wrist'+label,False,.025)
 # dark fine talons, never human hands
 egg('Hock '+label,(s*.2,-.66,.12),(.085,.20,.085),'leg'+label,beakmat)
 for j in range(3):
  a=Vector((s*.2+(j-1)*.055,-.81,.15));b=Vector((a.x+(j-1)*.025,-1.02,.26));c=Vector((b.x,-1.08,.34));d=Vector((c.x,-1.0,.39))
  for k,(p,q) in enumerate([(a,b),(b,c),(c,d)]):
   midpoint=(p+q)/2;o=egg('Talons '+label+str(j)+str(k),tuple(midpoint),(.022,(q-p).length/2+.02,.022),'leg'+label,black)
   o.rotation_mode='QUATERNION';o.rotation_quaternion=Vector((0,1,0)).rotation_difference(q-p)
# Nine individual streaming tail feathers, with distinct aerodynamic phase.
for i in range(9):
 q=(i-4)/4;length=3.13-abs(q)*.57+math.sin(i*1.6)*.12
 feather('Tail plume '+str(i),(q*.11,-.44,-.14),(q*.82-.4,-length,-.26+abs(q)*.18),.105-abs(q)*.016,'tail'+str(i),True,.32,twist=q*.08)
# Swept crest and small cheek feathers give a raptor silhouette, not a mascot.
for j in range(7):
 q=j/6
 feather('Crown crest '+str(j),(.04,1.13,.1+(q-.5)*.15),(-.18-q*.31,1.40+q*.13,.11+(q-.5)*.24),.043,'head',True,.035)
for side in [-1,1]:
 for j in range(5):feather('Cheek feather',(.10,1.02-j*.028,.17+side*.15),(-.24-j*.035,.91-j*.025,.17+side*.15),.026,'head',False,.015,normal=(0,0,side))
 egg('Eye socket',(.245,1.065,.17+side*.164),(.048,.026,.019),'head',black)
 egg('Small amber iris',(.403,1.066,.17+side*.181),(.013,.013,.006),'gaze'+str(side),iris)
 egg('Pupil',(.407,1.066,.17+side*.187),(.006,.008,.003),'gaze'+str(side),black)
# Hooked beak defined as an actual closed wedge with a downward hook.
profile=[(.28,1.08),(.45,1.035),(.64,.96),(.61,.83),(.56,.89),(.51,.96),(.29,.975)]
verts=[(x,y,.17+z) for z in [-.066,.066] for x,y in profile];n=len(profile)
faces=[tuple(range(n-1,-1,-1)),tuple(range(n,n*2))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
mesh('Hooked raptor beak',verts,faces,beakmat,'head')

# Fine breast/down plumage breaks up the large contour-feather surface.
for i in range(370):
 y=random.uniform(-.52,.59);a=random.uniform(0,math.tau);r=math.sqrt(max(.05,1-((y-.05)/.73)**2));x=math.cos(a)*(.405*r);z=math.sin(a)*(.34*r)
 feather('Fine down '+str(i),(x,y,z),(x*1.035+random.uniform(-.015,.015),y-random.uniform(.10,.19),z*1.035),random.uniform(.006,.012),'chest',False,.009,normal=(math.cos(a),0,math.sin(a)))
# An avian forward-set head and slightly swept neck replace the vertical pose.
for o in objects:
 if o.vertex_groups.get('head'):o.location.x+=.14
for side in [-1,1]:
 feather('Supraorbital feather',(.33,1.09,.17+side*.18),(.45,1.075,.17+side*.19),.013,'head',False,.008,normal=(0,0,side))

# Join surfaces into one skinned mesh so the GLB has only a few material drawcalls.
bpy.ops.object.select_all(action='DESELECT')
for o in objects:o.select_set(True)
bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();body=bpy.context.object;body.name='FENIX_Volumetric_Feathered_Creature'
mod=body.modifiers.new('Articulated feather skeleton','ARMATURE');mod.object=rig;body.parent=rig
for p in rig.pose.bones:p.rotation_mode='XYZ'

def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)
def blend(a,b,u):return a+(b-a)*smooth(u)
def channel(t,keys):
 for (a,v),(b,w) in zip(keys,keys[1:]):
  if a<=t<=b:return blend(v,w,(t-a)/(b-a))
 return keys[0][1] if t<keys[0][0] else keys[-1][1]
# Two non-sinusoidal power strokes, slower feather recovery, long glide.
wingkeys=[(0,.05),(.6,.12),(1.3,.88),(1.60,-.53),(2.08,.78),(2.36,-.47),(2.95,.22),(4.2,.17),(5.15,.24),(5.6,.14),(8,.14)]
scene=bpy.context.scene;scene.render.fps=30;scene.frame_start=1;scene.frame_end=241
for f in range(1,242):
 t=(f-1)/30;scene.frame_set(f);p=rig.pose.bones
 for b in p:b.rotation_euler=(0,0,0);b.location=(0,0,0);b.scale=(1,1,1)
 p['root'].location=(channel(t,[(0,-.25),(1.3,-.12),(2.95,.15),(4.1,.45),(5.6,0),(8,0)]),channel(t,[(0,-.45),(1.2,-.65),(2.95,.35),(4.1,.27),(5.4,.77),(8,.77)]),0)
 p['root'].rotation_euler=(channel(t,[(0,.12),(1.3,.25),(2.0,-.08),(3,.05),(5.6,0),(8,0)]),channel(t,[(0,-.28),(1.3,-.22),(3,.15),(3.65,.48),(4.2,-.2),(5.4,-.42),(8,-.42)]),channel(t,[(0,-.08),(1.3,-.12),(3,.1),(3.65,-.16),(4.2,.08),(5.4,-.16),(8,-.16)]))
 p['chest'].scale=(1+math.sin(t*2.2)*.012,1+math.sin(t*2.2)*.016,1+math.sin(t*2.2)*.02)
 p['neck'].rotation_euler.z=channel(t,[(0,0),(.8,.04),(1.25,-.19),(1.65,.1),(3,.03),(3.5,.12),(4.2,-.05),(5.2,.05),(8,.05)])
 for side in [-1,1]:p['gaze'+str(side)].location.x=.004*math.sin(t*1.7)+.006*channel(t,[(0,0),(3.2,0),(3.45,1),(4.2,0),(8,0)])
 p['neck'].location.y=channel(t,[(0,0),(1.3,-.035),(2.8,.035),(4.2,.01),(5.4,.025),(8,.025)])
 p['head'].rotation_euler.y=channel(t,[(0,0),(1.3,-.1),(2.9,.05),(3.4,.25),(4.2,-.13),(5.3,.02),(8,.02)])
 for s,label in [(-1,'L'),(1,'R')]:
  w=channel(t-(.045 if s==1 else 0),wingkeys)
  p['shoulder'+label].rotation_euler.z=s*w
  p['shoulder'+label].rotation_euler.x=.09+max(0,w)*.15
  p['elbow'+label].rotation_euler.z=s*(.05+max(0,w)*.19)
  p['elbow'+label].rotation_euler.y=s*(.07+max(0,w)*.13)
  p['wrist'+label].rotation_euler.z=s*(channel(t-.09,wingkeys)-w)*.45
  p['wrist'+label].rotation_euler.y=s*(.04+max(0,w)*.13)
  for j in range(10):
   lag=channel(t-.10-j*.009,wingkeys)-w
   p['tip'+label+str(j)].rotation_euler.x=lag*(.25+j*.025)
   p['tip'+label+str(j)].rotation_euler.z=s*lag*.13
  p['leg'+label].rotation_euler.x=channel(t,[(0,0),(1.2,.12),(2,.6),(5.4,.35),(8,.35)])
 for i in range(9):
  p['tail'+str(i)].rotation_euler.x=.08*math.sin(t*2.4-i*.16)+.05*channel(t-.25-i*.025,wingkeys)
  p['tail'+str(i)].rotation_euler.z=.065*math.sin(t*1.7-i*.21)+(i-4)*.008
  p['tail'+str(i)].rotation_euler.y=.07*math.sin(t*1.3-i*.3)
 for b in p:
  b.keyframe_insert('location',frame=f);b.keyframe_insert('rotation_euler',frame=f);b.keyframe_insert('scale',frame=f)
rig.animation_data.action.name='FENIX_Takeoff_TwoStrokes_Glide_Bank_Rise'
scene.frame_set(160)
# Native editable asset + skinned animated interchange asset.
exec(compile((R/'blender/studio.py').read_text(),'studio.py','exec'))
bpy.ops.wm.save_as_mainfile(filepath=str(R/'blender/FENIX_V10_CREATURE.blend'),compress=True)
bpy.ops.export_scene.gltf(filepath=str(R/'public/models/FENIX_V10_CREATURE.glb'),export_format='GLB',export_yup=False,export_animations=True,export_frame_range=True,export_force_sampling=True,export_skins=True,export_materials='EXPORT')
(R/'blender/model-report.json').write_text(json.dumps(dict(vertices=len(body.data.vertices),polygons=len(body.data.polygons),bones=len(arm.bones),fps=30,animation_frames=241,construction='Volumetric feathered mesh, Blender armature and authored pose animation',limitations='Procedural stylized-natural creature; not a scanned production animal. Real-time fire is an authored VFX layer, not a fluid simulation.'),indent=2))
print('FENIX MODEL READY',len(body.data.vertices),len(arm.bones))
