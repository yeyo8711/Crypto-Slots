import React, { useState, useEffect } from "react";
import MainScreen from "./MainScreen";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import walletimg from "./images/wallet.png";
import Logo from "./images/Logo.png";
import abi from "./Contract_abi.json";
import Modal from "./Modal";
import { TiInfoLarge } from "react-icons/ti";
import bgsong from "./images/bgsong.mp3";

const App = () => {
  const [activeWallet, setActiveWallet] = useState("");
  const [activeContract, setActiveContract] = useState("");

  const [balance, setBalance] = useState(0);
  let [amountWon, setAmountWon] = useState(0);
  const [show, setShow] = useState(false);
  const [jackpotBalance, setJackpotBalance] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [depositTokens, setDepositTokens] = useState("");
  const wallet = activeWallet[0];
  const Web3 = require("web3");
  const web3 = new Web3(Web3.givenProvider);
  const { ethereum } = window;
  const contractAddress = "0x4ad2dA71424387A32FcFfcFc474cE38d11C5F810";
  /* const devWalletAddress = "0x206b5bb730277Ac3ccF247466581220Be262644f"; */

  // Connects to the contract on first render
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    setActiveContract(contract);

    const bgaudio = new Audio(bgsong);
    bgaudio.play();
    bgaudio.loop = true;
  }, [ethereum]);

  const connectWalletBtn = () => {
    if (window.ethereum) {
      return (
        <button
          className="btn btn-secondary btn-md"
          onClick={() => connectWallet()}
        >
          Connect to Metamask
        </button>
      );
    } else {
      return (
        <button className="btn btn-secondary btn-md">Install Metamask</button>
      );
    }
  };
  // Requests Wallet to Connect
  const connectWallet = async () => {
    const wallet = await web3.eth.requestAccounts();
    setActiveWallet(wallet);
  };
  useEffect(() => {
    grabDeposits();
  }, [activeWallet]);

  //Deposits to reload Balance
  const reload = async (e) => {
    e.preventDefault();

    if (!wallet) {
      alert("Please Connect Wallet First");
      return;
    } else {
      //If user tries to deposit 0 or leaves empty field, button does nothing
      if (!depositTokens || 0) return;
      // Gets allowance
      const approvedAmount = await activeContract.allowance(
        wallet,
        contractAddress
      );
      const formatedApprovedAmount = ethers.utils.formatEther(approvedAmount);

      //Requests Approval
      if (depositTokens >= formatedApprovedAmount) {
        await activeContract.approve(
          contractAddress,
          ethers.utils.parseEther(depositTokens.toString())
        );
        // Sends tokens from wallet to contract

        await activeContract.on("Approval", () => {
          activeContract.loadFunds(
            ethers.utils.parseEther(depositTokens.toString())
          );
        });
      } else {
        // Sends tokens from wallet to contract

        await activeContract.loadFunds(
          ethers.utils.parseEther(depositTokens.toString())
        );
      }
    }
    // Updates Balance on screen after deposit
    if (wallet) {
      await activeContract.on("Deposit", () => {
        grabDeposits();
      });
    }
  };
  //Withdraw function
  const withdraw = async (e) => {
    e.preventDefault();
    if (balance >= depositTokens) {
      const getWithdrawl = await activeContract.withdrawFunds(
        ethers.utils.parseEther(depositTokens.toString())
      );
      await getWithdrawl.wait();

      grabDeposits();
    } else {
      alert("You have insufficient tokens to withdraw that amount");
    }
  };

  //Updates Balances on every render
  const grabDeposits = async () => {
    if (wallet) {
      const balance = await activeContract.checkDeposit(wallet);
      setBalance(ethers.utils.formatEther(balance));
      const jackpotBalance = await activeContract.balanceOf(contractAddress);

      setJackpotBalance(ethers.utils.formatEther(jackpotBalance));
    }
  };

  return (
    <div>
      <nav className="navbar">
        <img src={Logo} className="navlogo" alt="logo" />

        <h1 className="display-3 title">Crypto Casino</h1>
        <span className="activewallet">
          {activeWallet
            ? `${wallet.slice(0, 10)}. . .${wallet.slice(32, 42)}`
            : connectWalletBtn()}
        </span>
      </nav>

      <div className="top-button-menu">
        <img
          className="walletimg"
          src={walletimg}
          alt="wallet"
          onClick={() => setHidden(!hidden)}
        />
        <button
          className={`btn btn-secondary btn-md mb-2 ${hidden ? "hidden" : ""}`}
          onClick={grabDeposits}
        >{`In-Game Balance: ${balance} SLOTZ`}</button>
        <form autoComplete="off " className={`${hidden ? "hidden" : ""}`}>
          <input
            type="text"
            name="depositvalue"
            onSubmit={(e) => e.preventDefault()}
            onChange={(e) => setDepositTokens(e.target.value)}
          ></input>
          <button
            type="submit"
            className="btn btn-primary btn-md m-2"
            onClick={(e) => reload(e)}
          >
            Load Wallet
          </button>
          <button
            type="submit"
            className="btn btn-secondary btn-md m-2"
            onClick={(e) => withdraw(e)}
          >
            Withdraw
          </button>

          {/*<h1 className="banner">Total Jackpot: {jackpotBalance}</h1>*/}
        </form>
      </div>
      <Modal show={show} onClose={() => setShow(false)} />

      <div className="gamescreen">
        <div className="match3title">
          <button onClick={() => setShow(true)} className="modal-button">
            <TiInfoLarge />
          </button>
          <h1>Match 3</h1>
        </div>
        <MainScreen
          className="mainscreen"
          activeWallet={activeWallet}
          activeContract={activeContract}
          contractAddress={contractAddress}
          balance={balance}
          setBalance={setBalance}
          amountWon={amountWon}
          setAmountWon={setAmountWon}
          grabDeposits={grabDeposits}
          jackpotBalance={jackpotBalance}
          setJackpotBalance={setJackpotBalance}
          depositTokens={depositTokens}
          setDepositTokens={setDepositTokens}
        />
      </div>

      {/*  <nav className=" bottom navbar-light bg-light px-4">
        <span className=" fs-5">Contract: {contractAddress}</span>
      </nav> */}
    </div>
  );
};

export default App;
