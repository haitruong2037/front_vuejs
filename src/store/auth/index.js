import axiosInstance from "../../config/axiosInstance";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const auth = {
  namespaced: true,
  state: {
    user: null,
    isLoading: true,
    isLogin: false,
    token: localStorage.getItem( "token" ) || "",
    error: null,
  },
  mutations: {
    loginSuccess( state, data ) {
      state.token = data.token;
      state.user = data.user;
      state.isLogin = true;
      state.isLoading = false;
    },
    loginFail( state, message ) {
      state.token = null;
      state.user = null;
      state.isLogin = false;
      state.isLoading = false;
      state.error = message;
      localStorage.removeItem( "token" );
    },
    setLoading( state, status ) {
      state.isLoading = status;
    },
    logOut( state ) {
      state.user = null;
      localStorage.removeItem( "token" );
      state.isLogin = false;
    },
    updateUserRequest( state ) {
      state.isLoading = true;
      state.error = null;
    },
    updateUserSuccess( state, data ) {
      state.user = data;
      state.isLoading = false;
    },
    updateUserFail( state, error ) {
      state.error = error;
      state.isLoading = false;
    },
  },
  actions: {
    loginUser( { commit }, data ) {
      commit( "loginSuccess", data );
      this.dispatch( "cart/fetchCart" );
      this.dispatch( "address/fetchAddress" );
      this.dispatch( "wishlist/fetchWishlist" );
    },
    async refreshToken( { commit } ) {
      commit( "setLoading", true );
      try {
        const res = await axiosInstance.post( "/auth/refresh" );
        if ( res.access_token ) {
          localStorage.setItem( "token", res.access_token );

          const data = {
            user: res.user,
            token: res.access_token,
          };
          
          commit( "loginSuccess", data );
          this.dispatch( "cart/fetchCart" );
          this.dispatch( "address/fetchAddress" );
          this.dispatch( "wishlist/fetchWishlist" );
        } else {

          localStorage.removeItem( "token" );
          commit( "loginFail", res.status );
        }
      } catch ( error ) {
        commit( "loginFail", error );

      }
    },
    logOut( { commit } ) {
      commit( "logOut" );
      this.dispatch( "cart/clearCart" );
      this.dispatch( "address/clearAddress" );
      this.dispatch( "wishlist/clearWishlist" );
    },
    // Update Profile
    async updateUser( { commit }, data ) {
      commit( "updateUserRequest" );
      try {
        const res = await axiosInstance.post( "/profile", data );
        const file = data.image;
        if ( file ) {
          const reader = new FileReader();
          reader.onload = () => {
            data.url_image = reader.result;
          };
          reader.readAsDataURL( file );
        }

        commit( "updateUserSuccess", data );
        return {
          success: true,
          message: res.message ?? "Updated profile successfully",
        };
      } catch ( error ) {
        commit( "updateUserFail", error );
        return {
          success: false,
          message: error?.message || "Failed to update user",
        };
      }
    },
  },
  getters: {
    isLoading: ( state ) => state.isLoading,
    isLogin: ( state ) => state.isLogin,
    error: ( state ) => state.error,
    user: ( state ) => state.user,
    userName: ( state ) => ( state.user ? state.user.name : null ),
  },
};
export default auth;
