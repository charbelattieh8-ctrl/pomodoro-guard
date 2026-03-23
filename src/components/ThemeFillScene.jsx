import WaterFillScene from "./WaterFillScene";
import SandFillScene from "./themeScenes/SandFillScene";
import SnowFillScene from "./themeScenes/SnowFillScene";
import AuroraFillScene from "./themeScenes/AuroraFillScene";
import LavaFillScene from "./themeScenes/LavaFillScene";

const SCENE_COMPONENT_BY_STYLE = {
  sand: SandFillScene,
  snow: SnowFillScene,
  aurora: AuroraFillScene,
  lava: LavaFillScene,
};

export default function ThemeFillScene(props) {
  const fillStyle = props.theme?.fillStyle ?? "water";
  const SceneComponent = SCENE_COMPONENT_BY_STYLE[fillStyle] ?? WaterFillScene;

  return <SceneComponent {...props} />;
}
