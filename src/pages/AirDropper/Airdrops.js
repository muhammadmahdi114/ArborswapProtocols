import React, { useState, useEffect } from "react";
import {
  getAirdropList,
  getAirdropInfos,
  sortAirdrops,
  getPublicAirdrops,
} from "utils/getAirdropList";
import { useDefaultChainId } from "config/useDefaultChainId";

import AirdropsBase from "../../components/Airdropper/Airdrops";
import BaseLayout from "../../components/BaseLayout/BaseLayout";
import HomeLayout from "../../components/HomeLayout";
import { useDocumentTitle } from "../../hooks/setDocumentTitle";
import AirplaneSVG from "../../svgs/Sidebar/airplane";
import { useModal } from "react-simple-modal-provider";
import { BACKEND_URL } from "config/constants/LaunchpadAddress";
import axios from "axios";
const Tabs = [
  {
    id: 1,
    tabName: "Live",
  },
  {
    id: 2,
    tabName: "Upcoming",
  },
  {
    id: 3,
    tabName: "Ended",
  },
];

export default function Airdrops() {
  useDocumentTitle("Airdrops");

  const { open: openLoadingModal, close: closeLoadingModal } =
    useModal("LoadingModal");
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [endedList, setEndedList] = useState([]);
  const [timedList, setTimedList] = useState([]);
  const [liveList, setLiveList] = useState([]);
  const [publicList, setPublicList] = useState([]);
  const [filteredAirdrops, setFilteredAirdrops] = useState([]);
  const chainId = useDefaultChainId();

  const getAirdropListFromBackend = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/airdrop/`, {
      params: {
        chainId: chainId,
      },
    });
    console.log(response,"response")
    return response;
  };
  const handleFetch = async () => {
    setReady(false);
    openLoadingModal();
    try {
      const airdrops = await getAirdropListFromBackend();
 
  
 
      if (airdrops) {
        setLiveList(airdrops.data)
      }
      closeLoadingModal();
      setReady(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <BaseLayout
      title={"Airdropper"}
      title_img={<AirplaneSVG className="md:hidden fill-dim-text" />}
      page_name={"Airdrops"}
      page_description={"Airdrop to multiple users in few clicks."}
    >
      <HomeLayout
        airdrop
        tabs={Tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {ready ? (
          <AirdropsBase
            timedList={timedList}
            liveList={liveList}
            endedList={endedList}
            publicList={publicList}
            activeTab={activeTab}
          />
        ) : (
          <></>
        )}
      </HomeLayout>
    </BaseLayout>
  );
}
