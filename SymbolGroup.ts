
import Accessor from "esri/core/Accessor";
import { property, subclass } from "esri/core/accessorSupport/decorators";
import Collection from "esri/core/Collection";
import PortalItem from "esri/portal/PortalItem";

import { SymbolGroupId } from "../SymbolGallery";
import SymbolItem from "./SymbolItem";

export const SymbolItemCollection = Collection.ofType<SymbolItem>(SymbolItem);

@subclass("draw.symbolgallery.SymbolGroup")
export default class SymbolGroup extends Accessor {

  @property({
    readOnly: true,
    type: SymbolItemCollection,
  })
  public readonly items = new SymbolItemCollection();

  constructor(public category: SymbolGroupId, portalItems: Promise<PortalItem[]>) {
    super();

    portalItems.then((items) => this.addSymbolItems(items));
  }

  private addSymbolItems(items: PortalItem[]) {
    items.forEach((item) => {
      const styleName = this.getStyleName(item);

      if (this.styleNameMatchesGroup(styleName)) {
        item.fetchData().then((data) => {
          this.items.addMany(
            data.items
            //  .filter((symbolItem: any) => symbolItem.thumbnail.href && symbolItem.dimensionality === "volumetric")
              .map((symbolItem: any) => new SymbolItem(symbolItem, styleName)),
          );
        });
      }
    });
  }

  private getStyleName(item: PortalItem): string {
    for (const typeKeyword of item.typeKeywords) {
      if (/^Esri.*Style$/.test(typeKeyword) && typeKeyword !== "Esri Style") {
        return typeKeyword;
      }
    }
    return "";
  }

  private styleNameMatchesGroup(styleName: string): boolean {
    switch (this.category) {
      case SymbolGroupId.Icons:
        return styleName === "EsriIconsStyle";
      case SymbolGroupId.Trees:
        return styleName === "EsriRealisticTreesStyle";
      case SymbolGroupId.Vehicles:
        return styleName === "EsriRealisticTransportationStyle";
          // || styleName === "EsriInfrastructureStyle";
    }
    return false;
  }

}
