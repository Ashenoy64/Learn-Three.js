
varying vec3 vColor;
void main()
{
    //pattern1 
    // float strength1 = distance(gl_PointCoord,vec2(0.5));
    // strength1 = step(0.5,strength1);
    // strength1 =1.0 - strength1;

    //pattern2 
    // float strength2 =2.0 * distance(gl_PointCoord,vec2(0.5));
    // strength2 =1.0 -strength2;

    //pattern3
    float strength3 = distance(gl_PointCoord,vec2(0.5));
    strength3 =1.0 -strength3;
    strength3 =pow(strength3, 10.0);


    vec3 finalColor = mix(vec3(0.0),vColor,strength3);

    gl_FragColor = vec4(finalColor,1.0);
}