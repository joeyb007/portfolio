export const holoVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition   = -mvPosition.xyz;
    vNormal         = normalize(normalMatrix * normal);
    vWorldPosition  = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position     = projectionMatrix * mvPosition;
  }
`

export const holoFragment = /* glsl */ `
  uniform vec3  uColor;
  uniform float uTime;
  uniform float uReveal;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec3  viewDir = normalize(vViewPosition);
    vec3  normal  = normalize(vNormal);

    // Fresnel rim — bright at silhouette, dim at centre
    float fres = 1.0 - max(dot(viewDir, normal), 0.0);
    float rim  = pow(fres, 2.5) * 1.8;

    // Scanlines — horizontal bands drifting upward
    float scan = sin(vWorldPosition.y * 60.0 - uTime * 2.5);
    scan = smoothstep(0.3, 1.0, scan) * 0.15;

    // Pulse wave — brightness ripple travelling up through brain
    float pulse = (sin(vWorldPosition.y * 3.0 - uTime * 4.0) * 0.5 + 0.5) * 0.2;

    // Flicker — subtle hash-noise instability
    float flick = 1.0 - 0.04 + 0.04 * hash(floor(uTime * 30.0));

    // Combine
    vec3  col   = uColor * (0.15 + rim + scan + pulse) * flick;
    float alpha = (0.12 + rim * 0.7 + scan * 0.3) * flick * uReveal;

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`
