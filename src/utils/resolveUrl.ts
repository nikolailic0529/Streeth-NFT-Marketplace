export const IPFS_GATEWAYS = {
  IPFS_DEFAULT_GATEWAY: "https://ipfs.io/ipfs/",
  IPFS_PINATA_GATEWAY: "https://gateway.pinata.cloud/ipfs/",
  IPFS_THIREDWEB_GATEWAY: "https://ipfs.thirdwebcdn.com/ipfs/",
};
export const resolveUrl = (url: string) => {
  return url.replace("ipfs://", IPFS_GATEWAYS.IPFS_DEFAULT_GATEWAY);
};
