import React, { FC, useEffect, useId, useRef, useState } from "react";
import Heading from "components/Heading/Heading";
import Glide from "@glidejs/glide";
import CardCategoryNFT from "components/CardCategoryNFT/CardCategoryNFT";
import NextPrev from "shared/NextPrev/NextPrev";
import { nftsDrops } from "contains/fakeData";
import NcImage from "shared/NcImage/NcImage";
import ButtonPrimary from "shared/Button/ButtonPrimary";

import nftimage1 from "images/nfts/arsek1.jpg";
import nftimage2 from "images/nfts/bustart1.jpg";
import nftimage3 from "images/nfts/dank1.jpg";
import nftimage4 from "images/nfts/jorit1.jpg";

import nftlogo1 from "images/nfts/arsek2.png";
import nftlogo2 from "images/nfts/bustart2.png";
import nftlogo3 from "images/nfts/dank2.png";
import nftlogo4 from "images/nfts/jorit2.png";

import { useNavigate } from "react-router-dom";

import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import MARKETPLACE_ABI from "../../abis/MARKETPLACE.json";
import { Abi } from "viem";
import { formatEther } from "viem";

export interface SectionSliderNftsProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
}

const nfts = [
  {
    name: "HOME",
    artist: "Arsek & Erase",
    location: "Rheinberg, Germany",
    logo: nftlogo1,
    image: nftimage1,
    price: "7,000,000",
    date: "2021",
    instagram: "arsek_erase",
    info: "https://artists.streeth.io/arsek-erase/",
  },
  {
    name: "KISSING THE DANUBE",
    artist: "Bustart",
    location: "Vukovar, Croatia",
    logo: nftlogo2,
    image: nftimage2,
    price: "9,000,000",
    date: "2021",
    instagram: "artofbust",
    info: "https://artists.streeth.io/bustart/",
  },
  {
    name: "TOKYO DREAMING",
    artist: "Dank",
    location: "London, UK",
    logo: nftlogo3,
    image: nftimage3,
    price: "30,000,000",
    date: "2021",
    instagram: "dankitchener",
    info: "https://artists.streeth.io/dank/",
  },
  {
    name: "SAN GENNARO",
    artist: "Jorit",
    location: "Napoli, Italy",
    logo: nftlogo4,
    image: nftimage4,
    price: "80,695,704",
    date: "2015",
    instagram: "jorit",
    info: "https://artists.streeth.io/jorit/",
  },
];

const nftsDates = ["Q3 2023", "Q4 2023", "TBA", "TBA", "TBA"];

