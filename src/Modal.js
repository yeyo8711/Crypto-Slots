import React from "react";
import lemon from "../src/images/lemon.png";
import bigwin from "../src/images/bigwin.png";
import star from "../src/images/star.png";
import seven from "../src/images/seven.png";
import strawberry from "../src/images/strawberry.png";
import grape from "../src/images/grape.png";

const Modal = (props) => {
  if (!props.show) {
    return null;
  }

  return (
    <div className="modals">
      <div className="modal-content">
        <button className="closer" onClick={() => props.onClose()}>
          X
        </button>
        <h3> How To play</h3>
        <div className="modal-header">
          <p>
            <br />
            *Funds need to be loaded first. Once you have the funds you can
            Spin.
            <br />
            *Get 3 matching icons and win tokens.
            <br />
            *The tokens won will be deposited to your bag on the next Spin.
            <br /> *You can withdraw anytime
          </p>

          <div className="moda-title">
            <br />
            <div className="modal-body">
              <div className="container">
                <div className="row">
                  <div className="col">
                    <h3>Icon</h3>
                  </div>
                  <div className="col">
                    <h3>Reward</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <img src={grape} alt="grape" className="modal-icon" />
                  </div>
                  <div className="col">x0.5</div>
                </div>
                <div className="row">
                  <div className="col">
                    <img
                      src={strawberry}
                      alt="strawberry"
                      className="modal-icon"
                    />
                  </div>
                  <div className="col">x0.75</div>
                </div>
                <div className="row">
                  <div className="col">
                    <img src={lemon} alt="lemon" className="modal-icon" />
                  </div>
                  <div className="col">x1</div>
                </div>
                <div className="row">
                  <div className="col">
                    <img src={star} alt="star" className="modal-icon" />
                  </div>
                  <div className="col">x1.5</div>
                </div>
                <div className="row">
                  <div className="col">
                    <img src={seven} alt="seven" className="modal-icon" />
                  </div>
                  <div className="col">x1.75</div>
                </div>
                <div className="row">
                  <div className="col">
                    <img src={bigwin} alt="bigwin" className="modal-icon" />
                  </div>
                  <div className="col">x3</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
