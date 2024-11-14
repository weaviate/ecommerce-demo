import Image from "next/image";

import RenderStars from "./RenderStars";

interface ReviewsProps {
  reviews: string[];
  rating: number;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, rating }) => {
  return (
    <div className="carousel carousel-end gap-3 p-5">
      {reviews.map((review, index) => (
        <div
          key={index}
          className="carousel-item bg-white shadow-lg p-3 rounded-lg w-1/4 flex flex-col"
        >
          <div className="flex flex-row justify-left pb-4">
            <div className="avatar">
              <div className="w-12 rounded bg-primary">
                <Image
                  className="p-2"
                  src="/logo_main.png"
                  alt="Weaviate logo"
                  width={48}
                  height={48}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-md font-bold pl-4">Weaviate</p>
              <div className="flex flex-row pl-4">
                <RenderStars rating={rating} size={15} />
              </div>
            </div>
          </div>
          <div className="flex">
            <p className="text-sm text-primary">{review}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
