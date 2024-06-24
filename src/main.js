import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { store } from "./store";
import router from "./router";
import Vue3Toastify from "vue3-toastify";
import "./assets/fonts.css";
import {
  faTwitter,
  faFacebook,
  faTiktok,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMagnifyingGlass,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faEnvelope,
  faEye,
  faCarSide,
  faHouse,
  faCircleCheck,
  faX,
  faPen,
  faPlus,
  faCircle,
  faCircleXmark,
  faHeart as faHeartSolid,
  faCartShopping,
  faBars,
  faXmark,
  faStar as faStarSolid,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as faHeartRegular,
  faUser,
  faStar as faStarRegular,
} from "@fortawesome/free-regular-svg-icons";
library.add(
  faTwitter,
  faFacebook,
  faTiktok,
  faInstagram,
  faMagnifyingGlass,
  faChevronDown,
  faEnvelope,
  faEye,
  faHeartRegular,
  faChevronLeft,
  faChevronRight,
  faCarSide,
  faHouse,
  faCircleCheck,
  faX,
  faCircleXmark,
  faHeartSolid,
  faCartShopping,
  faPen,
  faPlus,
  faUser,
  faCircle,
  faBars,
  faXmark,
  faStarRegular,
  faStarSolid,
  faReply
);

createApp(App)
  .use(store)
  .use(router)
  .use(Vue3Toastify, {
    autoClose: 2000,
    style: {
      opacity: "1",
      userSelect: "initial",
    },
  })
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
