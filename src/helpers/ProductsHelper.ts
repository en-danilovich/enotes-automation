import { BasketProductModel } from "../pages/main/components/ProductCard.page";

export function groupProducts(
  products: BasketProductModel[]
): BasketProductModel[] {
  const groupedProducts: Map<number, BasketProductModel> = new Map();

  // Iterate through the products
  for (const product of products) {
    // If the product ID is already in the map, increment its count
    if (groupedProducts.has(product.id)) {
      const existingProduct = groupedProducts.get(product.id)!;
      existingProduct.basketCount++;
    } else {
      // Otherwise, add the product to the map with count 1
      const newProduct: BasketProductModel = { ...product, basketCount: 1 };
      groupedProducts.set(product.id, newProduct);
    }
  }

  const result: BasketProductModel[] = Array.from(groupedProducts.values());
  return result;
}

export function getProductsCount(products: BasketProductModel[]): number {
  return products.reduce((acc, item) => (acc += item.basketCount), 0);
}
