"""Native Blender review camera/lights. Y-up bird, camera looking down -Z."""
import bpy
from mathutils import Vector
scene=bpy.context.scene
for ob in list(bpy.data.objects):
 if ob.type in {'CAMERA','LIGHT'}:bpy.data.objects.remove(ob,do_unlink=True)
def area(name,pos,power,size,color):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;d.color=color
 o=bpy.data.objects.new(name,d);bpy.context.collection.objects.link(o);o.location=pos;o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
area('Warm key',(-4,6,8),900,5,(1,.87,.68));area('Amber rim',(4,3,-4),1100,4,(1,.35,.08));area('Soft fill',(4,0,5),350,4,(1,.88,.75))
cam=bpy.data.cameras.new('Portrait camera');ob=bpy.data.objects.new('Portrait camera',cam);bpy.context.collection.objects.link(ob);ob.location=(0,0,17);ob.rotation_euler=(0,0,0);cam.lens=40;cam.sensor_fit='VERTICAL';cam.sensor_height=36;scene.camera=ob
scene.render.engine='BLENDER_EEVEE_NEXT';scene.render.resolution_x=1080;scene.render.resolution_y=1920;scene.render.resolution_percentage=100;scene.render.fps=30
scene.world.color=(.015,.012,.009)
scene.render.film_transparent=False;scene.view_settings.view_transform='AgX'
scene.frame_set(157)
