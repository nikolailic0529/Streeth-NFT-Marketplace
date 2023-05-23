import React, { FC, useEffect, useId, useRef } from "react";
import Heading from "components/Heading/Heading";
import Glide from "@glidejs/glide";
import CardCategory5 from "components/CardCategory5/CardCategory5";
import { nftsDrops, nftsLogos } from "contains/fakeData";

export interface SectionSliderCategoriesProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
}

const ntfsCatNames = [
  "Dank",
  "Arsek & Erase",
  "Bustart",
  "Dragon76",
  "TBA",
  "Sports",
  "Technology",
];

const nftsDates = ["Q3 2023", "Q4 2023", "TBA", "TBA", "TBA"];

const SectionSliderCategories: FC<SectionSliderCategoriesProps> = ({
  heading = "Upcoming Streeth NFTs Drops",
  subHeading = "Our upcoming collaborations with world renowned street artists. Follow our Medium for up-to-date drops’ info",
  className = "",
  itemClassName = "",
}) => {
  const sliderRef = useRef(null);
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");

  useEffect(() => {
    if (!sliderRef.current) {
      return;
    }

    const OPTIONS: Glide.Options = {
      perView: 5,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          perView: 4,
        },
        1024: {
          gap: 20,
          perView: 3.4,
        },
        768: {
          gap: 20,
          perView: 3,
        },
        640: {
          gap: 20,
          perView: 2.3,
        },
        500: {
          gap: 20,
          perView: 1.4,
        },
      },
    };

    let slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
    slider.mount();
    // @ts-ignore
    return () => slider.destroy();
  }, [sliderRef, UNIQUE_CLASS]);

  return (
    <div className={`nc-SectionSliderCategories ${className}`}>
      <div className={`${UNIQUE_CLASS} flow-root`} ref={sliderRef}>
        <Heading desc={subHeading}>{heading}</Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {[1, 1, 1, 1, 1].map((item, index) => (
              <li key={index} className={`glide__slide ${itemClassName}`}>
                <CardCategory5
                  index={index}
                  featuredImage={nftsDrops[index]}
                  logo={nftsLogos[index]}
                  name={`${ntfsCatNames[index]}`}
                  date={nftsDates[index]}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderCategories;
