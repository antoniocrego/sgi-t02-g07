# SGI 2024/2025 - TP1

## Group: T02G07

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| António Rego         | 202108666 | up202108666@up.pt                |
| William Rampal         | 202402031 | up202402031@up.pt                |

----
## Project information

- The lighting in the scene is pleasant, highlighting all the important features all the while providing nice shadow projections. The materials chosen for each surface seem just right, specially when considering which are specular and which are not. The scene is creative, and there are additions beyond the required to add touches of realism and more life to the scene, such as napkins, chairs, a door. It is also worth noting that the outside view from the window simulates a 3D view instead of utilizing a simple plane for the view, which grants it a touch of more realism.
- Scene
  - The scene is supposed to mirror an abandoned birthday party, with allusions to wartorn countries and unexpected departures from family homes.
  - [Link to the scene](https://gitlab.up.pt/meic-sgi/sgi-2024-2025/t02/sgi-t02-g07/-/blob/bbc554fc00dba6f92a371d72f94f3ef451fa6929/tp1/index.html)
----
## Issues/Problems

- Getting to correspond the expected shape from idea to practicality is hard with curved surfaces. Many times the final curved surface would simply be a process of trial and error until the shape started looking okay, the base knowledge is there for manipulating curved surfaces, but it's clear a greater understanding is definitely needed.

- There are textures that are loaded many times, it could have been a good idea to load all used textures once and for all and possibly even use texture maps.

- Understanding the order of operations in THREE.JS can prove quite difficult.

- Scaling Bezier curves is really confusing.


## Notes Taken

**ILLUMINATION**

Changing the position of the light to y -20 causes the cube to keep the lighting it had on its sides, which is next to none, and now the bottom side is the lit one, instead of the top one, which now shares the lighting of the sides. The plane itself is now unlit, since no light incides upon it with a degree between -90º to 90º. If the plane were 2 sided, then its bottom side would be illuminated instead.

When the light's position is set to y 2 and its intensity 5, the cube is no longer lit at all, as it once more has no planes that incide with the light on a -90º to 90º angle, since the light is now inside the cube itself. The proximity to the plane also causes it to have a more condensed specular highlight, but its brightness is notably inferior, specially if you consider the original intensity at the same distance. In terms of diffuse light, the plane has a very light tone applied to it due to the low intensity.

Once the diffuse color of the light is set to rgb(0,0,0) there is no longer the light tone described above, only the specular light is seen, since the colors that are "sent" by the light source are not present in the plane at all, if this plane didn't have the base color set in another argument, it would be the equivalent of a pitch black similar to Vantablack, which reflects little to no light, but in this case it reflects 0 color.

Altering the shininess of the plane to lower or higher values affects how the specular light is dispersed, the higher the value the more condensed the specular highlight is, and the lower it is the more dispersed this highlight is.

When altering the plane color to rgb(128,128,128) and specular to rgb(0,0,0), the same as before it noted, but instead the specular lighting is no longer present, but the diffuse lighting is now present. The same logic applies. It is of note that since the specular color is set to 0, then altering the shininess factor has no effect on the lighting, as there is no specular lighting to condense or decondense.

Setting the 4th argument of the PointLight function to 0 makes it so that the light has 0 decay, that is no matter where you put the light it will illuminate everything, which it can illuminate, the same. It's as if the light was next to every point it can reach. But changing the position of the light is not irrelevant, it still goes by the same principle of the light's angle being -90º to 90º. If you place the light below the plane once more, the above side of the plane is not lit, as was described before when the light is below the plane, but there is no decaying of the light intensity throughout what it does illuminate. In summary, it illuminates everything it can light the same amount.

When altering the 3rd argument of the PointLight function to 15, a limit of the distance the light can reach is set, as opposed to its previous value of 0, which stands for infinite reach. As the light is set to position y 20, it doesn't light anything, but if we were to move the light's position to y 17, then we can begin to see some lighting on the top plane of the cube, and if we move it down to y 14, then we can begin to see light reach the plane, and we can even push it down further so that more and more of the planes become lit.

**LIGHT SOURCES**

When altering the 2nd argument of the DirectionalLight function to higher values, we notice that the apparent brightness of the light and the intensity of the lighting applied upon the planes it can reach is noticeably higher.

When changing the position of the light to position (5,10,2) the X side and Y side of the cube are well illuminated, and the Z side is slightly less, the other sides all have the same dim lighting applied.

When changing the position of the light to position (-5,10,-2) the -X side and -Y side are now lit up instead, and the Z side keeps its lighting. The remaining sides are now unlit.

The .target parameter makes it so this light aims to a specific position rather than (0,0,0). Allowing the light to be rotated from its starting point.

The SpotLight creates a sort of cone upon which lighting is applied, and the helper aids to visualize this accurately, specially when the light is at an angle. Depending on how its positioned, it lights its most perpendicular planes the most, and generates a specular highlight around the center of the cone. PointLight emits light in all directions, while SpotLight emits in a single direction, it is similar to DirectionalLight in that aspect, but the light rays are not all perpendicular in the SpotLight, they diverge from the base point, and thus the outer ring of the light may be less illuminated.

The top-most side is the closest and most perpendicular with the light source, thus is the most lit. The X axis side is the second most lit, and the Z axis side is barely illuminated as the few rays that do reach this plane make very small angles with it.

When changing the angle of the light to 35º, all sides remain illuminated exactly as before, but the top side now has a partially unilluminated area, which is a consequence of reducing the angle of the light, causing it to not fully reach the top plane of the cube. It is worth noting that the edge of where the light reaches in the top plane is very rough, there is no sort of smoothing between darkness and light due to there not having a penumbra value on this light.

With penumbra at 20%, we can see the transition from light to darkness become smoother, however, it's as if this reduces the angle by a certain amount, and so the side planes now have slight portions which are no longer illuminated or in the process of no longer being illuminated, that is, their lighting value is low as they are in penumbra. The transition, however, is still quite sudden, but it could be argued that it is simply a very strong light.

With penumbra at 70%, the transition becomes extremely smooth, possibly even the most realistic, but as a consequence the Z axis side has almost completely become shaded, and the other sides have also notably had their bright parts reduced.

With penumbra at 100%, the transition of light seems almost the same as 70%, it is very hard to notice the difference past this point, but the same observations as before can be made, at a slightly higher effect.

The other effects are self-explanatory and act similarly to other light sources, intensity makes the light brighter or dimmer in candelas, distance sets how far the spotlight can reach with its light, angle affects how much effective the lighting will be on each plane by making the incidence angle higher or lower, penumbra is as stated above, and decay is sort of like penumbra but instead of being for the sides of the light, it works for the distance from the light, dimming further objects from the light in a more natural way. Finally, the Y coordinate affects where the light is positioned, and affects how all the other interface values work relative to the cube.

**TEXTURES**

When opening the base code, it is clear that the image is extremely dim, this is like due to the base color of the plane, as when we change the color of the plane to white, the picture is much clearer, but now it is washed out. Note that both the diffuse color, the specular color, and the base color of the plane (the emissive) have an effect on the picture's colors. It is notable that the emissive's color is much stronger than the other colors which are dependent on lighting. Changing the diffuse color to red, we get a rather pleasant red tint to the image, almost like wine red.

When utilizing the alternative 2 material, it is noticeable that there is no specular lighting on the surface. The mesh utilized is good for surfaces with little to no reflectance, like untreated wood or stone. Since it doesn't have to calculate specular lighting, this material also has higher performance.

The image, for the most part, appears entirely on the plane, however, it is noticeable that it is very slightly cut off vertically, as seen in the left-most small window at the top of the image. This is because the length/width ratio of the image is not exactly the same. The plane is 10 per 7, and no matter how you calculate it the image has a ratio of 9.84:7 or 10:7.11. It appears that the code sets the U coordinates of the texture from 0 to 1 no matter what, so the image won't ever be cut horizontally, and for the V coordinates it calculates a ratio based on the image's ratio and the expected horizontal size of the plane which results in 98.4% of the image vertically being on the plane. This happens because the code is not set to stretch or, in this case, compress, it is instead set to repeat the image, so it can cause these "cut off" textures as it is repeating the texture vertically 0.984 times.

When reducing the plane to 10 by 3, the image becomes more obviously cut off vertically, having an apparent ratio of 42% of the original image vertically, or 10:4.2 compared to the needed ratio of 10:7.11, that is, 0 to 0.42 in the original image corresponds to 0 to 1 in the V coordinates of the texture. From this, we can conclude that planeTextureRepeatV calculates how many times the image, based on its size horizontally, is going to fit vertically in the texture. For values 0 to 1, it means that the texture doesn't fit completely vertically and must be cut, and values beyond mean that it will repeat vertically.

When setting the planeTextureRepeatU to 2.5 we can note that the image now repeats, since the texture is applied in smaller bouts, and at full 10:7.11 ratio 4 times. When changing this value, we are setting the U coordinates from 0 to 1 to correspond from horizontal pixel 0 to horizontal pixel 8385, which is 2.5 times the size of the image horizontally. As we proved earlier, the texture is scaled to the U coordinates of the image, so, since the mode of the texture application is on repeat, the image is going to be placed from 0 to 0.4 in the U axis, and then repeated from 0.4 to 0.8 and 0.8 to 1.2, but of course anything past 1 is not placed, so it is effectively 0.8 to 1 and it cuts off the image.

The textures are placed based on the U axis, and so the V axis will then try to occupy its maximum size until it no longer fits in the plane. So, according to the scaling, the image is going to fit vertically 2.46 times, that is, it is going to occupy the V coordinates 0 to 0.4065, 0.4065 to 0.813, and 0.813 to 1. The ratio of the image is not affected for 4 of the image placements, unlike the other cases, because it can actually fit the entire image now, of course the ratio of the image is then wrong for the 5 placements which cannot fit fully in the plane.

When setting the repeat mode to THREE.ClampToEdgeWrapping, the image is placed once in the texture, and then repeats or "stretches" the final row and column of pixels until it can fill the UV plane. This is a different method of dealing with accesses to pixels beyond the end of the image, considering that before it merely repeated the image in this "beyond space", or it could also have been considered as setting the "pointer" to the beginning of the image once more when the end was reached. In this case, it's like setting the "pointer" to the end every time it tries to go past the image end.

When setting the repeat mode to THREE.MirroredRepeatWrapping, it can be very easily understood by referring to the "pointer" explanation once more. Once the "pointer" reaches the end of the image, it simply starts traversing backwards, instead of resetting to 0 or being stuck at the end. It does this for every application of the texture both vertically and horizontally, causing an interesting effect of mirrored images. The image ends up being mirrored in the X axis, the Y axis, the X and the Y axis, and of course in none, notably when the mirror is mirrored again.

By changing the offset of the UV plane, it's as if you were to push the "pointer's" start by the offsets, of course, this returns to normal if it has to repeat, which causes an interesting effect of the first image looking slightly different to its repeats. This also means that the image will repeat earlier.

We can also apply a transformation to where the texture will be placed by rotating it along a chosen point, the origin being the default one. 

**CURVED LINES**

4.4.15 Polyline
 The red polyline should consist of three straight segments and four vertices, centered
 at the origin.

 With the hull uncommented, a white convex hull should appear, overlapping the red
 polyline to create a pink color where they coincide.

 Adjusting opacity should make it easier to distinguish the white convex hull from the
 red polyline.

 Adding z values should display the polyline in 3D, rather than as a flat shape.

 The polyline should now be centered at (-4, 4, 0).

 4.4.16 QuadraticBezierCurve

 The white convex hull should consist of two line segments and three vertices.

 These lines generate and display the green quadratic Bézier curve based on the
 control points.

 The convex hull and green Bézier curve should appear after uncommenting.

 Increasing samples smooths out the Bézier curve, improving precision.

 Adding z values should display the Bézier curve in 3D space.
 
 The convex hull and Bézier curve should now be centered at (-2, 4, 0).

 4.4.17 CubicBezierCurve

 The convex hull (white) and cubic Bézier curve (magenta) should be correctly drawn.

 Increasing samples makes the cubic Bézier curve smoother.

 Adding z values should give a 3D shape to the cubic Bézier curve.

 The convex hull and curve should now be centered at (-4, 0, 0).

 4.4.18 CatmullRomCurve

 The yellow Catmull-Rom curve should connect all control points, with a white convex
 hull surrounding them.

 With only 4 samples, the curve will appear angular and less smooth.

 The curve becomes smoother with more samples.

 Altering points changes the shape of the Catmull-Rom curve, as it passes through
 each control point

**CURVED SURFACES**

When changing the number of samples the image seems to stay the same, there is no real noticeable change.

When we change the weight of the first point of the surface, however, we immediately notice that the texture applied seems to converge onto that point of grander weight, distorting the image greatly. Pushing the value to a slightly smaller weight still generates a distorted image, but much less so. However, when we put the point at a weight smaller than all the others, the exact opposite effect happens, the texture is larger at the altered point of smaller weight and it looks as if the image is diverging away from that point, it almost gives it a three-dimensional look specially at certain angles despite being just a plane. When looking at the plane from slightly above it truly looks like the plane is bent.

We can then change weights all around to create very interesting distortions of the UV plane.

When we add a second NURB, we create it with degree 2 in U and degree 1 in V. Since we didn't change the this.orderU value then we merely generate an off-center plane. However, when we correct this value, we get the expected curved surface, now centered around the origin. Now, when we change the number of samples, specifically in the U direction, we can notice that this value directly determines how many lines are used to simulate the curvature of the surface, so higher values produce smoother surfaces and lower values produce "sharper" surfaces. Before, there was no effect because 1 line was enough to represent the plane, as it was straight, adding more lines does not produce a different effect, as they merely look like still one line due to the lack of any curvature.

By altering the weight of the last point, we can expect to alter the weight of point UV(2,1).

For our third NURB, we'll need to upgrade the this.orderU and this.orderV values to 2 and 3 respectively, this because our orders have gone up to 2 and 3. This third figure is much more peculiar, and we can, from here, test different values of samples for U and V. The same as before is proven here, but now we actually see a difference in changing the sample value for V, this because the shape actually has some sort of "bend" vertically, while before it was just horizontally bent. More bends are used to represent the bends and twists of the shape for U and V for higher values of samples, thus it still points out higher values mean more apparent quality to the bend.

When we change the weight of the last point, UV(2,3), to 10, the image converges in on the top-right side of the shape, that which is identified as (1,1) on the texture used.

For our final NURB, we change the order of U and V to 3 and 2 respectively, and changing the samples has the same effect has before. Changing the last point's weight, UV(3,2), to 10, a very particular change to the surface occurs, the surface no longer acts as a fabric bending over the top-middle point, and instead bends very close to the top-rightmost corner.

We can then change each point of the surfaces to create new and unique shapes.

**SHADOWS**

Keeping the ShadowMap at PCFSoftShadowMap and reducing the shadow map resolution to 1024, you can easily note that the shadows cast are far more jittery at the edges, and some shadows even have edges that look like they're composed by various smaller lines, obviously due to the lower resolution of the image used for the shadow map, there are quite literally less pixels defining each shadow.

Switching to the BasicShadowMap, the rendering of the image is noticeably quicker, but the shadows are very low quality, and the lines no longer seem like they are composed of smaller lines, noticeably just being a straight 1 to 1 map of the camera's image's pixels to the plane.

The PFCShadowMap option is very similar to the original PCFSoftShadowMap, but the edges of the shadows are more apparently "sharp", as they no longer are softened to reduce the appearance of individual pixels on the map. It is notable that the PFCSoftShadowMap does better with lower shadow map resolutions, and the difference between the two modes is less noticeable in higher resolutions. Thus this mode may be better for performance reasons in higher resolutions.

The VSMShadowMap option is very interesting. The shadows seem to have an outer lighter shadow around them, and it is very notable that there are way more shadows in scene. It seems that this is because the shadow receivers cast shadows. This creates odd, yet pleasing, effects on the planes. It also seems that the objects are casting shadows upon themselves? It is a very weird effect and it is hard to reason how these shadows came into being.

When looking at strictly the directional light source's shadows, you can notice that some rectangles, when they share points with the same X and Z, are shaded by other rectangles. On the floor itself, past the shadows of individual rectangles, you can even see rectangles' shadows morphing to become abstract shapes, this because of course they overlap and their shadows also overlap. Interestingly enough, the plane casts no shadows, this is because its .castShadows property must be off, while its .receiveShadows property is active. This is confirmable by looking at the rectangles below the plane. They are shaded by other rectangles, but not the plane.

When turning the floor plane downwards, all rectangles below it become entirely shaded, and so is the plane itself. This is opposite to the expected behavior and goes against the conclusions taken above. You can tell in the code that the plane's .castShadows property is actually active. Then there is only one conclusion that can be taken from this, the shadow system is sensitive to the orientation of the surfaces involved.

When replacing the plane with a very thin box, the same as the upside down plane is still seen, the rectangles below the floor are shaded and is realistic.

When reducing the size of the light's shadow camera it is noticeable that there is a cutoff in some shadows. This is likely due to a reduction of what the light's shadow map can effectively see. Some objects are entirely out of this image range and are not shaded or shading, and some objects are only partially shading or shaded.

This also applies to objects under the plane, and when changing the .far property of the shadow camera to 27, it also causes some rectangles under the "seen area" to not be shaded, as they are too far on the Y axis from the camera, thus are not shaded as, once more, they're effectively not seen.

All of the above applies to the point light camera, but this camera cannot have its left/top/bottom/right changed, instead it can have its far changed to 27 as well, and then it can be noticed a great dark spot appear on the plane after a specific point, as the light effectively cannot reach there. It is also worth noting that this light, due to its angle, causes a distortion in the shadows as they grow further from the light, as is expected of a model simulating reality.

These shadow calculations cause a lot of overhead, and this can be seen by turning on just the directional light once more and placing 250 rectangles on scene. We can notice that, as a base, the FPS are at 144, but this is likely due to either a software restriction or simply it is bound to my monitor's refresh rate of 144Hz. So it is likely the code is capable of running at higher. For now, let's try to reduce the FPS.

1000 polygons places the FPS at about 75, nearing the acceptable average value of 60 FPS.
1250 polygons reaches the said 60 FPS.
1500 polygons we are still at 54 FPS.
1750 polygons we are at 48 FPS.
2400 polygons is when it gets to 40 FPS, it seems there are less and less FPS being dropped per increment.
3500 polygons the code is stable at 30 FPS, an acceptable value to some.
4000 polygons we near 24, a standard for cinematography, especially animated.
5000 polygons is when we reach 20 FPS.

With both lights on we can expected a much faster decrease in FPS. Just the Point Light on by itself reduces the FPS to 110, so it is clearly a much more costly camera to use for shadows.
Starting with both on we are already at a base at 75 FPS, much lower than our previous tests. Since the FPS are much lower, we'll take smaller steps this time.

500 polygons we're still at 70-75, the drop is minimal.
750 polygons we hit the coveted 60 FPS mark.
1000 polygons we're at 50 FPS, it seems we're dropping about 1 FPS per 25 polygons, but this may slow down later on like the previous test.
1250 polygons we're at 45 FPS, it may prove true that the rate at which FPS drop is slowing down once more.
1500 polygons we're at 37 FPS, it seems the rate is fluctuating.
1350 polygons is when we have a stable 40 FPS.
1750 polygons we're still at 30 FPS.
2000 polygons we maintain 27-29 FPS.
2500 polygons we're at 24 FPS, the rate is slowing down once more.
2750 is when we finally hit 20 FPS.

It is very interesting to see how the rate at which FPS decreases slows down at higher polygon counts, and would definitely be worth further research. Could it be some sort of GPU optimization? Or are there so many polygons overlapping that at some point it's worthless to continue calculating shadows. Can't be too sure.