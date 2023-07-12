import React, { useState, useEffect } from "react";
import {
  getLiquidityLockList,
  getTokenLockList,
  getTokenLockInfos,
  getLpLockInfos,
} from "utils/getLockList";
import BaseLayout from "../../components/BaseLayout/BaseLayout";
import HomeLayout from "../../components/HomeLayout";
import LockerBase from "../../components/Locker";
import SheildSecuritySVG from "../../svgs/Sidebar/shield_security";
import { useDefaultChainId } from "config/useDefaultChainId";
import { useModal } from "react-simple-modal-provider";
import axios from "axios";
import { BACKEND_URL } from "config/constants/LaunchpadAddress";
export default function Locker() {
  const [cardFormat, setCardFormat] = useState("grid");
  const [itemSelected, setItemSelected] = useState("liquidity");
  const [ready, setReady] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [liquidityList, setLiquidityList] = useState([]);

  const chainId = useDefaultChainId();
  console.log("chainId", chainId);
  const { open: openLoadingModal, close: closeLoadingModal } =
    useModal("LoadingModal");
  const fetchLp = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/lock/`, {
      params: {
        liquidity: true,
        chainId: chainId,
      },
    });
    return response;
  };

  const handleFetch = async () => {
    setReady(false);
    openLoadingModal();
    try {
      const token = await axios.get(`${BACKEND_URL}/api/lock/`, {
        params: {
          liquidity: false,
          chainId: chainId,
        },
      });
      console.log(token, "token");

      if (token.success) {
        const info = await getTokenLockInfos(token.data, chainId);
        console.log("tokenInfo", info);
        if (info.success) {
          setTokenList(info.data);
        }
      }
      const infoLp = await fetchLp();
      console.log("liquidityInfo", infoLp);
      if (infoLp) {
        for (let i = 0; i < infoLp.data.length; i++) {
          setLiquidityList((prev) => [
            ...prev,
            {
              ...infoLp.data[i].lock,
            },
          ]);
        }
      }
      closeLoadingModal();
      setReady(true);
    } catch (error) {
      console.log("error", error);
    }
  };
  console.log(liquidityList, "liquidityList")
  useEffect(() => {
    handleFetch();
  }, []);
  return (
    <BaseLayout
      title={"Locker"}
      page_name={"Locked Assets"}
      title_img={<SheildSecuritySVG className="md:hidden fill-dim-text" />}
    >
      <HomeLayout
        cardFormat={cardFormat}
        setCardFormat={setCardFormat}
        itemSelected={itemSelected}
        setItemSelected={setItemSelected}
        locker
      >
        {ready ? (
          <LockerBase
            cardFormat={cardFormat}
            itemSelected={itemSelected}
            tokenList={tokenList}
            liquidityList={liquidityList}
          />
        ) : (
          <></>
        )}
      </HomeLayout>
    </BaseLayout>
  );
}
