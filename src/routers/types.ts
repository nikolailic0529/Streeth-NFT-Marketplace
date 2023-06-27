import { ComponentType } from "react";

export interface LocationStates {
  "/"?: {};
  "/#"?: {};
  "/home2"?: {};
  "/home3"?: {};
  "/nft-detail"?: {};
  "/page-collection"?: {};
  "/page-search"?: {};
  "/page-author"?: {};
  "/mint"?: {};
  "/home-header-2"?: {};
  "/connect-wallet"?: {};
  "/account"?: {};
  "/blog"?: {};
  "/blog-single"?: {};
  "/about"?: {};
  "/contact"?: {};
  "/login"?: {};
  "/signup"?: {};
  "/forgot-pass"?: {};
  "/page404"?: {};
  "/subscription"?: {};
}

export type PathName = keyof LocationStates;

export interface Page {
  path: PathName;
  component: ComponentType<Object>;
}
