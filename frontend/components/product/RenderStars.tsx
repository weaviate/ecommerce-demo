import { FaStar } from "react-icons/fa";

interface RenderStarsProps {
  rating: number;
  size: number;
}

const RenderStars: React.FC<RenderStarsProps> = ({ rating, size }) => {
  return (
    <div className="flex flex-row">
      {Array.from({ length: 5 }, (_, index) => {
        if (index < rating) {
          return (
            <span key={index} className="text-orange-400">
              <FaStar size={size} />
            </span>
          );
        }
        return (
          <span key={index} className="text-gray-300">
            <FaStar size={size} />
          </span>
        );
      })}
    </div>
  );
};

export default RenderStars;
