import Link from "next/link";
import Image from "next/image";
import ProductTeaser from "../product/ProductTeaser";

interface Product {
  name: string;
  price: number;
  product_id: string;
  brand: string;
}

interface CollectionShowcaseProps {
  backgroundColor?: string;
  accentColor?: string;
  collectionName: string;
  description: string;
  products: Product[];
  imagePath: string | null;
  descriptionEnd: boolean;
}

export default function CollectionShowcase({
  backgroundColor = "black",
  accentColor = "white",
  collectionName,
  description,
  products,
  imagePath,
  descriptionEnd,
}: CollectionShowcaseProps) {
  return (
    <div className="w-full" style={{ backgroundColor }}>
      <div className="grid grid-cols-4 gap-4 p-8">
        {descriptionEnd ? (
          <>
            {products.map((product, index) => (
              <ProductTeaser
                key={product.product_id}
                name={product.name}
                price={product.price}
                product_id={product.product_id}
                brand={product.brand}
              />
            ))}
            <div className="flex flex-col gap-4 pt-10 px-7">
              <p className="text-4xl font-bold" style={{ color: accentColor }}>
                {collectionName}
              </p>
              <p className="text-md" style={{ color: accentColor }}>
                {description}
              </p>
              <Link
                href={`/search?collection=${collectionName}`}
                className={`btn`}
                style={
                  {
                    color: backgroundColor,
                    borderColor: accentColor,
                    backgroundColor: accentColor,
                  } as any
                }
              >
                View Collection
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 pt-10 px-7">
              <p className="text-4xl font-bold" style={{ color: accentColor }}>
                {collectionName}
              </p>
              <p className="text-md" style={{ color: accentColor }}>
                {description}
              </p>
              <Link
                href={`/search?collection=${collectionName}`}
                className={`btn`}
                style={
                  {
                    color: backgroundColor,
                    borderColor: accentColor,
                    backgroundColor: accentColor,
                  } as any
                }
              >
                View Collection
              </Link>
            </div>
            {products.map((product, index) => (
              <ProductTeaser
                key={product.product_id}
                name={product.name}
                price={product.price}
                product_id={product.product_id}
                brand={product.brand}
              />
            ))}
          </>
        )}
      </div>
      {imagePath && (
        <div className="px-20 py-10">
          <Image
            src={imagePath}
            alt={`${collectionName} Collection Image`}
            width={800}
            height={800}
            className="object-contain w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
