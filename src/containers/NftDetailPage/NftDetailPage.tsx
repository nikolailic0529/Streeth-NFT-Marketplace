import React, { FC, useEffect, useState, Fragment } from "react";
import Avatar from "shared/Avatar/Avatar";
import Badge from "shared/Badge/Badge";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";
import LikeSaveBtns from "./LikeSaveBtns";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
import VerifyIcon from "components/VerifyIcon";
import { nftsLargeImgs, personNames } from "contains/fakeData";
import TimeCountDown from "./TimeCountDown";
import TabDetail from "./TabDetail";
import collectionPng from "images/nfts/collection.png";
import ItemTypeVideoIcon from "components/ItemTypeVideoIcon";
import LikeButton from "components/LikeButton";
import AccordionInfo from "./AccordionInfo";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import MARKETPLACE_ABI from "../../abis/MARKETPLACE.json";
import NFT_ABI from "../../abis/NFT.json";
import STREETH_ABI from "../../abis/STREETH.json";
import { resolveUrl } from "../../utils/resolveUrl";
import { Disclosure, Dialog, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { getAddress, parseEther, formatEther } from "viem";
import { Helmet } from "react-helmet";

import nftimage1 from "images/nfts/arsek1.jpg";
import nftimage2 from "images/nfts/bustart1.jpg";
import nftimage3 from "images/nfts/dank1.jpg";
import nftimage4 from "images/nfts/jorit1.jpg";

import nftlogo1 from "images/nfts/arsek2.png";
import nftlogo2 from "images/nfts/bustart2.png";
import nftlogo3 from "images/nfts/dank2.png";
import nftlogo4 from "images/nfts/jorit2.png";

const _renderLoading = () => {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

const nfts = [
  {
    name: "HOME",
    artist: "Arsek & Erase",
    location: "Rheinberg, Germany",
    logo: nftlogo1,
    image: nftimage1,
    price: "15,000,000",
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
    price: "15,000,000",
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
    price: "15,000,000",
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
    price: "15,000,000",
    date: "2015",
    instagram: "jorit",
    info: "https://artists.streeth.io/jorit/",
  },
];
export interface NftDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const NftDetailPage: FC<NftDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {
  type NFTInfo = {
    image: string;
    name: string;
    artist: string;
    location: string;
    date: string;
    latitude: string;
    longitude: string;
    price: string;
    description: string;
  };

  const [tokenPrice, setTokenPrice] = useState("0.001012");
  const [isOpen, setIsOpen] = useState(false);
  const [metadata, setMetadata] = useState<NFTInfo>();
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);

  const [listPrice, setListPrice] = useState("");

  const {
    state: { NFTID },
  } = useLocation();

  const { address } = useAccount();

  const { data: tokenURI } = useContractRead({
    address: process.env.REACT_APP_NFT_ADDRESS as any,
    abi: NFT_ABI,
    functionName: "tokenURI",
    args: [NFTID],
  });

  const { data: isListed, refetch: reftchListMap } = useContractRead({
    address: process.env.REACT_APP_MARKETPLACE_ADDRESS as any,
    abi: MARKETPLACE_ABI,
    functionName: "listedMap",
    args: [NFTID],
  });

  const { data: ownerAddress, refetch } = useContractRead({
    address: process.env.REACT_APP_MARKETPLACE_ADDRESS as any,
    abi: MARKETPLACE_ABI,
    functionName: "ownerMap",
    args: [NFTID],
  });

  const { data: priceData, refetch: refetchPrice } = useContractRead({
    address: process.env.REACT_APP_MARKETPLACE_ADDRESS as any,
    abi: MARKETPLACE_ABI,
    functionName: "price",
    args: [NFTID],
  });

  const { data, writeAsync: buy } = useContractWrite({
    address: process.env.REACT_APP_MARKETPLACE_ADDRESS as any,
    abi: MARKETPLACE_ABI,
    functionName: "buy",
  });

  const { data: openTradeData, writeAsync: openTrade } = useContractWrite({
    address: process.env.REACT_APP_MARKETPLACE_ADDRESS as any,
    abi: MARKETPLACE_ABI,
    functionName: "openTrade",
  });

  const { data: closeTradeData, writeAsync: closeTrade } = useContractWrite({
    address: process.env.REACT_APP_MARKETPLACE_ADDRESS as any,
    abi: MARKETPLACE_ABI,
    functionName: "closeTrade",
  });

  const { data: approveData, writeAsync: approve } = useContractWrite({
    address: process.env.REACT_APP_STREETH_ADDRESS as any,
    abi: STREETH_ABI,
    functionName: "approve",
  });

  const { data: allowanceInfo } = useContractRead({
    address: process.env.REACT_APP_STREETH_ADDRESS as any,
    abi: STREETH_ABI,
    functionName: "allowance",
    args: [address, process.env.REACT_APP_MARKETPLACE_ADDRESS],
  });

  const { isLoading: isLoadingApprove, isSuccess: isSuccessApprove } =
    useWaitForTransaction({
      hash: approveData?.hash,
    });

  const { isLoading: isLoadingOpen, isSuccess: isSuccessOpen } =
    useWaitForTransaction({
      hash: openTradeData?.hash,
    });

  const { isLoading: isLoadingClose, isSuccess: isSuccessClose } =
    useWaitForTransaction({
      hash: closeTradeData?.hash,
    });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleApprove = async () => {
    await approve?.({
      args: [process.env.REACT_APP_MARKETPLACE_ADDRESS, priceData as any],
    });
  };

  const handleBuy = async () => {
    if (formatEther(allowanceInfo as any) < formatEther(priceData as any)) {
      await handleApprove();
    } else {
      await buy?.({
        args: [[NFTID]],
      });
    }
  };

  const OpenTradeFunc = async () => {
    if (listPrice === "") return;
    await openTrade?.({
      args: [NFTID, parseEther(listPrice as any)],
    });
  };

  const CloseTradeFunc = async () => {
    await closeTrade?.({
      args: [NFTID],
    });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    let ignore = false;

    const loadTokenPrice = async () => {
      const data = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=streeth&vs_currencies=usd"
      );
      if (!ignore) {
        data.json().then((response) => setTokenPrice(response.streeth.usd));
      }
    };
    loadTokenPrice();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadMetadata = async () => {
      setIsMetadataLoading(true);
      const IPFSData = await fetch(resolveUrl(tokenURI as string));
      if (!ignore) {
        IPFSData.json().then((response) => setMetadata(response));
      }
      setIsMetadataLoading(false);
    };
    if (tokenURI) loadMetadata();
    return () => {
      ignore = true;
    };
  }, [tokenURI]);

  useEffect(() => {
    const buyNFT = async () => {
      await buy?.({
        args: [[NFTID]],
      });
    };
    if (isSuccessApprove && !isLoadingApprove) {
      buyNFT();
    }
    return () => {};
  }, [isSuccessApprove, isLoadingApprove]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      refetch();
      reftchListMap();
    }
    return () => {};
  }, [isSuccess, isLoading]);

  useEffect(() => {
    if (isSuccessOpen && !isLoadingOpen) {
      setListPrice("");
      setIsOpen(false);
      refetchPrice();
      reftchListMap();
    }
    return () => {};
  }, [isSuccessOpen, isLoadingOpen]);

  useEffect(() => {
    if (isSuccessClose && !isLoadingClose) {
      setListPrice("");
      reftchListMap();
    }
    return () => {};
  }, [isSuccessClose, isLoadingClose]);

  const renderSection1 = () => {
    return (
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {/* ---------- 1 ----------  */}
        <div className="pb-9 space-y-5">
          {/* <div className="flex justify-between items-center">
            <Badge name="Virtual Worlds" color="green" />
            <LikeSaveBtns />
          </div> */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            {metadata?.name}
          </h2>

          {/* ---------- 4 ----------  */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
            <div className="flex items-center ">
              <Avatar
                sizeClass="h-9 w-9"
                radius="rounded-full"
                imgUrl={
                  nfts.filter((item) => item.name === metadata?.name)[0]?.logo
                }
                userName={metadata?.artist}
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Creator</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                  <span>{metadata?.artist}</span>
                  {/* <VerifyIcon iconClass="w-4 h-4" /> */}
                </span>
              </span>
            </div>
            <div className="hidden sm:block h-6 border-l border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex items-center">
              <Avatar
                imgUrl={collectionPng}
                sizeClass="h-9 w-9"
                radius="rounded-full"
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Collection</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                  <span>{"Streethers"}</span>
                  {/* <VerifyIcon iconClass="w-4 h-4" /> */}
                </span>
              </span>
            </div>
          </div>
        </div>

        <Disclosure defaultOpen as="div" className="mt-2 md:mt-4">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 rounded-lg hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
                <span>Details</span>
                <ChevronUpIcon
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-5 h-5 text-neutral-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 flex flex-col text-xs text-neutral-500 dark:text-neutral-400 overflow-hidden">
                {/* <span>2000 x 2000 px.IMAGE(685KB)</span> */}
                <span>Location</span>
                <span className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
                  {metadata?.location}
                </span>

                <br />
                <span>Latitude</span>
                <span className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
                  {metadata?.latitude}
                </span>

                <br />
                <span>Longitude</span>
                <span className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
                  {metadata?.longitude}
                </span>

                <br />
                <span>Date</span>
                <span className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
                  {metadata?.date}
                </span>

                <br />
                <span>Owner Address</span>
                <span className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
                  {ownerAddress as string}
                </span>

                <br />
                <span>Contract Address</span>
                <span className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
                  {process.env.REACT_APP_NFT_ADDRESS}
                </span>

                <br />
                <span>Token ID</span>
                <span className="text-base text-neutral-900 dark:text-neutral-100">
                  {NFTID}
                </span>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        {/* ---------- 6 ----------  */}
        {/* <div className="py-9">
          <TimeCountDown />
        </div> */}

        {/* ---------- 7 ----------  */}
        {/* PRICE */}
        <div className="pb-9 pt-14 mt-2 md:mt-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 flex flex-col sm:flex-row items-baseline p-6 border-2 border-green-500 rounded-xl relative">
              <span className="absolute bottom-full translate-y-1 py-1 px-1.5 bg-white dark:bg-neutral-900 text-sm text-neutral-500 dark:text-neutral-400">
                Current Price
              </span>
              <span className="text-xl xl:text-2xl font-semibold text-green-500">
                {formatEther((priceData as any) ?? "")} STREETH
              </span>
              <span className="text-lg text-neutral-400 sm:ml-5">
                ( ≈ $
                {(
                  parseFloat(tokenPrice) *
                  parseFloat(formatEther((priceData as any) ?? ""))
                ).toFixed(3)}
                )
              </span>
            </div>

            {/* <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-5 mt-2 sm:mt-0 sm:ml-10">
              [96 in stock]
            </span> */}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <ButtonPrimary
              className="flex-1"
              loading={
                isLoading || isLoadingApprove || isLoadingClose || isLoadingOpen
              }
              disabled={
                ownerAddress !== undefined &&
                getAddress(ownerAddress as any) !==
                  getAddress(address as any) &&
                !isListed
              }
              onClick={() =>
                ownerAddress &&
                getAddress(ownerAddress as any) !== getAddress(address as any)
                  ? isListed && handleBuy()
                  : !isListed
                  ? openModal()
                  : CloseTradeFunc()
              }
            >
              {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 12H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg> */}

              <span className="ml-2.5">
                {ownerAddress !== undefined &&
                getAddress(ownerAddress as any) !== getAddress(address as any)
                  ? isListed
                    ? "Buy"
                    : "NFT not listed"
                  : !isListed
                  ? "Open Trade"
                  : "Close Trade"}
              </span>
            </ButtonPrimary>
            <ButtonSecondary href={"/"} className="flex-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9.57 5.92993L3.5 11.9999L9.57 18.0699"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.5 12H3.67004"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="ml-2.5"> Go Back Home</span>
            </ButtonSecondary>
          </div>
        </div>

        {/* ---------- 9 ----------  */}
        {/* <div className="pt-9">
          <TabDetail />
        </div> */}
      </div>
    );
  };

  return (
    <div
      className={`nc-NftDetailPage  ${className}`}
      data-nc-id="NftDetailPage"
    >
      <Helmet>
        <title>Explore NFT || NFT Marketplace</title>
      </Helmet>
      {/* MAIn */}
      <main className="container mt-11 flex ">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
          {/* CONTENT */}
          <div className="space-y-8 lg:space-y-10">
            {/* HEADING */}
            <div className="relative">
              {metadata?.image && (
                <img
                  src={resolveUrl(metadata?.image as string)}
                  className="w-full h-full rounded-3xl overflow-hidden sm:w-3/4 sm:h-3/4 m-auto"
                />
              )}
              {/* META TYPE */}
              {/* <ItemTypeVideoIcon className="absolute left-3 top-3  w-8 h-8 md:w-10 md:h-10" /> */}

              {/* META FAVORITES */}
              {/* <LikeButton className="absolute right-3 top-3 " /> */}
            </div>

            <AccordionInfo description={metadata?.description} NFTID={NFTID} />
          </div>

          {/* SIDEBAR */}
          <div className="pt-10 lg:pt-0 xl:pl-10 border-t-2 border-neutral-200 dark:border-neutral-700 lg:border-t-0">
            {renderSection1()}
          </div>
        </div>
      </main>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    List NFT
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center">
                      Are you sure you want to sell your nft?
                    </p>
                  </div>

                  <div className="mt-2 flex justify-center items-center">
                    <span className="text-sm text-gray-500 mr-2">Price:</span>
                    <input
                      className="block border py-1 px-2 border-green-500 rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                      name="price"
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                    />
                  </div>

                  <div className="mt-4 flex gap-4">
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={OpenTradeFunc}
                      disabled={isLoadingOpen}
                    >
                      {isLoadingOpen && _renderLoading()}
                      Open Trade
                    </button>
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* OTHER SECTION */}
      {!isPreviewMode && (
        <div className="container py-24 lg:py-32">
          {/* SECTION 1 */}
          <div className="relative py-24 lg:py-28">
            <BackgroundSection />
            <SectionSliderCategories />
          </div>

          {/* SECTION */}
          {/* <SectionBecomeAnAuthor className="pt-24 lg:pt-32" /> */}
        </div>
      )}
    </div>
  );
};

export default NftDetailPage;
