
import { property, subclass } from "esri/core/accessorSupport/decorators";
import Graphic from "esri/Graphic";
import PolygonSymbol3D from "esri/symbols/PolygonSymbol3D";
import { tsx } from "esri/widgets/support/widget";

import DrawWidget from "./DrawWidget";


const BUILDING_COLOR = "#FFFFFF";
const BUILDING_FLOOR_HEIGHT = 3;

@subclass("app.draw.建筑规划")
export default class CreateBuilding extends DrawWidget {

  @property()
  private stories: number;

  public postInitialize() {
    this.layer.elevationInfo = {
      mode: "on-the-ground",
    };
  }

  public render() {
    const inactive = "btn btn-large";
    const active = inactive + " active";
    return (
      <div>
        <div class="菜单">
          { [3,4,5,6,7].map((stories) => (
            <div class="menu-item">
              <button
                class={stories === this.stories ? active : inactive}
                onclick={ this.startDrawing.bind(this, stories) }>{stories}层楼</button>
            </div>
          )) }
        </div>
      </div>
    );
  }

  public updateGraphic(graphic: Graphic): Promise<Graphic[]> {
    return this.updatePolygonGraphic(graphic, BUILDING_COLOR);
  }

  private startDrawing(stories: number) {

    const size = stories * BUILDING_FLOOR_HEIGHT;
    const color = BUILDING_COLOR;

    const symbol = new PolygonSymbol3D({
      symbolLayers: [{
        type: "extrude",
        material: {
          color,
        },
        edges: {
          type: "solid",
          color: [100, 100, 100],
        },
        size,
      }] as any,
    });

    this.createPolygonGraphic(symbol, color).finally(() => {
      this.stories = 0;
    }).catch(() => {
      // Ignore
    });
    this.stories = stories;
  }

}
