import React from "react";
import Web3 from "web3";
import PublicSaleAbi from "../../../config/abi/PublicSale.json";
import PublicSaleErcAbi from "../../../config/abi/PublicSaleErcAbi.json";
import FairLaunchAbi from "../../../config/abi/FairlaunchSale.json";
import FairLaunchErcAbi from "../../../config/abi/FairlaunchErcAbi.json";
import PrivateSaleAbi from "../../../config/abi/PrivateSale.json";
import PrivateSaleErcAbi from "../../../config/abi/PrivateSaleErcAbi.json";
import { useState, useEffect } from "react";
import getSaleInfo from "utils/getSaleInfo";
import { BigNumber } from "ethers";
import { formatBigToNum } from "utils/numberFormat";
import { useModal } from "react-simple-modal-provider";
import { toast } from "react-toastify";
import { useEthers } from "@usedapp/core";
import { Contract } from "ethers";


export default function FundRaised({ icon, pool, status, sale }) {
  const { account, library } = useEthers();

  const [saleInfo, setSaleInfo] = useState(null);
  const [Raised, setRaised] = useState(0);
  const [earningsWithdrawn, setEarningsWithdrawn] = useState(false);
  const { open: openLoadingModal, close: closeLoadingModal } =
    useModal("LoadingModal");

  async function getWithdrawn() {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const contract = new web3.eth.Contract(PublicSaleAbi, sale.saleAddress);
    const withdrawn = await contract.methods.earningsWithdrawn().call();
    setEarningsWithdrawn(withdrawn);
  }
  const withdrawEarnings = async () => {
    if (earningsWithdrawn) {
      toast.error("You Have Already Withdrawn Your Earnings");
      return;
    }
    openLoadingModal();

    let contract;
    if (sale.currency.symbol === "BNB") {
      if (sale.saleType === "standard") {
        contract = new Contract(
          sale.saleAddress,
          PublicSaleAbi,
          library.getSigner()
        );
      } else if (sale.saleType === "private") {
        contract = new Contract(
          sale.saleAddress,
          PrivateSaleAbi,
          library.getSigner()
        );
      } else if (sale.saleType === "fairlaunch") {
        contract = new Contract(
          sale.saleAddress,
          FairLaunchAbi,
          library.getSigner()
        );
      }
    } else {
      if (sale.saleType === "standard") {
        contract = new Contract(
          sale.saleAddress,
          PublicSaleErcAbi,
          library.getSigner()
        );
      } else if (sale.saleType === "private") {
        contract = new Contract(
          sale.saleAddress,
          PrivateSaleErcAbi,
          library.getSigner()
        );
      } else if (sale.saleType === "fairlaunch") {
        contract = new Contract(
          sale.saleAddress,
          FairLaunchErcAbi,
          library.getSigner()
        );
      }
    }

    try {
      if (status === "Live") {
        const tx = await contract.withdraw();
        await tx.wait();
        toast.success("Tokens withdrawn successfully");
      } else {
        const tx = await contract.withdrawEarnings();
        await tx.wait();
        toast.success("Earnings withdrawn successfully");
      }
      closeLoadingModal();
    } catch (err) {
      console.log(err);
      toast.error("You Have Already Withdrawn Your Earnings");
      closeLoadingModal();
    }
  };
  async function getInfo() {
    const result = await getSaleInfo(pool.saleAddress);
    setSaleInfo(result);
    console.log(result.totalBNBRaised, "FundRaised");
    const raised = BigNumber.from(result.totalBNBRaised);
    const percents = raised.mul(100).div(result.hardCap);
    const newPercent = formatBigToNum(percents.toString(),0,1);
    setRaised(newPercent);
  }
  console.log("earningsWithdrawn", earningsWithdrawn)
  useEffect(() => {
    getInfo();
    getWithdrawn();
  }, []);
  return (
    <div className="hidden md:block p-9 bg-white dark:bg-dark-1 rounded-[20px]">
      <div className="">
        <span className="font-medium text-sm text-gray dark:text-gray-dark">
          Fundraised
        </span>
      </div>

      <div className="flex items-center mt-4">
        <img src={icon} alt="pool-icon" className="w-7 h-7 mr-2" />
        <div className="flex items-end">
          <span className="font-bold text-dark-text dark:text-light-text text-2xl">
            {(sale.hardCap * (Raised / 100)).toFixed(4)}
          </span>
          <span className="text-gray dark:text-gray-dark">&nbsp;(${sale.presalePrice*(sale.hardCap * (Raised / 100)).toFixed(4)})</span>
        </div>
      </div>

      <div className="flex mt-10">
        <button
        disabled={earningsWithdrawn?true:false}
            onClick={withdrawEarnings}
          className={`w-full bg-gradient-to-r from-primary-green to-[#C89211] rounded-md text-white font-bold py-4`}
        >
          Claim
        </button>
      </div>
    </div>
  );
}
