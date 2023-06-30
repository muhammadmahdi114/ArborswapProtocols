import React, { useEffect, useState } from "react";
import Info from "./Info";
import PreviewDetails from "../../Common/PreviewDetails";
import TwitterSVG from "../../../svgs/Socials/twitter";
import DribbleSVG from "../../../svgs/Socials/dribble";
import PreviewHeader from "../../Common/PreviewHeader";
import { getTokenInfo } from "../../../utils/tokenInfo";
import { Link } from "react-router-dom";

export default function Preview({
  icon,
  name,
  is_private,
  tags,
  description,
  address,
  tokenAddress,
  starts_on,
  admin,
  airdrop
}) {
  const initTokenData = {
    TokenName: "",
    TokenSymbol: "",
    TokenDecimals: "",
    TotalSupply: "",
  };

  const [tokenData, setTokenData] = useState({ ...initTokenData });

  useEffect(() => {
    const handleFetch = async () => {
      const tokenInfo = await getTokenInfo(tokenAddress);
      var totalS = tokenInfo.data.totalSupply / 10 ** tokenInfo.data.decimals;
      setTokenData((prevState) => ({
        ...prevState,
        TokenName: tokenInfo.data.name,
        TokenSymbol: tokenInfo.data.symbol,
        TokenDecimals: tokenInfo.data.decimals,
        TotalSupply: totalS,
      }));
    };
    handleFetch();
  });

  return (
    <div className="px-9 py-9 my-4">
      <Info
        name={name}
        icon={icon}
        is_private={is_private}
        tags={tags}
        admin={admin}
        airdrop={airdrop}
      />

      <div className="mt-6 flex md:hidden gap-5 ml-[70px]">
        <Link to={airdrop.info.description[4]}>
          <TwitterSVG className="fill-dark-text dark:fill-light-text hover:cursor-pointer" />
        </Link>
        <Link to={airdrop.info.description[5]}>
          <DribbleSVG className="fill-dark-text dark:fill-light-text hover:cursor-pointer" />
        </Link>
      </div>
      <div className="mt-10">
        <span className="font-medium text-sm text-gray dark:text-gray-dark">
          {description}
        </span>
      </div>

      <div className="mt-5">
        <PreviewHeader heading={"Token Details"} />
        <PreviewDetails
          name={"Token Address"}
          value={tokenAddress}
          enable_copy
        />
        <PreviewDetails name={"Token Name"} value={tokenData.TokenName} />
        <PreviewDetails name={"Token Symbol"} value={tokenData.TokenSymbol} />
        <PreviewDetails
          name={"Token Decimals"}
          value={tokenData.TokenDecimals}
        />
        <PreviewDetails
          name={"Total Supply"}
          value={tokenData.TotalSupply.toLocaleString()}
        />
      </div>

      <div className="mt-5">
        <PreviewHeader heading={"Airdrop Details"} />
        <PreviewDetails name={"Airdrop Address"} value={address} enable_copy />
        <PreviewDetails name={"Start On"} value={starts_on} />
      </div>
    </div>
  );
}
