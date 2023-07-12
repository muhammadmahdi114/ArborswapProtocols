import React, { useState, useEffect } from "react";
import Preview from "./Preview";
import UserPanel from "./UserPanel";
import AdminPanel from "./Admin";
import { formatUnits } from "ethers/lib/utils";
import getAirdropInfo from "hooks/useAirdropInfo";
import { useParams } from "react-router-dom";
// import { getTokenInfo } from "utils/tokenInfo";
import { useEthers } from "@usedapp/core";
import { getAirdropInfos } from "utils/getAirdropList";

export default function AirdropPageBase({
  // tokenInfo,
  status,
  airdrop,
  showModal,
  admin,
  info,
}) {
  const [upcoming] = useState(true);
  const [whitelisted] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDistributed, setTotalDistributed] = useState(0);
  const [time, setTime] = useState();
  const [remaining, setRemaining] = useState(0);
  const [filledPerc, setFilledPerc] = useState(0);
  const[tokenInfo, setTokenInfo] = useState();
  const [airdropInfo, setAirdropInfo] = useState();
  const { chainId } = useEthers();

  function handleSetRemaining(allocation) {
    let filledPercNum = ((remaining - allocation) / totalAmount) * 100;
    setRemaining(remaining - allocation);
    setFilledPerc(filledPercNum);
  }
  async function getAirdrop(){
    const airdropInfo = await getAirdropInfo(airdrop.airdropAddress);
    console.log(airdropInfo,"airdropInfoOwnnnn")
    setAirdropInfo(airdropInfo);
  }
  useEffect(() => {
    getAirdrop();
  }, [airdrop]);
  useEffect(() => {
    if (typeof airdropInfo == "undefined") {
      return;
    }
    async function getTokenInfo() {
      const tokenInfos = await getAirdropInfos(chainId, [
        airdrop.airdropAddress,
      ]);
      setTokenInfo(tokenInfos);
    }
    getTokenInfo();
    if(!tokenInfo){
      return;
    }
    let totalAmountNumber = Number(
      formatUnits(tokenInfo.data[0].info.totalAmountToAirdrop, 18)
    );
    let totalDistributedNumber = Number(
      formatUnits(tokenInfo.data[0].info.totalAmountDistributed, 18)
    );
    let remainingNum = totalAmountNumber - totalDistributedNumber;
    let filledPercNum = (remainingNum / totalAmountNumber) * 100;
    setTotalAmount(totalAmountNumber);
    setTotalDistributed(totalDistributedNumber);
    setRemaining(remainingNum);
    setFilledPerc(filledPercNum);
  }, [airdropInfo,tokenInfo]);

  useEffect(() => {
    if (typeof airdropInfo == "undefined") {
      return;
    }

    var date;
    var formattedTime;

    if (info.createdAt===0) {
      date = "";
      formattedTime = "Not started yet";
    } else {
      date = new Date(info.createdAt);

      const year = date.getFullYear(); // get year (e.g. 2021)
      let month = date.getMonth() + 1; // get month (note: month is zero-indexed in JavaScript, so add 1 to get the correct month)
      let day = date.getDate(); // get day of the month (e.g. 6)
      let hours = date.getHours(); // get hours (e.g. 12)
      let minutes = date.getMinutes(); // get minutes (e.g. 30)

      if (minutes < 10) {
        minutes = "0" + minutes; // prepend a '0' character if minutes is less than 10
      }

      if (hours < 10) {
        hours = "0" + hours; // prepend a '0' character if hours is less than 10
      }

      if (day < 10) {
        day = "0" + day; // prepend a '0' character if hours is less than 10
      }

      if (month < 10) {
        month = "0" + month; // prepend a '0' character if hours is less than 10
      }

      formattedTime =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        " " +
        "UTC";
      setTime(formattedTime);
    }
  }, [airdropInfo]);
  console.log(airdrop,"airdropinindex")
  return (
    airdrop && (
      <div className="w-full flex justify-center">
        <div className="w-full px-4 md:px-0 md:flex md:w-10/12 md:gap-7">
          <div className="w-full md:w-[65%] bg-white dark:bg-dark-1 rounded-[10px]">
            <Preview
              name={airdrop.name}
              icon={airdrop.image}
              is_private={airdrop.type === "private"}
              airdrop={airdrop}
              tags={airdrop.tags.split(",")}
              description={airdrop.description}
              address={airdrop.address}
              tokenAddress={airdrop.tokenAddress}
              starts_on={time}
              ends_on={info.createdAt}
              admin={admin}
            />
          </div>

          <div className="mt-14 md:mt-0 md:w-[35%] ">
            {admin ? (
              <AdminPanel
                symbol={airdrop.tokenSymbol}
                airdrop={airdrop}
                // whitelist_address={airdrop.info.numberWLAddresses.toNumber()}
                // participants={airdrop.info.numberOfParticipants.toNumber()}
                amount={totalAmount}
                allocated={1}
                showModal={showModal}
                upcoming={upcoming}
                Private={airdrop.type === "private"}
                // started={airdrop.started}
              />
            ) : (
              <UserPanel
                symbol={airdrop.tokenSymbol}
                handleSetRemaining={handleSetRemaining}
                amount={totalAmount}
                icon={airdrop.image}
                // min_allocation={airdrop.info[0].toNumber()}
                status={status}
                filled_percent={filledPerc}
                // ends_on={airdrop.info[0].toNumber()}
                whitelisted={whitelisted}
                // whitelist_address={airdrop.info.numberWLAddresses.toNumber()}
                is_private={airdrop.type === "private"}
                remaining={remaining}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
}
