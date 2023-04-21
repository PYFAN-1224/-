
import { property, subclass } from "esri/core/accessorSupport/decorators";
import Graphic from "esri/Graphic";
import SimpleFillSymbol from "esri/symbols/SimpleFillSymbol";
import { tsx } from "esri/widgets/support/widget";

import DrawWidget from "./DrawWidget";


interface ColorMenu {
  label: string;
  color: string;
}

@subclass("app.draw.构建区域")
export default class CreateArea extends DrawWidget {

  @property()
  private activeColor: string | null = null;

  private colorMenus: ColorMenu[] = [
    {
      label: "道路",
      color: "#f0f0f0",
    },
    {
      label: "草地",
      color: "#bdce8a",
    },
    {
      label: "水系",
      color: "#a0b4cf",
    },
  ];

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
          { this.colorMenus.map((menu) => (
            <div class="menu-item">
              <button
                class={menu.color === this.activeColor ? active : inactive}
                onclick={ this.startDrawing.bind(this, menu.color) }>Create {menu.label}</button>
            </div>
          )) }
        </div>
      </div>
    );
  }

  public updateGraphic(graphic: Graphic): Promise<Graphic[]> {
    return this.updatePolygonGraphic(graphic, graphic.symbol.color.toHex());
  }

  private startDrawing(color: string) {

    const symbol = new SimpleFillSymbol({
      color,
      outline: {
        width: 0,
      },
    });

    this.createPolygonGraphic(symbol, color).finally(() => {
      this.activeColor = null;
    }).catch(() => {
      // Ignore
    });
    this.activeColor = color;
  }

}
