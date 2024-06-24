import axiosInstance from "../../config/axiosInstance";

const cart = {
  namespaced: true,
  state: {
    cartItems: [],
    isLoading: true,
    error: null,
  },
  mutations: {
    SET_CART(state, cartData) {
      state.cartItems = cartData;
      state.error = null;
      state.isLoading = false;
    },
    ADD_CART(state, cartData) {
      const item = state.cartItems.find(
        (item) => item.product_id == cartData.product_id
      );

      if (item) {
        item.quantity += cartData.quantity;
      } else {
        state.cartItems.push({
          ...cartData,
          quantity: (quantity += cartData.quantity),
        });
      }
      state.isLoading = false;
    },
    UPDATE_CART(state, cartData) {
      const item = state.cartItems.find(
        (item) => item.id == cartData.id
      );
      if (item) {
        item.quantity = cartData.quantity;
      }
      state.isLoading = false;
    },
    REMOVE_FROM_CART(state, cartID) {
      state.cartItems = state.cartItems.filter((item) => item.id !== cartID);
    },
    CLEAR_CART(state) {
      state.cartItems = [];
      state.isLoading = false;
      state.error = null;
    },
    SET_CART_ERROR(state, error) {
        state.isLoading = false;
        state.error = error;
    },
  },
  actions: {
    async fetchCart({ commit }) {
      try {
        const response = await axiosInstance.get("/carts");
        commit("SET_CART", response);
      } catch (error) {
        commit("SET_CART_ERROR", error);
      }
    },
    async addCart({ commit }, cartData) {
      try {
        const response = await axiosInstance.post(`/carts/`, cartData);

        this.dispatch("cart/fetchCart");

        return {
          success: true,
          message: response.message ?? "Added to cart successfully",
        };
      } catch (error) {
        commit("SET_CART_ERROR", error);
        return {
          success: false,
          message: error.message ?? "Add cart failed",
        };
      }
    },
    async updateCart({ commit }, cartData) {
      try {
        const response = await axiosInstance.post(`/carts/${cartData.id}`, cartData);

        commit("UPDATE_CART", cartData);

        return {
          success: true,
          message: response.message.message ?? "Updated cart successfully",
        };
      } catch (error) {
        commit("SET_CART_ERROR", error);
        return {
          success: false,
          message: error.message ?? "Update cart failed",
        };
      }
    },
    async removeCart({ commit }, cartID) {
      try {
        const response = await axiosInstance.delete(`/carts/${cartID}`);

        commit("REMOVE_FROM_CART", cartID);

        return {
          success: true,
          message:
            response.message ?? "Item has been removed from cart",
        };
      } catch (error) {
        commit("SET_CART_ERROR", error);
        return {
          success: false,
          message: error.message ?? "Update cart failed",
        };
      }
    },
    async clearCart({commit}){
      await commit("CLEAR_CART");
    }
  },
  getters: {
    getTotalCart(state) {
      const total = {
        totalPrice: 0,
        totalDiscount: 0,
        totalFinal: 0,
      };

      if (state.cartItems.length > 0) {
        state.cartItems.forEach((cartItem) => {
          total.totalPrice += cartItem.product?.price * cartItem.quantity;
  
          if ( cartItem.product?.discount) {
            total.totalDiscount += cartItem.product?.discount * cartItem.quantity;
          }
        });

        total.totalFinal += total.totalPrice - total.totalDiscount;
      }

      return total;
    },
    getCartItems(state) {
      return state.cartItems;
    },
    getCountCart(state) {
      var countCart = state.cartItems.length > 0 ? state.cartItems.length : 0;

      return countCart;
    },
    isLoading: (state) => state.isLoading
  },
};

export default cart;