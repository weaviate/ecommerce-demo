import React from "react";

import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

interface FavoriteButtonProps {}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({}) => {
  const handleClick = (
    e: React.MouseEvent,
    action: (e: React.MouseEvent) => void,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    action(e);
  };

  const [isFavorite, setIsFavorite] = React.useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="flex items-center">
      <button
        className="relative z-10 text-2xl hover:text-red-500"
        onClick={(e) => handleClick(e, toggleFavorite)}
      >
        {isFavorite ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-gray-500 hover:text-red-500" />
        )}
      </button>
    </div>
  );
};

export default FavoriteButton;
