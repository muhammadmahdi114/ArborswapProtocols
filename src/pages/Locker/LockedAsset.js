import React, { useEffect, useState } from "react";
import { getTokenLockInfos, getLpLockInfos } from "utils/getLockList";

import { useNavigate, useParams } from "react-router-dom";
import BaseLayout from "../../components/BaseLayout/BaseLayout";
import LockedAssetBase from "../../components/LockedAsset";
import { useDefaultChainId } from "config/useDefaultChainId";
import { useModal } from "react-simple-modal-provider";
import axios from "axios";
import { BACKEND_URL } from "config/constants/LaunchpadAddress";

export default function LockedAsset({ type }) {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { open: openLoadingModal, close: closeLoadingModal } =
  useModal("LoadingModal");

  const chainId = useDefaultChainId();

  const handleLPInfo = async (id) => {
    const response = await axios.get(`${BACKEND_URL}/api/lock/${id}` )
    console.log(response.data, "response.data")
    return response.data.lock;
  }
        
  useEffect(() => {
    let active = true;

    const handleFetch = async () => {
      setAsset(false);
      openLoadingModal();
      try {
        if (type === "token") {
          const info = await getTokenLockInfos([id], chainId);
          if (!active) {
            return;

          }
          if (info.success) {
            setAsset(info.data[0]);
            setReady(true);
            return;
          } else {
            // navigate("/locked-assets");
          }
        }
        if (type === "lp-token") {
          const infoLp = await handleLPInfo(id);
          console.log("infoLp", infoLp);
          if (!active) {
            return;
          }
          if (infoLp) {
            setAsset(infoLp);
            setReady(true);
            closeLoadingModal();
            return;
          } else {
            // navigate("/locked-assets");
          }
        }
        if (!active) {
          return;
        }
      } catch (error) {}
    };
    handleFetch(type, id);

    return () => {
      active = false;
    };
  }, [type, id, navigate, chainId]);

  return ready ? (
    // <BaseLayout title={asset && `${asset.name1}/${asset.name2}`} page_name={'Locked Assets'} subpage>
    <BaseLayout title={type} page_name={"Locked Assets"} subpage>
      <LockedAssetBase asset={asset} type={type} token={false} />
    </BaseLayout>
  ) : (
    <></>
  );
}
