import CardLarge1 from "components/CardLarge1/CardLarge1";
import Heading from "components/Heading/Heading";
import { nftsLargeImgs } from "contains/fakeData";
import React, { FC, useState } from "react";

export interface SectionLargeSliderProps {
  className?: string;
}

const SectionLargeSlider: FC<SectionLargeSliderProps> = ({
  className = "",
}) => {
  const [indexActive, setIndexActive] = useState(0);

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= 2) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return 2;
      }
      return state - 1;
    });
  };

  return (
    <>
      <Heading
        className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50"
        fontClass="text-3xl md:text-4xl 2xl:text-5xl font-semibold"
        isCenter
        desc=""
      >
        Featured NFT Of The Month.
      </Heading>
      <div className={`nc-SectionLargeSlider relative ${className}`}>
        {[1, 1, 1].map((_, index) =>
          indexActive === index ? (
            <CardLarge1
              key={index}
              isShowing
              featuredImgUrl={nftsLargeImgs[index]}
              onClickNext={handleClickNext}
              onClickPrev={handleClickPrev}
            />
          ) : null
        )}
      </div>
    </>
  );
};

export default SectionLargeSlider;
