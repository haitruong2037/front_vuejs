import { computed } from "vue";
import { useStore } from "vuex";

const routerGuard = async (to, from, next) => {
  const store = useStore();
  const checkRefreshToken = async () => {
    if (store.state.auth.token && !store.state.auth.isLogin) {
      await store.dispatch("auth/refreshToken");
    }
  };

  const checkCart = async () => {
    const isLoading = computed( () => store.getters["cart/isLoading"] );
    const getCountCart = computed( () => store.getters["cart/getCountCart"] );

    while ( isLoading.value ) {
      await new Promise( resolve => setTimeout( resolve, 100 ) );
    }

    return getCountCart.value;
  }


  await checkRefreshToken();
  if (to.meta.requiresAuth && !store.getters["auth/isLogin"]) {
    next({ name: "Login" });
  } else if (to.meta.requiresGuest && store.getters["auth/isLogin"]) {
    next({ name: "Home" });
  } else if (to.meta.requiresCart) {
    const countCart = await checkCart();
    if (countCart == 0){
      next( { name: "Carts" } );
    } else {
      next();
    }
  } else {
    next();
  }
};
export default routerGuard;
