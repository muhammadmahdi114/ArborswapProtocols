import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BaseLayout from "../../components/BaseLayout/BaseLayout";
import AirdropPageBase from "../../components/Airdropper/AirdropPage";
import AddAllocations from "components/Airdropper/AirdropPage/Modal/AddAllocations";
import RemoveAllocations from "components/Airdropper/AirdropPage/Modal/RemoveAllocations";
import StartPrivateAirdrop from "../../components/Airdropper/AirdropPage/Modal/StartPrivateAirdrop";
import StartPublicAirdrop from "../../components/Airdropper/AirdropPage/Modal/StartPublicAirdrop";
import { getAirdropInfos, getAirdropStatus } from "utils/getAirdropList";
import { useEthers } from "@usedapp/core";
import getAirdropOwner from "hooks/useAirdropOwner";
import getIsOwner from "hooks/useIsOwner";
import { getTokenInfo } from "utils/tokenInfo";
import { useDefaultChainId } from "config/useDefaultChainId";
import { useModal } from "react-simple-modal-provider";
import axios from "axios";
import { BACKEND_URL } from "config/constants/LaunchpadAddress";

export default function PoolPage() {
  const [modal, showModal] = useState(0);
  //const [admin] = useState(true);
  const [adminMode, setAdminMode] = useState(false);
  const { id } = useParams();
  const [addressId, setAddressId] = useState(null);
  const [status, setStatus] = useState("k");
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState();
  const [tokenInfo, setTokenInfo] = useState();
  const [airdropInfo, setAirdropInfo] = useState();
  const [owner, setOwner] = useState();
  const navigate = useNavigate();
  const { account } = useEthers();
  const chainId = useDefaultChainId();
  const { open: openLoadingModal, close: closeLoadingModal } =
    useModal("LoadingModal");
  async function getOwners () {
    if (!addressId) return;
    try{
    const owner = await getAirdropOwner(addressId);
    setOwner(owner);
    const isOwner = await getIsOwner(addressId, account);
    
    if (isOwner) {
      setAdminMode(true);
    } else {
      setAdminMode(false);
    }
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    getOwners();
  }, [owner, account,addressId]);

  const getAirdrop = async ([id]) => {
    const response = await axios.get(`${BACKEND_URL}/api/airdrop/${id}`);
    console.log(response, "response");
    setAirdropInfo(response.data);
    return response;
  };

  useEffect(() => {
    let activated = true;
    const handleFetch = async () => {
      openLoadingModal();
      try {
        const info = await getAirdrop([id]);
        const airdropId = info.data.airdrop.airdropAddress;

        setAddressId(airdropId);
        console.log(info);
        if (info) {
          setToken(info.data.airdrop.tokenAddress);
        }

        if (info) {
          setTokenInfo(info.data.airdrop);
        }
        const statuses = await getAirdropStatus(chainId, [airdropId]);
        const isStarted = statuses.data[0].airDropStarted;
        const isEmpty = statuses.data[0].isEmpty;
        const isCancelled = statuses.data[0].airdropCancelled;

        if (isStarted === true && !isEmpty && !isCancelled) {
          setStatus("Live");
        }

        if (isStarted === false && isEmpty === false && isCancelled === false) {
          setStatus("Timed");
        }

        if (isEmpty === true || isCancelled === true) {
          setStatus("Ended");
        }

        if (!activated) {
          return;
        }
        
        if (info) {
          console.log(info,"airdropInfo")
          document.title = info.data.airdrop.name
          setReady(true);
          closeLoadingModal();
          return;
        } else {
          // navigate("/airdropper/airdrops");
        }

        if (!activated) {
          return;
        }
      } catch (error) {
        console.log(error);
        closeLoadingModal();
      }
    };
    handleFetch(id);

    return () => {
      activated = false;
    };
  }, [id, navigate]);

  return ready ? (
    <div className="w-full">
      {modal !== 0 && (
        <div className="fixed z-50  top-0 left-0">
          {modal === 1 && (
            <AddAllocations
              decimals={tokenInfo.tokenDecimals}
              tokenAddress={token}
              showModal={showModal}
            />
          )}
          {modal === 2 && <RemoveAllocations showModal={showModal} />}
          {modal === 3 && (
            <StartPrivateAirdrop
              decimals={tokenInfo.tokenDecimals}
              tokenAddress={token}
              showModal={showModal}
              modal={modal}
            />
          )}
          {modal === 4 && (
            <StartPublicAirdrop
              decimals={tokenInfo.tokenDecimals}
              tokenAddress={token}
              showModal={showModal}
              modal={modal}
            />
          )}
        </div>
      )}
      <BaseLayout
        page_name={"Airdrops"}
        title={airdropInfo.name}
        subpage
        admin={adminMode}
        setAdminMode={setAdminMode}
      >
        <AirdropPageBase
          // tokenInfo={tokenInfo}
          status={status}
          airdrop={airdropInfo.airdrop}
          info={airdropInfo}
          showModal={showModal}
          admin={adminMode}
          owner={owner}
        />
      </BaseLayout>
    </div>
  ) : (
    <></>
  );
}
