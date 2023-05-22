import React, { FC } from "react";
import NcImage from "shared/NcImage/NcImage";
import { Link } from "react-router-dom";
import images1 from "images/nfts/cat1.webp";

export interface CardCategoryNFTProps {
  className?: string;
  item?: any;
}

const COLORS = [
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-gray-500",
];

const CardCategoryNFT: FC<CardCategoryNFTProps> = ({
  className = "",
  item,
}) => {
  console.log(item);
  return (
    <div
      className={`nc-CardCategoryNFT flex flex-col ${className} cursor-pointer`}
      data-nc-id="CardCategoryNFT"
    >
      <div
        className={`flex-shrink-0 relative w-full aspect-w-4 aspect-h-4 h-full rounded-2xl group`}
      >
        <NcImage
          src={item.image}
          className="object-cover w-full h-full rounded-2xl"
        />
        <div className="absolute flex items-center">
          <div className="absolute bg-neutral-100 bottom-6 -ml-6 bg-white flex px-1 gap-1 py-1 rounded-full items-center	">
            <NcImage src={item.logo} className="object-cover w-10 h-10" />
            <span
              className={`block text-sm text-neutral-6000 dark:text-neutral-400`}
            >
              @{item.instagram}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCategoryNFT;
