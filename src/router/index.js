import { createWebHistory, createRouter } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import AppLayout from "../layouts/AppLayout.vue";
import CategoryPage from "../pages/CategoryPage.vue";
import CartPage from "../pages/CartPage.vue";
import ProfilePage from "../pages/Profile.vue";
import PageNotFound from "../pages/PageNotFound.vue";
import LoginPage from "../pages/auth/LoginPage.vue";
import RegisterPage from "../pages/auth/RegisterPage.vue";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.vue";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.vue";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage.vue";
import VerifyEmailRequestPage from "../pages/auth/VerifyEmailRequestPage.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import routerGuard from "./routerGuard";
import ProductPage from "../pages/ProductPage.vue";
import OrderPage from "../pages/OrderPage.vue";
import OrderHistory from "../pages/OrderHistory.vue";
import ProductDetailsPage from "../pages/ProductDetailsPage.vue";
import WishListPage from "../pages/WishListPage.vue";
const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "/",
        component: HomePage,
        name: "Home",
      },
      {
        path: "category",
        name: "Category",
        component: CategoryPage,
      },
      {
        path: "carts",
        name: "Carts",
        component: CartPage,
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        name: "Profile",
        component: ProfilePage,
        meta: { requiresAuth: true },
      },
      {
        path: "product",
        name: "product",
        component: ProductPage,
      },
      {
        path: "product/:id/detail",
        name: "product-detail",
        component: ProductDetailsPage,
        props: true,
      },
      {
        path: "order",
        name: "order",
        component: OrderPage,
        meta: {
          requiresAuth: true,
          requiresCart: true,
        },
      },
      {
        path: "order/history",
        name: "order-history",
        component: OrderHistory,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "wishlist",
        name: "wishlist",
        component: WishListPage,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "Login",
        meta: { requiresGuest: true },
        component: LoginPage,
      },
      {
        path: "register",
        name: "Register",
        meta: { requiresGuest: true },
        component: RegisterPage,
      },
      {
        path: "forgot-password",
        name: "ForgotPassword",
        meta: { requiresGuest: true },
        component: ForgotPasswordPage,
      },
      {
        path: "reset-password/:token/:email",
        name: "ResetPassword",
        meta: { requiresGuest: true },
        component: ResetPasswordPage,
      },
      {
        path: "verify-email-request",
        name: "verify-email-request",
        meta: { requiresGuest: true },
        component: VerifyEmailRequestPage,
      },
      {
        path: "verify-email/:id/:hash",
        name: "verify-email",
        meta: { requiresGuest: true },
        component: VerifyEmailPage,
      },
    ],
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: PageNotFound },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach(routerGuard);
export default router;
