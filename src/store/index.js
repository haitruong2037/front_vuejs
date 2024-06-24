import { createStore } from "vuex";
import auth from "./auth/index.js";
import cart from "./cart/index.js";
import address from "./address/index.js";
import wishlist from "./wishlist/index.js";

export const store = createStore({
  modules: {
    auth: auth,
    cart: cart,
    address: address,
    wishlist,
  },
});
