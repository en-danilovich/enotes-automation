import {
  createMap,
  createMapper,
  forMember,
  mapFrom,
  Mapper,
} from "@automapper/core";
import { Product as ApiProduct } from "../restApi/enotes/ProductsApiClient";
import { BasketProductModel as UIProduct } from "../pages/main/components/ProductCard.page";
import { pojos, PojosMetadataMap } from "@automapper/pojos";

export class ModelMapper {
  private mapper: Mapper = createMapper({ strategyInitializer: pojos() });

  constructor() {
    this.initializeMappings();
  }

  private initializeMappings(): void {
    PojosMetadataMap.create<ApiProduct>("ProductApi", {
      id: Number,
      name: String,
      type: String,
      price: Number,
    });

    PojosMetadataMap.create<UIProduct>("ProductCardUI", {
      id: Number,
      type: String,
      name: String,
      price: Number,
      discountPrice: Number,
    });

    createMap<ApiProduct, UIProduct>(
      this.mapper,
      "ProductApi",
      "ProductCardUI",
      forMember(
        (d) => d.discountPrice,
        mapFrom((s) => s.price - s.discount)
      )
    );
  }

  map(source: ApiProduct): UIProduct {
    return this.mapper.map<ApiProduct, UIProduct>(
      source,
      "ProductApi",
      "ProductCardUI"
    );
  }
}
