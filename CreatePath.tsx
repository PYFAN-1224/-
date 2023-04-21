
import { property, subclass } from "esri/core/accessorSupport/decorators";
import Graphic from "esri/Graphic";
import SimpleLineSymbol from "esri/symbols/SimpleLineSymbol";
import { tsx } from "esri/widgets/support/widget";

import DrawWidget from "./DrawWidget";

interface PathMenu {
  label: string;
  color: string;
  width: number;
}

@subclass("app.draw.道路规划")
export default class CreatePath extends DrawWidget {

  @property()
  private activeMenu: PathMenu | null = null;

  private menus: PathMenu[] = [
    {
      label: "道路",
      color: "#cbcbcb",
      width: 20,
    },
    {
      label: "人行道",
      color: "#b2b2b2",
      width: 3,
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
          { this.menus.map((menu) => (
            <div class="menu-item">
              <button
                class={menu === this.activeMenu ? active : inactive}
                onclick={ this.startDrawing.bind(this, menu) }>Create {menu.label}</button>
            </div>
          )) }
        </div>
      </div>
    );
  }

  public updateGraphic(graphic: Graphic): Promise<Graphic[]> {
    return this.updatePolylineGraphic(graphic, graphic.symbol.color.toHex());
  }

  private startDrawing(menu: PathMenu) {
    const symbol = new SimpleLineSymbol({
      color: menu.color,
      width: menu.width,
    });

    this.createPolylineGraphic(symbol, menu.color).finally(() => {
      this.activeMenu = null;
    }).catch(() => {
      // Ignore
    });
    this.activeMenu = menu;
  }

}
