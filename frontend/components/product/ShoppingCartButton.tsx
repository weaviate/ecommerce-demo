import React from "react";

import { AiOutlineShoppingCart } from "react-icons/ai";

interface ShoppingCartButtonProps {
  productQuantity: number;
  handleIncrement: (e: React.MouseEvent) => void;
  handleDecrement: (e: React.MouseEvent) => void;
}

const ShoppingCartButton: React.FC<ShoppingCartButtonProps> = ({
  productQuantity,
  handleIncrement,
  handleDecrement,
}) => {
  const handleClick = (
    e: React.MouseEvent,
    action: (e: React.MouseEvent) => void,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    action(e);
  };

  return (
    <div className="flex items-center space-x-4">
      {productQuantity === 0 ? (
        <div className="relative">
          <div className="absolute inset-0 rounded-md"></div>
          <button
            className="btn btn-primary text-white rounded-md relative z-10 opacity-75"
            onClick={(e) => handleClick(e, handleIncrement)}
          >
            <AiOutlineShoppingCart size={15} />
          </button>
        </div>
      ) : (
        <div className="flex items-center relative">
          <div className="absolute inset-0 rounded-md"></div>
          <div className="flex items-center relative z-10">
            <button
              className="btn btn-primary text-white opacity-75"
              onClick={(e) => handleClick(e, handleDecrement)}
            >
              -
            </button>
            <span className="mx-2 text-black font-bold">{productQuantity}</span>
            <button
              className="btn btn-primary text-white opacity-75"
              onClick={(e) => handleClick(e, handleIncrement)}
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartButton;
