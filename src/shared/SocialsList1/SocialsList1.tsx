import { SocialType } from "shared/SocialsShare/SocialsShare";
import React, { FC } from "react";
import twitter from "images/Twitter.svg";
import medium from "images/Medium.svg";
import discord from "images/Discord.svg";
import tiktok from "images/Tiktok.svg";
import instagram from "images/Instagram.svg";
import telegram from "images/Telegram.svg";

export interface SocialsList1Props {
  className?: string;
}

const socials: SocialType[] = [
  { name: "Twitter", icon: twitter, href: "https://twitter.com/onstreeth" },
  { name: "Medium", icon: medium, href: "https://medium.com/@onstreeth" },
  { name: "Discord", icon: discord, href: "https://discord.gg/streeth" },
  { name: "Tiktok", icon: tiktok, href: "https://www.tiktok.com/@onstreeth" },
  { name: "Instagram", icon: instagram, href: "https://www.instagram.com/onstreeth" },
  { name: "Telegram", icon: telegram, href: "https://t.me/streethofficial" },
];

const SocialsList1: FC<SocialsList1Props> = ({ className = "flex items-center justify-center gap-6 md:gap-12" }) => {
  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        href={item.href}
        className="flex items-center text-2xl text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white leading-none space-x-2 group"
        key={index}
      >
        <div className="flex-shrink-0 w-6 ">
          <img src={item.icon} alt="" />
        </div>
        {/* <span className="hidden lg:block text-sm">{item.name}</span> */}
      </a>
    );
  };

  return (
    <div className={`nc-SocialsList1 ${className}`} data-nc-id="SocialsList1">
      {socials.map(renderItem)}
    </div>
  );
};

export default SocialsList1;
