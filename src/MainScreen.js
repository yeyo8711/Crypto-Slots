import React, { useEffect, useState } from "react";
import lemon from "../src/images/lemon.png";
import bigwin from "../src/images/bigwin.png";
import star from "../src/images/star.png";
import seven from "../src/images/seven.png";
import strawberry from "../src/images/strawberry.png";
import grape from "../src/images/grape.png";
import spinbtn from "../src/images/spinbutton.png";
import { ethers } from "ethers";
import sound from "./images/slotssound.mp3";
import winsound from "./images/winsound.mp3";

const MainScreen = ({
  activeWallet,
  activeContract,
  balance,
  amountWon,
  setAmountWon,
  grabDeposits,
}) => {
  let [spinAmount, setSpinAmount] = useState(10);

  const wallet = activeWallet[0];
  const [isSpinning, setIsSpinning] = useState(false);
  const [state, setState] = useState({
    icon1: grape,
    icon2: strawberry,
    icon3: bigwin,
    icon4: seven,
    icon5: star,
    icon6: seven,
    icon7: lemon,
    icon8: strawberry,
    icon9: grape,
  });
  const [spinningState, setSpinningState] = useState({
    icon1: seven,
    icon2: seven,
    icon3: seven,
    icon4: seven,
    icon5: seven,
    icon6: seven,
    icon7: seven,
    icon8: seven,
    icon9: seven,
  });

  //Compares the  icons to see if there is a Winner
  useEffect(() => {
    const arr = [];
    const count = {};
    Object.entries(state).map((i) => arr.push(i[1]));
    arr.forEach((element) => {
      count[element] = (count[element] || 0) + 1;
    });
    const winningArr = [];
    Object.entries(count).forEach((i) => {
      if (i[1] >= 3) {
        winningArr.push(i[0]);
      }
    });

    let winningDeposit = 0;
    winningArr.forEach((i) => {
      if (i === "/static/media/grape.87ea8a64.png") {
        winningDeposit += 0.5 * spinAmount;
      } else if (i === "/static/media/strawberry.93ff5146.png") {
        winningDeposit += 0.75 * spinAmount;
      } else if (i === "/static/media/lemon.89c069d6.png") {
        winningDeposit += 1 * spinAmount;
      } else if (i === "/static/media/star.207cc496.png") {
        winningDeposit += 1.5 * spinAmount;
      } else if (i === "/static/media/seven.3cc60072.png") {
        winningDeposit += 1.75 * spinAmount;
      } else if (i === "/static/media/bigwin.609a70e3.png") {
        winningDeposit += 3 * spinAmount;
      }
    });
    if (winningDeposit) {
      const winAudio = new Audio(winsound);
      winAudio.play();
    }
    setAmountWon(winningDeposit);
  }, [state]);

  //Determines the icon
  const randomize = (randNum) => {
    let icon;
    if (randNum > 0 && randNum < 30) {
      icon = grape;
    } else if (randNum > 21 && randNum < 49) {
      icon = strawberry;
    } else if (randNum > 50 && randNum < 69) {
      icon = lemon;
    } else if (randNum > 70 && randNum < 84) {
      icon = star;
    } else if (randNum > 85 && randNum < 95) {
      icon = seven;
    } else {
      icon = bigwin;
    }
    return icon;
  };

  // Makes random number and random icon, then sets state with that icon, calls function to deduct the balance and render new balance //
  const spin = async () => {
    if (!wallet) {
      alert("Please Connect Wallet");
      return;
    }
    if (balance >= spinAmount && wallet && spinAmount > 0) {
      const spun = await activeContract.spin(
        ethers.utils.parseEther(spinAmount.toString()),
        ethers.utils.parseEther(amountWon.toString())
      );

      await spun.wait();

      const chooseIcon = () => {
        let icon1 = randomize(Math.random() * 100);
        let icon2 = randomize(Math.random() * 100);
        let icon3 = randomize(Math.random() * 100);
        let icon4 = randomize(Math.random() * 100);
        let icon5 = randomize(Math.random() * 100);
        let icon6 = randomize(Math.random() * 100);
        let icon7 = randomize(Math.random() * 100);
        let icon8 = randomize(Math.random() * 100);
        let icon9 = randomize(Math.random() * 100);

        setSpinningState({
          icon1,
          icon2,
          icon3,
          icon4,
          icon5,
          icon6,
          icon7,
          icon8,
          icon9,
        });
      };
      setIsSpinning(true);
      const audio = new Audio(sound);
      audio.play();
      const myInterval = setTimeout(() => {
        setInterval(chooseIcon, 200);
      }, 2500);

      setTimeout(() => {
        clearInterval(myInterval);

        let icon1 = randomize(Math.random() * 100);
        let icon2 = randomize(Math.random() * 100);
        let icon3 = randomize(Math.random() * 100);
        let icon4 = randomize(Math.random() * 100);
        let icon5 = randomize(Math.random() * 100);
        let icon6 = randomize(Math.random() * 100);
        let icon7 = randomize(Math.random() * 100);
        let icon8 = randomize(Math.random() * 100);
        let icon9 = randomize(Math.random() * 100);

        setState({
          icon1,
          icon2,
          icon3,
          icon4,
          icon5,
          icon6,
          icon7,
          icon8,
          icon9,
        });
        setIsSpinning(false);
      }, 6000);
      grabDeposits();
      setAmountWon(0);
    } else {
      alert("You do not have enough tokens! ");
    }
  };
  const increment = (e) => {
    e.preventDefault();
    setSpinAmount((spinAmount += 10));
  };
  const decrement = (e) => {
    e.preventDefault();
    if (spinAmount >= 20) setSpinAmount((spinAmount -= 10));
  };

  return (
    <div>
      <div className="box ">
        <div className="row">
          <img
            className="sloticon"
            src={isSpinning ? spinningState.icon1 : state.icon1}
            alt="icon"
          />
          <img
            className="sloticon"
            src={isSpinning ? spinningState.icon2 : state.icon2}
            alt="icon"
          />
          <img
            className="sloticon"
            src={isSpinning ? spinningState.icon3 : state.icon3}
            alt="icon"
          />
        </div>
        <div className="row">
          <img
            className="sloticon"
            src={isSpinning ? spinningState.icon4 : state.icon4}
            alt="icon"
          />
          <img
            className="sloticon"
            src={isSpinning ? spinningState.icon5 : state.icon5}
            alt="icon"
          />
          <img
            className="sloticon"
            src={isSpinning ? spinningState.icon6 : state.icon6}
            alt="icon"
          />
        </div>

        <div className="row">
          <img
            className="sloticon"
            src={isSpinning ? spinningState.icon7 : state.icon7}
            alt="icon"
          />
          <img
            className="sloticon"
            src={isSpinning ? spinningState.icon8 : state.icon8}
            alt="icon"
          />
          <img
            className="sloticon"
            src={isSpinning ? spinningState.icon9 : state.icon9}
            alt="icon"
          />
        </div>
      </div>

      <div className="bottom-box">
        <img
          src={spinbtn}
          alt="spin"
          onClick={() => spin()}
          className="spinbtn"
        />
        <br />
        <div>
          <form>
            <button className="plusminus" onClick={(e) => decrement(e)}>
              -
            </button>
            <input
              onChange={(e) => setSpinAmount(e.target.value)}
              readOnly
              value={spinAmount}
            />

            <button className="plusminus" onClick={(e) => increment(e)}>
              +
            </button>
          </form>
        </div>
        <button className="btn btn-warning btn-md mb-2 match3amountwon">{`Tokens Won This Turn: ${amountWon} SLOTZ`}</button>
      </div>
    </div>
  );
};

export default MainScreen;
