#version 300 es

in vec2 pos;
in vec2 uv;

uniform vec2 resolution;

uniform mat3 matrix;

out vec2 v_uv;

void main() {
  vec2 position = (matrix * vec3(pos, 1)).xy;
  vec2 zeroToOne = position / resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace, 0, 1);
  v_uv = uv;
}