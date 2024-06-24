import axiosInstance from "../../config/axiosInstance";

const wishlist = {
  namespaced: true,
  state: {
    wishlist: [],
  },
  mutations: {
    setWishlist(state, wishlist) {
      state.wishlist = wishlist;
    },
  },
  actions: {
    async fetchWishlist({ commit }) {
      try {
        const res = await axiosInstance.get("/wishlist");
        commit("setWishlist", res?.data?.data || []);
      } catch (error) {}
    },
    async clearWishlist({ commit }) {
      commit("setWishlist", []);
    },
  },
  getters: {
    wishlist: (state) => state.wishlist,
    countWishlist: (state) => state.wishlist.length,
  },
};
export default wishlist;
