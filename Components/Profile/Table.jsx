import React from "react";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";

const Table = ({ tableData, title }) => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess("Copyied Successfully");
  };
  return (
    <div class="row">
      <div class="col-xl-12 col-lg-12 col-md-12">
        <div class="send-money-form transection-log">
          <div class="form-text">
            <h4 class="form-top">
              {" "}
              {tableData.length == 0 ? "No Token Created" : `${title}`}{" "}
            </h4>
            {tableData.length == 0 ? (
              ""
            ) : (
              <div class="form-inner table-inner">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Transaction Hash</th>
                      <th>Token Address</th>
                      <th>Supply</th>
                      <th>Symbol</th>
                      <th>Name</th>
                    </tr>
                    <>
                      {tableData?.map((token, i) => (
                        <tr key={i + 1}>
                          <td>{token.tokenCreatedDate}</td>
                          <td
                            onClick={() => copyText(token.tokenTransactionHash)}
                          >
                            {token.tokenTransactionHash.slice(0, 15)}...
                            <FaRegCopy />
                          </td>
                          <td onClick={() => copyText(token.tokenAddress)}>
                            {token.tokenAddress.slice(0, 15)}...
                            <FaRegCopy />
                          </td>
                          <td>{token.tokenSupply}</td>
                          <td>{token.tokenSymbol}</td>
                          <td>{token.tokenName}</td>
                        </tr>
                      ))}
                    </>
                  </thead>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
