import React, { useState, useEffect } from "react";
import Amount from "./Amount";
import Preview from "./Preview/Preview";
import { getLpInfo } from "utils/lpInfo";
import { getTokenInfo } from "utils/tokenInfo";
import { useEthers } from "@usedapp/core";
import LpLogoUpdate from "pages/Locker/LpLogoUpdate";

export default function LockedAssetBase({ asset, type ,token=true}) {
  const { chainId, account } = useEthers();
  const [lpInfo, setLpInfo] = useState();
  const [tokenInfo, setTokenInfo] = useState();
  const [ready, setReady] = useState(false);
  const [edit, setEdit] = useState(false);
  const [admin, setAdmin] = useState(false);
  console.log(asset)
  useEffect(() => {
    if (chainId) {
        setLpInfo(asset.token.data);

      getTokenInfo(chainId, asset.tokenAddress).then((info) => {
        setTokenInfo(info.data);
      });
    }
    if (account) {
      if (account.toLowerCase() === asset.owner.toLowerCase()) {
        setAdmin(true);
      }
    }
  }, [asset, chainId, account]);

  useEffect(() => {
    if (typeof lpInfo !== "undefined" && (typeof tokenInfo !== "undefined")) {
      setReady(true);
      return;
    }
  }, [lpInfo, tokenInfo]);
  return (
    <div className="w-full flex justify-center">
      <div className="w-full px-4 md:px-0 md:flex md:w-10/12 md:gap-7">
        {!edit && (
          <>
            <div className="w-full md:w-[60%] bg-white dark:bg-dark-1 rounded-[10px]">
              {ready && (
                <Preview
                  type={type}
                  asset={asset}
                  lpInfo={lpInfo}
                  tokenInfo={tokenInfo}
                  setEdit={setEdit}
                  isAdmin={admin}
                />
              )}
            </div>
            <div className="mt-14 md:mt-0 md:w-[40%] ">
              {ready && (
                <Amount
                  type={type}
                  asset={asset}
                  lpInfo={lpInfo}
                  tokenInfo={tokenInfo}
                />
              )}
            </div>
          </>
        )}
        {edit && <LpLogoUpdate setEdit={setEdit} asset={asset} />}
      </div>
    </div>
  );
}
