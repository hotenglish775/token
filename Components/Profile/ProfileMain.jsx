import React from "react";

//INTERNAL IMPORT
import { Table, TableTwo } from "../index";

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
const DONATION = process.env.NEXT_PUBLIC_DONATION;

const ProfileMain = ({
  getAllERC20TokenListed,
  getUserERC20Tokens,
  setOpen,
  open,
  fee,
  createERC20,
  address,
  balance,
  widthdrawFund,
  donateFund,
  getAllDonation,
  mainBalance,
  nativeToken,
  CURRENCY,
}) => {
  const details = [
    {
      title: "Created",
      value: `#${getUserERC20Tokens?.length || 0}`,
    },
    {
      title: "ERC20s",
      value: `#${getAllERC20TokenListed?.length || 0}`,
    },
    {
      title: "Listing Fee",
      value: `${fee} ${CURRENCY}`,
    },
    {
      title: "Downers",
      value: `#${getAllDonation?.length || 0}`,
    },
    {
      title: `${nativeToken?.symbol} Token`,
      value: `${nativeToken?.balance}`,
    },
    {
      title: "Contract Balance",
      value: `${
        mainBalance == undefined
          ? "Only Owner See"
          : `${mainBalance} ${CURRENCY}`
      }`,
    },
  ];

  return (
    <div class="col-xl-9 col-lg-9 col-md-8">
      <div class="row user-dashboard">
        <div class="col-xl-12 col-lg-12 col-md-12">
          <div class="user-top">
            <div class="user-balance">
              <span>Your balance</span>
              <div class="main-bal">
                {balance?.slice(0, 7)} {CURRENCY}
              </div>
            </div>
            <div class="userboard-btn">
              <a class="user-btn coin-btn" onClick={() => donateFund()}>
                Donate {DONATION} {CURRENCY}
              </a>
              {address == ADMIN_ADDRESS.toLowerCase() && (
                <a onClick={() => widthdrawFund()} class="user-btn color-btn">
                  Withdraw funds
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div class="row dashboard-content">
        {details.map((detail, i) => (
          <div key={i + 1} class="col-xl-4 col-lg-4 col-md-6">
            <div class="single-dash-head">
              <div class="dashboard-amount d-flex flex-wrap align-items-center">
                <div class="amount-content">
                  <span class="pro-name">{detail.title}</span>
                  <span class="pro-money">{detail.value}</span>
                </div>
                <div class="invest-tumb">
                  <img src={`img/icon/d${i + 1}.png`} alt="" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {open == "Dashbord" ? (
        <Table
          title="All Creaded ERC20 Tokens"
          tableData={getAllERC20TokenListed}
        />
      ) : open == "Your Token" ? (
        <Table title="Your Tokens" tableData={getUserERC20Tokens} />
      ) : open == "Donation" ? (
        <TableTwo
          title="All user donations"
          tableData={getAllDonation}
          CURRENCY={CURRENCY}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ProfileMain;