const SectionSliderNfts: FC<SectionSliderNftsProps> = ({
  heading = "Upcoming Streeth NFTs Drops",
  subHeading = "Our upcoming collaborations with world renowned street artists. Follow our Medium for up-to-date drops’ info",
  className = "",
  itemClassName = "",
}) => {
  const sliderRef = useRef(null);
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");

  const [selNft, SelectNft] = useState(0);

  const nftIds = [7, 15, 14, 16];

  const marketplaceContract = {
    address: process.env.REACT_APP_MARKETPLACE_ADDRESS as any,
    abi: MARKETPLACE_ABI as Abi,
  };

  const { data: priceData } = useContractReads({
    contracts: [
      {
        ...marketplaceContract,
        functionName: "price",
        args: [7],
      },
      {
        ...marketplaceContract,
        functionName: "price",
        args: [15],
      },
      {
        ...marketplaceContract,
        functionName: "price",
        args: [14],
      },
      {
        ...marketplaceContract,
        functionName: "price",
        args: [16],
      },
    ],
  });

  const navigate = useNavigate();

  const onPurchase = () => {
    navigate("/nft-detail", {
      state: {
        NFTID: nftIds[selNft],
      },
    });
  };

  useEffect(() => {
    if (!sliderRef.current) {
      return;
    }

    const OPTIONS: Glide.Options = {
      type: "carousel",
      focusAt: "center",
      startAt: 2,
      perView: 3,
      gap: 32,
      peek: {
        before: 32,
        after: 0,
      },
      breakpoints: {
        1280: {
          perView: 3,
        },
        1024: {
          gap: 32,
          perView: 2.6,
        },
        768: {
          gap: 32,
          perView: 2.3,
        },
        640: {
          gap: 32,
          perView: 2,
        },
        500: {
          gap: 32,
          perView: 1.7,
        },
      },
    };

    let slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
    slider.mount();
    // @ts-ignore
    return () => slider.destroy();
  }, [sliderRef, UNIQUE_CLASS]);

  return (
    <div className={`nc-SectionSliderNfts ${className}`}>
      <div className="flex w-4/5 m-auto relative mb-24 flex-col lg:flex-row items-center">
        <div
          className={`flex flex-col ${className} h-[70vw] w-[70vw] sm:h-[50vw] sm:w-[50vw] lg:h-[30vw] lg:w-[30vw] cursor-pointer relative`}
        >
          <div
            className={`flex-shrink-0 relative w-full aspect-w-2 aspect-h-2 h-full rounded-2xl group`}
          >
            <NcImage
              src={nfts[selNft].image}
              className="object-cover w-full h-full rounded-2xl"
            />
            <div className="absolute flex items-center">
              <a href={nfts[selNft].info} target="_blank">
                <div className="absolute bg-neutral-100 bottom-6 -ml-6 bg-white flex px-1 gap-1 py-1 rounded-full items-center	">
                  <NcImage
                    src={nfts[selNft].logo}
                    className="object-cover lg:w-8 lg:h-8 w-6 h-6"
                  />
                  <span
                    className={`block text-sm text-neutral-6000 dark:text-neutral-400`}
                  >
                    @{nfts[selNft].instagram}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 lg:mt-0 lg:ml-40 flex flex-col justify-center">
          <div className="font-bold text-2xl">{nfts[selNft].name}</div>
          <div className="mt-6 font-semibold text-1xl">Listing Details</div>
          <div className="mt-2 flex gap-12 items-center ">
            <div className="flex-col gap-4">
              <div>Artist</div>
              <div>Location</div>
              <div>Date</div>
              <div>Price</div>
            </div>
            <div className="flex-col gap-4">
              <div>{nfts[selNft].artist}</div>
              <div>{nfts[selNft].location}</div>
              <div>{nfts[selNft].date}</div>
              <div>
                {!!priceData && parseInt(
                  formatEther(priceData?.[selNft]?.result as bigint)
                ).toLocaleString()}
                <b> STREETH</b>
              </div>
            </div>
          </div>
          <ButtonPrimary
            onClick={() => onPurchase()}
            className="mt-4"
            sizeClass="px-4 py-2 sm:px-5"
          >
            Purchase
          </ButtonPrimary>
        </div>
      </div>
      <div className={`${UNIQUE_CLASS} flow-root`} ref={sliderRef}>
        <div className="glide__track relative" data-glide-el="track">
          <ul className="glide__slides">
            {nfts.map((item, index) => (
              <li
                key={index}
                className={`glide__slide ${itemClassName}`}
                onClick={() => {
                  SelectNft(index);
                }}
              >
                <CardCategoryNFT item={item} />
              </li>
            ))}
          </ul>

          <div data-glide-el="controls">
            <button
              className="absolute top-1/2 left-6	p-1 bg-neutral-100/70 border-neutral-200 dark:border-neutral-6000 rounded-full flex items-center justify-center hover:bg-primary-6000"
              title="Prev"
              data-glide-dir="<"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path d="M0 12l10.975 11 2.848-2.828-6.176-6.176H24v-3.992H7.646l6.176-6.176L10.975 1 0 12z"></path>
              </svg>
            </button>

            <button
              className="absolute top-1/2 right-6 p-1 bg-neutral-100/70 border-neutral-200 dark:border-neutral-6000 rounded-full flex items-center justify-center hover:bg-primary-6000"
              onClick={(e) => {
                e.preventDefault();
              }}
              title="Next"
              data-glide-dir=">"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderNfts;
