import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-grid-system";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store/actions";
import { HeadingXLarge, Paragraph1 } from "baseui/typography";
import CheckoutLayout from "../components/Blocks/Checkout/Layout";
import Shipping from "../components/Blocks/Checkout/Shipping";
import { useStyletron } from "baseui";
import CartInfo from "../components/Blocks/Checkout/CartInfo";
import Payment from "../components/Blocks/Checkout/Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { Button } from "baseui/button";
import { useForm, Controller } from "react-hook-form";
import { Input } from "baseui/input";
import Axios from "axios";
import { Spinner } from "baseui/spinner";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";

// const stripePromise = loadStripe(process.env.REACT_APP_PK_KEY)

const Checkout = () => {
  const cartState = useSelector((state) => state.cart);
  const [promotionCode, setPromotionCode] = React.useState(null);
  const [discount, setDiscount] = React.useState({});
  const [discountMoney, setDiscountMoney] = React.useState(0);
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = React.useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const { control, handleSubmit, errors, register } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log(cartState)

  useEffect(() => {
    if (cartState.items.length <= 0) {
      navigate("/");
    }
    return () => {};
  }, [navigate, cartState]);

  const [css] = useStyletron();
  const spacing = css({ margin: "1rem 0" });

  async function applyPromoCode(data) {
    Axios.post(
      "https://rmbka7laza.execute-api.us-east-1.amazonaws.com/test/api/admin/promo/verify",
      data
    ).then((response) => {
      if (
        response.data &&
        response.data.body &&
        response.data.body["matched?"]
      ) {
        setPromotionCode(response.data.body.promoCode);
        setDiscount(response.data.body);
      } else {
        setPromotionCode("");
      }
    });
  }

  const onSubmit = async (data, e) => {
    setIsPlacingOrder(true);
    if (localStorage.getItem("user_id")) {
      Axios.post(
        "https://rmbka7laza.execute-api.us-east-1.amazonaws.com/test/api/user/order",
        {
          user_id: localStorage.getItem("user_id"),
          promo: promotionCode,
          discount: discountMoney,
          shipping: shippingData,
          shoes: cartState.items,
        }
      ).then((response) => {
        setIsPlacingOrder(false);
        if (response.data && response.data.statusCode == 200) {
          setMessage(
            "You have placed order successfully. You will receive a confirmation email shortly, thank you!"
          );
        } else {
          setMessage("Failed to place order. Please try again!");
        }
      });
    } else {
      setIsPlacingOrder(false);
      setMessage("Failed to place order.Please Login to place a order");
    }
  };

  if (cartState.items.length <= 0) return null;
  return (
    <Container>
      {isPlacingOrder && (
        <div
          className={css({
            position: "fixed",
            backgroundColor: "#00000050",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <Spinner />
        </div>
      )}
      {message && (
        <Modal
          onClose={() => setMessage(false)}
          closeable
          isOpen={true}
          animate
          autoFocus
          size={SIZE.default}
          role={ROLE.dialog}
        >
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>{message}</ModalBody>
          <ModalFooter>
            <ModalButton
              onClick={() => {
                if (message.includes("Failed")) {
                  setMessage(false);
                  navigate("/");
                } else {
                  // clear all items in cart
                  dispatch(clearCart());
                  navigate("/history/" + localStorage.getItem("user_id"));
                }
              }}
            >
              Okay
            </ModalButton>
          </ModalFooter>
        </Modal>
      )}
      <Row justify="center">
        <HeadingXLarge>Checkout</HeadingXLarge>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={8}>
          <div className={spacing}>
            <CheckoutLayout title="1. Shipping" showContent={step === 1}>
              <Shipping
                onComplete={(data) => {
                  setStep(2);
                  setShippingData(data);
                }}
              />
            </CheckoutLayout>
          </div>
          {step > 1 && (
            <div>
              <form onSubmit={handleSubmit(applyPromoCode)}>
                <Row className={spacing}>
                  <Col>
                    <Controller
                      as={Input}
                      control={control}
                      name="promotionCode"
                      defaultValue=""
                      placeholder={"Promotion Code (optional)"}
                    />
                    {promotionCode === "" ? (
                      <Paragraph1
                        className={css({
                          fontStyle: "italic",
                          color: "red",
                        })}
                      >
                        Invalid Promotion Code
                      </Paragraph1>
                    ) : promotionCode !== null ? (
                      <Paragraph1
                        className={css({
                          fontStyle: "italic",
                          color: "green",
                        })}
                      >
                        Applied Promotion Code
                      </Paragraph1>
                    ) : (
                      <div />
                    )}
                  </Col>
                  <Col
                    className={css({
                      display: "flex",
                      justifyContent: "flex-end",
                      height: "50px",
                    })}
                  >
                    <Button onClick={applyPromoCode}>
                      Apply Promotion Code
                    </Button>
                  </Col>
                </Row>
              </form>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Button>PlaceOrder</Button>
              </form>
            </div>
          )}
        </Col>
        <Col xs={12} sm={12} md={4}>
          <div className={spacing}>
            <CartInfo
              cartInfo={cartState}
              discount={discount}
              onUpdateDiscount={setDiscountMoney}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
