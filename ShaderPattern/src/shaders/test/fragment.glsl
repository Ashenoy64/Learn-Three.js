#define PI 3.1415926535
varying vec2 vUv;

float random(vec2 x)
{
    return fract(sin(dot(x.xy,vec2(12.9898,78.233)))*43758.5453123);
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}


vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) *(uv.y - mid.y)+ mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) *(uv.x - mid.x) +mid.y
    );
}

void main()
{

    float sx =vUv.x;
    float sy =vUv.y;
    float strength;
    float help;

    vec2 helP;
    vec2 v1,v2;

    //pattern 1
    gl_FragColor = vec4(vUv, 1.0, 1.0);

    //pattern 2
    // gl_FragColor =vec4(vUv.x,vUv.y,0.0,1.0);

    //pattern 3
    // gl_FragColor =vec4(vUv,0.5,1.0);

    //pattern4
    // gl_FragColor =vec4(sx,sx,sx,1.0);

    //pattern5
    // gl_FragColor =vec4(sy,sy,sy,1.0);

    //pattern6
    // gl_FragColor =vec4(1.0-sy,1.0-sy,1.0-sy,1.0);

    //pattern7
    // gl_FragColor =vec4(sy*2.0,sy*2.0,sy*2.0,1.0);

    //pattern8
    // strength =mod(sy*10.0,1.0);
    // gl_FragColor =vec4(strength,strength,strength,1.0);


    //pattern10
    // strength = step(0.8 ,strength);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern11
    // strength =mod(sx*10.0,1.0);
    // strength = step(0.8 ,strength);
    // gl_FragColor =vec4(strength,strength,strength,1.0);


    //pattern12
    // strength = step(0.8 ,mod(sx*10.0,1.0));
    // strength += step(0.8,mod(sy*10.0,1.0));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

   //pattern12
    // strength = step(0.8 ,mod(sx*10.0,1.0));
    // strength *= step(0.8,mod(sy*10.0,1.0));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern13
    // strength = step(0.4 ,mod(sx*10.0,1.0));
    // strength *= step(0.8,mod(sy*10.0,1.0));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern14

    // strength = step(0.4 ,mod(sx*10.0,1.0));
    // strength *= step(0.8,mod(sy*10.0,1.0));

    // help=step(0.4 ,mod(sy*10.0,1.0));
    // help *=step(0.8 ,mod(sx*10.0,1.0));

    // strength+=help;
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern15
    // strength = step(0.4 ,mod(sx*10.0-0.2,1.0));
    // strength *= step(0.8,mod(sy*10.0,1.0));

    // help=step(0.4 ,mod(sy*10.0-0.2,1.0));
    // help *=step(0.8 ,mod(sx*10.0,1.0));

    // strength+=help;
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern16
    // strength =abs(vUv.x-0.5);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern17
    // strength =min(abs((vUv.x-0.5)),abs((vUv.y-0.5)));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern18
    // strength =max(abs((vUv.x-0.5)),abs((vUv.y-0.5)));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern19
    // strength =max(abs((vUv.x-0.5)),abs((vUv.y-0.5)));
    // strength =step(0.2,strength);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern20
    // strength =max(abs((vUv.x-0.5)),abs((vUv.y-0.5)));
    // strength =step(0.4,strength);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern21
    // help = step(0.2,max(abs((vUv.x-0.5)),abs((vUv.y-0.5))));
    // strength =1.0-step(0.25,max(abs((vUv.x-0.5)),abs((vUv.y-0.5))));
    // strength =strength*help;
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern22
    // strength =floor(vUv.x*10.0)/10.0; 
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern23
    // strength =floor(vUv.x*10.0)/10.0; 
    // strength *=floor(vUv.y*10.0)/10.0;
    // gl_FragColor =vec4(strength,strength,strength,1.0);
    
    //pattern24
    //  helP= vec2(floor(sx*10.0)/10.0,floor(sy*10.0)/10.0);
    // strength =random(helP);
    // gl_FragColor =vec4(strength,strength,strength,1.0);
    
    
    //pattern25
    // helP= vec2(floor(sx*10.0)/10.0,floor((sy+sx*0.5)*10.0)/10.0);
    // strength =random(helP);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern26
    // strength = length(vUv);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern27
    // strength = length(vUv-0.5);
    // strength =distance(vUv,vec2(0.5,0.5));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern28
    // strength = length(vUv-0.5);
    // strength =1.0-distance(vUv,vec2(0.5,0.5));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    
    //pattern29
    // strength =0.02/distance(vUv,vec2(0.5,0.5));
    // gl_FragColor =vec4(strength,strength,strength,1.0);


    //pattern30
    // strength =0.015/distance(vUv,vec2(0.5,0.5));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern31
    // helP = vec2(sx * 0.1 + 0.45,sy*0.5+0.25);
    // strength =0.015/distance(helP,vec2(0.5,0.5));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern32
    // v1 = vec2(sx * 0.1 + 0.45 , sy*0.5 + 0.25 );
    // help =0.015/distance(v1,vec2(0.5,0.5));

    // v2 = vec2(sx * 0.5 + 0.25 , sy*0.1 + 0.45 );
    // strength = 0.015/distance(v2,vec2(0.5,0.5));
    // strength *=help; 
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern33
   
    // vec2 rotateduv =rotate(vUv,PI/4.0,vec2(0.5,0.5));
    // v1 = vec2(rotateduv.x * 0.1 + 0.45 , rotateduv.y*0.5 + 0.25 );
    // help =0.015/distance(v1,vec2(0.5,0.5));

    // v2 = vec2(rotateduv.x * 0.5 + 0.25 , rotateduv.y*0.1 + 0.45 );
    // strength = 0.015/distance(v2,vec2(0.5,0.5));
    // strength *=help; 
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern34
    // strength =distance(vUv,vec2(0.5));
    // strength =step(0.2,strength);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern35
    // strength =distance(vUv,vec2(0.5));
    // strength =step(0.2,strength);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern36
    // strength =abs(distance(vUv,vec2(0.5)) -0.25);
    // // strength =step(0.2,strength);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern37
    // strength =step(0.01,abs(distance(vUv,vec2(0.5)) -0.25));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern38
    // strength =1.0-step(0.01,abs(distance(vUv,vec2(0.5)) -0.25));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern39
    // v1 = vec2(sx,sy + sin(sx *30.0) *0.1);
    // strength =1.0-step(0.01,abs(distance(v1,vec2(0.5)) -0.25));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern40
    // v1 = vec2(sx + sin(sy *30.0) *0.1,sy + sin(sx *30.0) *0.1);
    // strength =1.0-step(0.01,abs(distance(v1,vec2(0.5)) -0.25));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern41
    // v1 = vec2(sx + sin(sy *100.0) *0.1,sy + sin(sx *100.0) *0.1);
    // strength =1.0-step(0.01,abs(distance(v1,vec2(0.5)) -0.25));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern42
    // strength =atan(sx,sy);//rotate(vUv,PI/2.0,vec2(0.0)).x;
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern43
    // strength =atan(sx-0.5,sy-0.5);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    
    //pattern44
    // strength =atan(sx-0.5,sy-0.5);
    // strength /=PI *2.0;
    // strength +=0.5;
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern45
    // strength =atan(sx-0.5,sy-0.5);
    // strength /=PI *2.0;
    // strength +=0.5;
    // strength*=20.0; // 200;
    // strength =mod(strength,1.0);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern46
    // strength =atan(sx-0.5,sy-0.5);
    // strength /=PI *2.0;
    // strength +=0.5;
    // strength =sin(strength*100.0); //200 1000
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern47
    // help =atan(sx-0.5,sy-0.5);
    // help /=PI *2.0;
    // help +=0.5;
    // help =sin(help *100.0);
    // help = 0.25+ help*0.02;
    // v1 = vec2(sx ,sy);
    // strength =1.0-step(0.01,abs(distance(v1,vec2(0.5)) -help));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern48
    //perlin noise
    // strength =cnoise(vUv *10.0);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern49
    // strength =step(0.0,cnoise(vUv *10.0));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern50
    // strength =1.0-abs(cnoise(vUv *10.0));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern51
    // strength =sin(cnoise(vUv *10.0)*20.0);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern52
    // strength =step(0.8,sin(cnoise(vUv *10.0)*20.0));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //pattern53
    // vec3 color = vec3(0.0);
    // vec3 UVcolor = vec3(vUv,1.0);
    // strength =step(0.8,sin(cnoise(vUv *10.0)*20.0));
    // vec3 mixedColor =mix(color,UVcolor,strength);
    // gl_FragColor =vec4(mixedColor,1.0);


    //clamp the strength
    strength = clamp(strength,0.0,1.0);




    //pattern abs
    strength =1.0-distance(vUv,vec2(0.5,0.5))*10.0;
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //patternabs
    helP= vec2(floor(sx*10.0)/10.0,floor(sy+sx*10.0)/10.0);
    strength =random(helP);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //patternabs
    strength =min(abs((vUv.x-0.5)*3.0),abs((vUv.y-0.5)*3.0));
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //patternabs
    strength =abs(vUv.x-0.5);
    strength /=abs(vUv.y-0.5);
    // gl_FragColor =vec4(strength,strength,strength,1.0);

    //patternabs
    strength =abs(vUv.x-0.5);
    strength *=abs(vUv.y-0.5);
    // gl_FragColor =vec4(strength,strength,strength,1.0);
    

    






}