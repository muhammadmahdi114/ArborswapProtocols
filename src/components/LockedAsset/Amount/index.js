import React, { useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import Timer from "./Timer/Timer";
import { formatUnits } from "ethers/lib/utils";
import TokenImage from "components/Common/TokenImage";
import TokenLockerAbi from "../../../config/abi/TokenLock.json";
import { Contract } from "ethers";
import { useEthers } from "@usedapp/core";
import { toast } from "react-toastify";

export default function Amount({ type, asset, tokenInfo, lpInfo }) {
  const { account, library } = useEthers();

  console.log(asset, tokenInfo, lpInfo, "asset, tokenInfo, lpInfo");

  const [earningsWithdrawn, setEarningsWithdrawn] = useState(false);
  const [owner, setOwner] = useState(null);
  const amount = useMemo(() => {
    return asset && tokenInfo
      ? formatUnits(asset?.amount, tokenInfo?.decimals) * 1
      : 0;
  }, [asset, tokenInfo]);
  console.log(asset,"amount")
  const getOwner= async () => {
    const contract = new Contract(
      asset.address,
      TokenLockerAbi,
      library.getSigner()
    );
    const owner = await contract.owner();
    setOwner(owner);
  };

  useEffect(() => {
    if (account) {
      getOwner();
    }
  }, [account]);


  const handleClaim = async () => {
    if (owner !== account) {
      toast.error("You Are Not The Owner Of This Asset");
      return;
    }
    if (earningsWithdrawn) {
      toast.error("You Have Already Withdrawn Your Earnings");
      return;
    }
    const contract = new Contract(
      asset.address,
      TokenLockerAbi,
      library.getSigner()
    );
    try {
      const tx = await contract.withdrawBNB();
      await tx.wait();
      toast.success("Earnings Withdrawn Successfully");
      setEarningsWithdrawn(true);
    } catch (err) {
      console.log(err);
      toast.error("Error Occured While Withdrawing Earnings");
    }
  };
  return (
    <div className="flex flex-col p-9 font-gilroy bg-white dark:bg-dark-1 rounded-[20px]">
      <span className="text-sm font-medium text-gray dark:text-gray-dark">
        Amount
      </span>

      <div className="flex items-center mt-3">
        {lpInfo && asset && (
          <div className="flex items-center">
            <TokenImage
              className="w-10 h-10 relative z-10"
              src={asset.logoImage}
              alt="BLANK"
            />
            {lpInfo && lpInfo.token1.symbol === "WBNB" ? (
              <img
                className="w-8 h-8 -ml-5 mr-3 relative z-0"
                src="/images/cards/bnb.svg"
                alt="BNB"
              />
            ) : null}
          </div>
        )}

        <span className="text-2xl font-bold text-dark-text dark:text-light-text ml-3">
          {amount.toLocaleString()}
        </span>
      </div>
      {owner === account && (
      <div className="flex mt-10">
        <button
          onClick={handleClaim}
          disabled={asset.isWithdrawn}
          className="w-full cursor-pointer bg-primary-green bg-opacity-100 hover:bg-opacity-90 disabled:bg-opacity-60  rounded-md text-white dark:text-white font-bold py-4"
        >
          Claim
        </button>
      </div>
      )}

      <div className="flex justify-center mt-7">
        <span className="text-sm font-medium text-gray dark:text-gray-dark">
          Unlocks in
        </span>
      </div>

      <Timer date={asset?.unlockDate?.hex * 1000} />
    </div>
  );
}
