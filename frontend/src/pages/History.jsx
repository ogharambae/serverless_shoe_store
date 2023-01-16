import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-grid-system";
import {
  HeadingMedium,
  HeadingLarge,
  Paragraph2,
  LabelMedium,
  H3,
  LabelSmall,
  LabelLarge,
} from "baseui/typography";
import { Button } from "baseui/button";
import axios from "axios";
import { useStyletron } from "baseui";

import { getOrderHistory } from "../utils/fetchUtils";
import { cancelOrder } from "../utils/fetchUtils";

const History = () => {
  const [css] = useStyletron();
  const { userid } = useParams();
  const [orderData, setOrderData] = useState({});

  const getOrderHistoryResponse = async (userid) => {
    const response = await getOrderHistory(userid);
    const formattedData = {};
    response.forEach((data) => {
      if (formattedData[data.order_id]) {
        formattedData[data.order_id].push(data);
      } else {
        formattedData[data.order_id] = [data];
      }
    });
    setOrderData(formattedData);
  };

  useEffect(() => {
    getOrderHistoryResponse(userid);
  }, []);

  return (
    <Container className={css({ padding: "5rem" })}>
      <HeadingLarge>Your Order History</HeadingLarge>
      <Row>
        <div
          className={css({ display: "flex", gap: "1rem", flexWrap: "wrap" })}
        >
          {Object.values(orderData)
            .sort((a, b) => b[0].order_id - a[0].order_id)
            .map((orders, index) => {
              const orderStatusStyle =
                orders[0].status == "canceled"
                  ? "red"
                  : orders[0].status == "confirmed"
                  ? "green"
                  : orders[0].status == "delivered"
                  ? "blue"
                  : orders[0].status == "pending"
                  ? "orange"
                  : null;

              return (
                <div
                  key={orders[0].order_id}
                  className={css({
                    border: "1px solid gray",
                    borderRadius: "4px",
                    padding: "1rem",
                    width: "50vw",
                    position: "relative",
                  })}
                >
                  <div>
                    <div
                      className={css({
                        display: "flex",
                        justifyContent: "space-between",
                      })}
                    >
                      <LabelMedium
                        className={css({
                          padding: "0 0 0 0",
                          margin: "0 5rem 0 0 ",
                        })}
                      >
                        Order ID:
                      </LabelMedium>
                      <Paragraph2
                        className={css({
                          height: "100%",
                          padding: "0 0 0 0",
                          margin: "0",
                        })}
                      >
                        {orders[0].order_id}
                      </Paragraph2>
                    </div>

                    <div
                      className={css({
                        display: "flex",
                        justifyContent: "space-between",
                      })}
                    >
                      <LabelMedium
                        className={css({
                          padding: "0 0 0 0",
                          margin: "0 5rem 0 0 ",
                        })}
                      >
                        Order Date:
                      </LabelMedium>
                      <Paragraph2
                        className={css({
                          height: "100%",
                          padding: "0 0 0 0",
                          margin: "0",
                        })}
                      >
                        {orders[0].create_at.substring(0, 10)}
                      </Paragraph2>
                    </div>

                    <div
                      className={css({
                        display: "flex",
                        justifyContent: "space-between",
                      })}
                    >
                      <LabelMedium
                        className={css({
                          padding: "0 0 0 0",
                          margin: "0 5rem 0 0 ",
                        })}
                      >
                        Order Status:
                      </LabelMedium>
                      <Paragraph2
                        className={css({
                          height: "100%",
                          padding: "0 0.2rem 0 0.2rem",
                          margin: "0",
                          backgroundColor: orderStatusStyle,
                          color: "white",
                          borderRadius: "3px",
                        })}
                      >
                        {orders[0].status.toUpperCase()}
                      </Paragraph2>
                    </div>
                  </div>
                  {orders.map((order) => {
                    return (
                      <div
                        key={order.order_id + "_" + order.shoe_id}
                        className={css({
                          borderRadius: "4px",
                          marginTop: "10px",
                          padding: "1rem",
                          display: "flex",
                          width: "45vw",
                        })}
                      >
                        <img
                          src={order.image_url[0]}
                          alt=""
                          height={200}
                          className={css({
                            borderRadius: "3px",
                          })}
                        />
                        <div
                          className={css({
                            margin: "0 0 0 1rem",
                            fontFamily: "Helvitca Neue",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                          })}
                        >
                          <div
                            className={css({
                              display: "flex",
                              justifyContent: "space-between",
                            })}
                          >
                            <LabelMedium
                              className={css({
                                padding: "0 0 0 0",
                                margin: "0 5rem 0 0 ",
                              })}
                            >
                              Shoe Name:
                            </LabelMedium>
                            <Paragraph2
                              className={css({
                                height: "100%",
                                padding: "0 0 0 0",
                                margin: "0",
                              })}
                            >
                              {order.shoe_name}
                            </Paragraph2>
                          </div>

                          <div
                            className={css({
                              display: "flex",
                              justifyContent: "space-between",
                            })}
                          >
                            <LabelMedium
                              className={css({
                                padding: "0 0 0 0",
                                margin: "0 5rem 0 0 ",
                              })}
                            >
                              Purchase Price:
                            </LabelMedium>
                            <Paragraph2
                              className={css({
                                height: "100%",
                                padding: "0 0 0 0",
                                margin: "0",
                              })}
                            >
                              ${order.amount.toFixed(2)}
                            </Paragraph2>
                          </div>

                          <div
                            className={css({
                              display: "flex",
                              justifyContent: "space-between",
                            })}
                          >
                            <LabelMedium
                              className={css({
                                padding: "0 0 0 0",
                                margin: "0 5rem 0 0 ",
                              })}
                            >
                              Order Quantity:
                            </LabelMedium>
                            <Paragraph2
                              className={css({
                                height: "100%",
                                padding: "0 0 0 0",
                                margin: "0",
                              })}
                            >
                              {order.quantity}
                            </Paragraph2>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {orders[0].status == "confirmed" && (
                    <div
                      className={css({
                        display: "flex",
                        justifyContent: "end",
                      })}
                    >
                      <Button
                        className={css({ borderRadius: "5px" })}
                        onClick={async () => {
                          await cancelOrder(orders[0].order_id);
                          window.location.reload();
                        }}
                      >
                        {" "}
                        Cancel Order
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </Row>
    </Container>
  );
};

export default History;
