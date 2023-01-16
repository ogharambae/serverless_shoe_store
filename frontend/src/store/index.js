import {
  createSlice,
  configureStore,
  combineReducers,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import shoes from "./shoes.json";
import hoodies from "./hoodies.json";
import jackets from "./jackets.json";
import kidsClothes from "./kidsclothes.json";
import home from "./home.json";
import { toast } from "react-toastify";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistStore, persistReducer } from "redux-persist";
import { getAllShoes } from "../utils/fetchUtils";
import Axios from "axios";

const mapProducts = (products) => {
  const mappedProducts = {};
  products.forEach((product) => (mappedProducts[product.id] = product));
  return mappedProducts;
};

// getAllShoes().then((res) => {
//   allShoes = Object.values(res);
//   console.log(allShoes);
// });

// const initialProductsState = {
//   home: {
//     name: "Men's Shoes",
//     route: "/home",
//     products: mapProducts(home),
//   },
//   hoodies: {
//     name: "Men's Hoodies and Sweaters",
//     route: "/hoodies",
//     products: mapProducts(hoodies),
//   },
//   jackets: {
//     name: "Men's Jackets and Vests",
//     route: "/jackets",
//     products: mapProducts(jackets),
//   },
//   kids: {
//     name: "Kid's Clothes",
//     route: "/kids",
//     products: mapProducts(kidsClothes),
//   },
//   shoes: {
//     name: "Men's Shoes",
//     route: "/shoes",
//     products: mapProducts(shoes),
//   },
// };

const initialProductsState = {
  home: {
    name: "Men's Shoes",
    route: "/home",
    products: [],
  },
  hoodies: {
    name: "Men's Hoodies and Sweaters",
    route: "/hoodies",
    products: [],
  },
  jackets: {
    name: "Men's Jackets and Vests",
    route: "/jackets",
    products: [],
  },
  kids: {
    name: "Kid's Clothes",
    route: "/kids",
    products: [],
  },
  shoes: {
    name: "Men's Shoes",
    route: "/shoes",
    products: [],
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart(state, action) {
      const allCartItems = state.items;
      const cartItemIndex = allCartItems.findIndex(
        (item) => action.payload.shoe_id === item.shoe_id
      );
      if (cartItemIndex !== -1) {
        console.log(state.items[cartItemIndex].quantity)
        state.items[cartItemIndex] = {
          ...action.payload,
          quantity: state.items[cartItemIndex].quantity + 1,
        };
        toast("Added to Cart", {
          type: "info",
        });
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
        toast("Added to Cart", {
          type: "info",
        });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.shoe_id !== action.payload);
      toast("Removed from Cart", {
        type: "error",
      });
    },
    updateQty(state, action) {
      const allCartItems = state.items;
      const cartItemIndex = allCartItems.findIndex(
        (item) => action.payload.shoe_id === item.shoe_id
      );

      if (cartItemIndex !== -1) {
        allCartItems[cartItemIndex] = action.payload;
      }
    },
    clearCart: (state, action) => {
      state.items = [];
    },
  },
});

const shippingSlice = createSlice({
  name: "shipping",
  initialState: {
    form: {
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      phoneNumber: "",
    },
  },
  reducers: {
    updateShipping(shippingState, action) {
      shippingState.form = action.payload;
    },
  },
});

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    lastOrder: {},
  },
  reducers: {
    paymentSucceeded: () => {
      toast("Payment Successful", { type: "success" });
    },
    paymentFailed: (state, action) => {
      toast(`Payment Failed: ${action.payload}`, { type: "error" });
    },
    lastOrder: (state, action) => {
      state.lastOrder = action.payload;
    },
  },
  extraReducers: {},
});

const createExtraActions = () => {
  function getShoes() {
    return createAsyncThunk("shoes/getAll", async () => await getAllShoes());
  }

  return {
    getAll: getShoes(),
  };
};

const extraActions = createExtraActions();

function createExtraReducers() {
  return {
    ...getAll(),
  };

  function getAll() {
    var { pending, fulfilled, rejected } = extraActions.getAll;
    return {
      [pending]: (state) => {
        state.shoes = { loading: true };
      },
      [fulfilled]: (state, action) => {
        state.shoes = action.payload;
      },
      [rejected]: (state, action) => {
        state.shoes = { error: action.error };
      },
    };
  }
}
const extraReducers = createExtraReducers();

const productsSlice = createSlice({
  name: "products",
  initialState: initialProductsState,
  extraReducers,
});

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  products: productsSlice.reducer,
  cart: cartSlice.reducer,
  shipping: shippingSlice.reducer,
  payment: paymentSlice.reducer,
});

export const shoeActions = { ...productsSlice, ...extraActions };

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = configureStore({ reducer: persistedReducer });
  let persistor = persistStore(store);
  return { store, persistor };
};
