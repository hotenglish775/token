import React, { useState, useContext, createContext, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import toast from "react-hot-toast";

//INTERNAL IMPORT
import {
  ChechIfWalletConnected,
  connectWallet,
  connectingWithContract,
  getBalance,
  connectingNativeTokenContract,
} from "../Utils/index";
import {
  ERC20Generator_ABI,
  ERC20Generator_BYTECODE,
  HANDLE_NETWORK_SWITCH,
  PARSED_ERROR_MSG,
} from "./constants";

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;
const DONATION_AMOUNT = process.env.NEXT_PUBLIC_DONATION;

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  //NOTIFICATION
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  //  STATE VARIABLE
  const [address, setAddress] = useState("");
  const [getAllERC20TokenListed, setGetAllERC20TokenListed] = useState([]);
  const [getUserERC20Tokens, setGetUserERC20Tokens] = useState([]);
  const [getAllDonation, setGetAllDonation] = useState([]);
  const [fee, setFee] = useState();
  const [balance, setBalance] = useState();
  const [mainBalance, setMainBalance] = useState();
  const [nativeToken, setNativeToken] = useState();

  const fetchInitialData = async () => {
    try {
      //GET USER ACCOUNT
      const account = await ChechIfWalletConnected();

      if (account) {
        //GET USER BALANCE
        const balance = await getBalance();
        setBalance(ethers.utils.formatEther(balance.toString()));
        setAddress(account);

        //NATIVE TOKEN
        const netiveContract = await connectingNativeTokenContract();

        const nativeBalance = await netiveContract.balanceOf(account);
        const nativeName = await netiveContract.name();
        const nativeSymbol = await netiveContract.symbol();
        const nativeDecimals = await netiveContract.decimals();
        const nativeTotalSupply = await netiveContract.totalSupply();
        const nativeTotalAddress = await netiveContract.address;
        const nativeToken = {
          balance: ethers.utils.formatUnits(nativeBalance.toString(), "ether"),
          name: nativeName,
          address: nativeTotalAddress,
          symbol: nativeSymbol,
          decimals: nativeDecimals,
          totalSupply: ethers.utils.formatUnits(
            nativeTotalSupply.toString(),
            "ether"
          ),
        };
        setNativeToken(nativeToken);

        console.log(netiveContract);

        //GET CONTRACT
        const lookUpContract = await connectingWithContract();
        //GET CONTRACT BALANCE

        if (account == ADMIN_ADDRESS.toLowerCase()) {
          const contractBalance = await lookUpContract.getContractBalance();
          console.log(contractBalance);
          const mainBal = ethers.utils.formatUnits(
            contractBalance.toString(),
            "ether"
          );

          console.log(mainBal);
          setMainBalance(mainBal);
        }

        //GET ALL ERC20 TOKEN
        const getAllERC20TokenListed =
          await lookUpContract.getAllERC20TokenListed();
        //
        const parsedToken = getAllERC20TokenListed.map((ERC20Token, i) => ({
          tokenID: ERC20Token.tokenID.toNumber(),
          owner: ERC20Token.owner,
          tokenSupply: ERC20Token.tokenSupply,
          tokenName: ERC20Token.tokenName,
          tokenSymbol: ERC20Token.tokenSymbol,
          tokenAddress: ERC20Token.tokenAddress,
          tokenTransactionHash: ERC20Token.tokenTransactionHash,
          tokenCreatedDate: ERC20Token.tokenCreatedDate,
        }));
        setGetAllERC20TokenListed(parsedToken);

        //GET USER ERC20 TOKEN

        const getUserERC20Tokens = await lookUpContract.getUserERC20Tokens(
          account
        );

        const parsedUserTokens = getUserERC20Tokens.map((ERC20Token, i) => ({
          tokenID: ERC20Token.tokenID.toNumber(),
          owner: ERC20Token.owner,
          tokenSupply: ERC20Token.tokenSupply,
          tokenName: ERC20Token.tokenName,
          tokenSymbol: ERC20Token.tokenSymbol,
          tokenAddress: ERC20Token.tokenAddress,
          tokenTransactionHash: ERC20Token.tokenTransactionHash,
          tokenCreatedDate: ERC20Token.tokenCreatedDate,
        }));
        setGetUserERC20Tokens(parsedUserTokens);

        //LISTING FEE
        const listingPrice = await lookUpContract.getERC20TokenListingPrice();
        const price = ethers.utils.formatEther(listingPrice.toString());
        setFee(price);
        //DONATION
        const getAllDonation = await lookUpContract.getAllDonation();

        const parsedDonation = getAllDonation.map((donation, i) => ({
          donationID: donation.donationID.toNumber(),
          donor: donation.donor,
          fund: ethers.utils.formatUnits(donation.fund.toString(), "ether"),
        }));
        setGetAllDonation(parsedDonation);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [address]);

  const _deployContract = async (signer, account, name, symbol, supply) => {
    try {
      const factory = new ethers.ContractFactory(
        ERC20Generator_ABI,
        ERC20Generator_BYTECODE,
        signer
      );

      const totalSupply = Number(supply);
      const _initialSupply = ethers.utils.parseEther(
        totalSupply.toString(),
        "ether"
      );

      let contract = await factory.deploy(_initialSupply, name, symbol);

      const transaction = await contract.deployed();

      const today = Date.now();
      let date = new Date(today);
      const _tokenCreatedData = date.toLocaleDateString("en-US");

      if (contract.address) {
        await _createERC20Token(
          account,
          supply.toString(),
          name,
          symbol,
          contract.address,
          contract.deployTransaction.hash,
          _tokenCreatedData
        );
      }

      notifySuccess("Token created successfully");
      console.log(contract.address);
      console.log(contract.deployTransaction.hash);
    } catch (error) {
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  const _createERC20Token = async (
    _owner,
    _tokenSupply,
    _tokenName,
    _tokenSymbol,
    _tokenAddress,
    _tokenTransactionHash,
    _tokenCreatedData
  ) => {
    try {
      const contract = await connectingWithContract();

      const listingPrice = await contract.getERC20TokenListingPrice();

      const transaction = await contract.createERC20Token(
        _owner,
        _tokenSupply,
        _tokenName,
        _tokenSymbol,
        _tokenAddress,
        _tokenTransactionHash,
        _tokenCreatedData,
        {
          value: listingPrice.toString(),
        }
      );

      await transaction.wait();
      console.log(transaction);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const createERC20 = async (token) => {
    const { name, symbol, supply } = token;

    try {
      if (!name || !symbol || !supply) {
        notifyError("Provide all token details");
      } else {
        const account = await ChechIfWalletConnected();
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        _deployContract(signer, account, name, symbol, supply);
      }
    } catch (error) {
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  const widthdrawFund = async () => {
    try {
      const contract = await connectingWithContract();
      const widthdraw = await contract.withdraw();

      await widthdraw.wait();
      console.log(widthdraw);
      notifySuccess("Widthdraw fund successfully");
      window.location.reload();
    } catch (error) {
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  const donateFund = async () => {
    try {
      const donateAmount = ethers.utils.parseEther(DONATION_AMOUNT);
      const contract = await connectingWithContract();
      const donate = await contract.donate({
        value: donateAmount.toString(),
      });

      await donate.wait();
      console.log(donate);
      notifySuccess("Donated fund successfully");
      window.location.reload();
    } catch (error) {
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  const transferNativeToken = async (token) => {
    try {
      const { address, tokenNo } = token;

      if (!address || !tokenNo) return notifyError("Provide token details");
      const transferAmount = ethers.utils.parseEther(tokenNo);

      const contract = await connectingNativeTokenContract();
      const transaction = await contract.transfer(address, transferAmount);

      await transaction.wait();
      console.log(transaction);
      notifySuccess("Transfer token successfully");
      window.location.reload();
    } catch (error) {
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };
  return (
    <StateContext.Provider
      value={{
        createERC20,
        widthdrawFund,
        donateFund,
        transferNativeToken,
        connectWallet,
        setAddress,
        CURRENCY,
        getAllERC20TokenListed,
        getUserERC20Tokens,
        getAllDonation,
        fee,
        address,
        balance,
        mainBalance,
        nativeToken,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
