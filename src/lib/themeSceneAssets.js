import sandTexture     from "../assets/themes/sand-ground-color.jpg";   // Poly Haven sand_02 — fine desert sand grain
import sandDuneTexture from "../assets/themes/sand-dunes-color.jpg";     // Poly Haven red_sand — warm sun-baked dune face
import sandNormal      from "../assets/themes/sand-ripple-normal.jpg";   // Poly Haven sand_02 normal — micro-ripple detail
import snowTexture     from "../assets/themes/snow-snow003-color.jpg";
import lavaTexture     from "../assets/themes/lava-lava002-color.jpg";
import lavaEmission    from "../assets/themes/lava-lava002-emission.jpg";

export const THEME_SCENE_ASSETS = {
  sand: {
    texture:      sandTexture,      // main fill body / ground plane
    duneTexture:  sandDuneTexture,  // warm reddish-orange dune face (lit side)
    normalMap:    sandNormal,       // ripple / micro-bump detail overlay
  },
  snow: {
    texture: snowTexture,
  },
  lava: {
    texture:  lavaTexture,
    emission: lavaEmission,
  },
};
