import React, { useState } from "react";
import BackArrowSVG from "svgs/back_arrow";
import HeadingTags from "components/TokenLocker/Subcomponents/HeadingTags";
import { Contract } from "ethers";
import { useEthers } from "@usedapp/core";
import liquidityAbi from "config/abi/LiquidityLocker.json";

export default function LpLogoUpdate({setEdit,asset}) {
  const { chainId,library } = useEthers();
  const [image,setImage]=useState('')
console.log(asset,'asset')
  const handleEdit = async () => {
    const contract = new Contract(
      asset.address,
      liquidityAbi,
      library.getSigner()
    );
    try {
      const tx = await contract.updateLogo(image);
      await tx.wait();
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="w-full">
      {" "}
      <div className="flex items-center mt-9">
        <HeadingTags name={"Token Logo"} required />
        <img src="/images/lists/question.svg" alt="info" className="ml-2" />
      </div>
      <div className="mt-5 flex items-center justify-between gap-5 cursor-pointer">
        <div className="flex items-center justify-between bg-[#FAF8F5] dark:bg-dark-2 px-5 py-4 rounded-md w-[100%]">
          <input
            type="text"
            placeholder="Input Valid image url here"
            className="w-[100%] font-bold text-dark-text dark:text-light-text"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
          />
        </div>
      </div>
      <div className="mt-10">
          <div className="flex justify-end items-center mb-10">
              <button
                className="bg-white dark:bg-transparent mr-5 flex items-center gap-2 py-[10px] px-5"
                onClick={() =>
                  setEdit(false)
                }
              >
                <BackArrowSVG className="fill-dark-text dark:fill-light-text" />
                <span className="font-gilroy font-medium text-sm text-dark-text dark:text-light-text">Go Back</span>
              </button>

            <button
              className="bg-primary-green hover:opacity-40 disabled:bg-light-text text-white font-gilroy font-bold px-8 py-3 rounded-md"
              disabled={image===''}
              onClick={() => {
                handleEdit();
              }
              }
            >
              Edit
            </button>
          </div>
        </div>
    </div>
  );
}
