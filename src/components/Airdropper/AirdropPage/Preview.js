import React, { useContext, useEffect, useState } from "react";
import Info from "./Info";
import PreviewDetails from "../../Common/PreviewDetails";
import TwitterSVG from "../../../svgs/Socials/twitter";
import DribbleSVG from "../../../svgs/Socials/dribble";
import PreviewHeader from "../../Common/PreviewHeader";
import { getTokenInfo } from "../../../utils/tokenInfo";
import { Link } from "react-router-dom";
import GithubSVG from "svgs/Socials/github";
import { ThemeContext } from "context/ThemeContext/ThemeProvider";
import LinkedinSVG from "svgs/Socials/linkedin";
import { useDefaultChainId } from "config/useDefaultChainId";
import { formatBigToNum } from "utils/numberFormat";
import { parseEther } from "ethers/lib/utils";

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
  airdrop,
}) {
  const initTokenData = {
    TokenName: "",
    TokenSymbol: "",
    TokenDecimals: "",
    TotalSupply: "",
  };
  const { theme } = useContext(ThemeContext);
  const chainId = useDefaultChainId();
  console.log(description, "description");
  const [tokenData, setTokenData] = useState({ ...initTokenData });
  useEffect(() => {
    const handleFetch = async () => {
      if (!airdrop.tokenAddress) return
      const tokenInfo = await getTokenInfo(chainId, airdrop.tokenAddress);
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
        admin={false}
        airdrop={airdrop}
      />

      <div className="mt-6 flex md:hidden gap-5 items-center ml-[70px]">
        {airdrop.linkedin !== "" && (
          <Link to={airdrop.linkedin}>
            <LinkedinSVG
              className="w-5 h-5"
              outer={`${theme === "dark" ? "#fff" : "#464754"}`}
              inner={`${theme === "dark" ? "#464754" : "#fff"}`}
            />
          </Link>
        )}

        {airdrop.twitter !== "" && (
          <Link to={airdrop.twitter}>
            <TwitterSVG className="fill-dark-text dark:fill-light-text hover:cursor-pointer" />
          </Link>
        )}
        {airdrop.dribble && (
          <Link to={airdrop.dribble}>
            <DribbleSVG className="fill-dark-text dark:fill-light-text hover:cursor-pointer" />
          </Link>
        )}
        {airdrop.github !== "" && (
          <Link to={airdrop.github}>
            <GithubSVG
              className="w-5 h-5"
              outer={`${theme === "dark" ? "#fff" : "#464754"}`}
              inner={`${theme === "dark" ? "#464754" : "#fff"}`}
            />
          </Link>
        )}
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
        <PreviewDetails name={"Token Name"} value={airdrop.name} />
        <PreviewDetails name={"Token Symbol"} value={airdrop.tokenSymbol} />
        <PreviewDetails name={"Token Decimals"} value={airdrop.tokenDecimals} />
        <PreviewDetails
          name={"Total Supply"}
          value={formatBigToNum(airdrop.tokenSupply, airdrop.tokenDecimals)}
        />
      </div>

      <div className="mt-5">
        <PreviewHeader heading={"Airdrop Details"} />
        <PreviewDetails
          name={"Airdrop Address"}
          value={airdrop.airdropAddress}
          enable_copy
        />
        <PreviewDetails name={"Start On"} value={starts_on} />
      </div>
    </div>
  );
}
