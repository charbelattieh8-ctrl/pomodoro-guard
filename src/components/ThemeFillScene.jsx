import WaterFillScene from "./WaterFillScene";
import SandFillScene from "./themeScenes/SandFillScene";
import SnowFillScene from "./themeScenes/SnowFillScene";
import AuroraFillScene from "./themeScenes/AuroraFillScene";
import LavaFillScene from "./themeScenes/LavaFillScene";
// New environment scenes
import ForestFillScene from "./themeScenes/ForestFillScene";
import CyberpunkFillScene from "./themeScenes/CyberpunkFillScene";
import OceanFillScene from "./themeScenes/OceanFillScene";
import VolcanoFillScene from "./themeScenes/VolcanoFillScene";
import SpaceFillScene from "./themeScenes/SpaceFillScene";

const SCENE_COMPONENT_BY_STYLE = {
  sand:     SandFillScene,
  snow:     SnowFillScene,
  aurora:   AuroraFillScene,
  lava:     LavaFillScene,
  // New environment scenes
  forest:   ForestFillScene,
  cyberpunk: CyberpunkFillScene,
  ocean:    OceanFillScene,
  volcano:  VolcanoFillScene,
  space:    SpaceFillScene,
};

export default function ThemeFillScene(props) {
  const fillStyle = props.theme?.fillStyle ?? "water";
  const SceneComponent = SCENE_COMPONENT_BY_STYLE[fillStyle] ?? WaterFillScene;

  return <SceneComponent {...props} />;
}
