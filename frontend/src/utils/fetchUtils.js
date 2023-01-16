import axios from "axios";

export const getAllShoes = async (headers = {}) => {
  try {
    const { data } = await axios.get(
      "https://rmbka7laza.execute-api.us-east-1.amazonaws.com/test/api/user/item/",
      {
        headers: {
          ...headers,
        },
      }
    );

    data.body.map((element) => {
      element.image_url = element.image_url.split(", ");
      return element;
    });

    let shoes = {};
    data.body.forEach((product) => (shoes[product.shoe_id] = product));

    let test = Object.keys(data.body).map((key) => {
      return data.body[key];
    });

    return shoes;
  } catch (err) {
    return { error: -1, ...err.response.data };
  }
};

export const getOrderHistory = async (userId, headers = {}) => {
  try {
    const { data } = await axios.get(
      `https://rmbka7laza.execute-api.us-east-1.amazonaws.com/test/api/user/allorders/${userId}`,
      {
        headers: {
          ...headers,
        },
      }
    );

    data.response.body.map((element) => {
      element.image_url = element.image_url.split(", ");
      return element;
    });

    return data.response.body;
  } catch (err) {
    return { error: -1, ...err.response.data };
  }
};

export const cancelOrder = async (orderId, headers = {}) => {
  try {
    const { data } = await axios.patch(
      `https://rmbka7laza.execute-api.us-east-1.amazonaws.com/test/api/user/order/${orderId}`
    );

    return data;
  } catch (err) {
    return { error: -1, ...err.response.data };
  }
};
