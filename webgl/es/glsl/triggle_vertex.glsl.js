export default /* glsl */`
attribute vec3 a_Position;
attribute vec2 a_Uv;

uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

varying vec2 v_Uv;

void main(){
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
    v_Uv = a_Uv;
}
`