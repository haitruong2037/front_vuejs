import axiosInstance from "../../config/axiosInstance";

const address = {
    namespaced: true,
    state: {
        addresses: [],
        isLoading: false,
        error: null,
    },
    mutations: {
        SET_ADDRESS(state, payload) {
            state.addresses = payload;
            state.error = null;
            state.isLoading = false;
        },
        UPDATE_ADDRESS(state, payload) {
            const item = state.addresses.find((item) => item.id == payload.id);
            if (item) {
                if ( payload.default) {
                    state.addresses.forEach( item => {
                    if ( item.default ) {
                        item.default = false;
                    }});
                }
                Object.assign(item, payload)
            }

            state.isLoading = false;
        },
        SET_DEFAULT_ADDRESS( state, payload ) {
            state.addresses.forEach( item => {
                if ( item.default ) {
                    item.default = false;
                }
                if ( item.id === payload.id ) {
                    Object.assign( item, payload ); 
                    item.default = true; 
                }
            } );

            state.isLoading = false;
        },
        REMOVE_ADDRESS( state, payload ) {
            state.addresses = state.addresses.filter( ( item ) => item.id !== payload );
        },
        CLEAR_ADDRESS(state) {
            state.addresses = [];
            state.isLoading = false;
            state.error = null;
        },
        SET_ADDRESS_ERROR(state, error) {
            state.isLoading = false;
            state.error = error;
        },
    },
    actions: {
        async fetchAddress({ commit }) {
            try {
                const response = await axiosInstance.get("/profile/addresses");
                commit("SET_ADDRESS", response);
            } catch (error) {
                commit("SET_ADDRESS_ERROR", error);
            }
        },
        async addAddress({ commit }, payload) {
            try {
                const response = await axiosInstance.post(`/profile/addresses/`, payload);

                this.dispatch("address/fetchAddress");

                return {
                    success: true,
                    message: response.message ?? "Address successfully added",
                };
            } catch (error) {
                commit("SET_ADDRESS_ERROR", error);
                return {
                    success: false,
                    message: error.message ?? "Add Address failed",
                };
            }
        },
        async updateAddress( { commit }, payload ) {
            try {
                const response = await axiosInstance.post(`/profile/addresses/${payload.id}`,payload);

                commit("UPDATE_ADDRESS", payload);

                return {
                    success: true,
                    message: response.message.message ?? "Updated address successfully",
                };
            } catch (error) {
                commit("SET_ADDRESS_ERROR", error);
                return {
                    success: false,
                    message: error.message ?? "Update address failed",
                };
            }
        },
        async setDefaultAddress( {state, commit }, addressId ) {
            try {
                const address = state.addresses.find(item => item.id === addressId);

                const addressNew = { ...address, default: 1 };

                const response = await axiosInstance.post( `/profile/addresses/${addressId}`, addressNew );

                commit( "SET_DEFAULT_ADDRESS", address );

                return {
                    success: true,
                    message: response.message.message ?? "Updated address successfully",
                };
            } catch ( error ) {
                commit( "SET_ADDRESS_ERROR", error );
                return {
                    success: false,
                    message: error.message ?? "Update address failed",
                };
            }
        },
        async removeAddress({ commit }, addressId) {
            try {
                const response = await axiosInstance.delete( `/profile/addresses/${addressId}`);

                commit( "REMOVE_ADDRESS", addressId );

                return {
                    success: true,
                    message: response.message ?? "Address deleted successfully",
                };
            } catch (error) {
                commit("SET_ADDRESS_ERROR", error);
                return {
                    success: false,
                    message: error.message ?? "Delete address failed",
                };
            }
        },
        async clearAddress({ commit }) {
            commit("CLEAR_ADDRESS");
        },
    },
    getters: {
        getAddresses: ( state ) => {
            return [...state.addresses].sort( ( a, b ) => {
                if ( a.default && !b.default ) {
                    return -1;
                } else if ( !a.default && b.default ) {
                    return 1;
                } else {
                    return 0;
                }
            } );
        },
    },
};

export default address;
