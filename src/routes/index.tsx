import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignInLayout from "../layouts/SignInLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import React from "react";
import SignInPage from "../pages/SignIn";
import UserPage from "../pages/User";
import UserViewPage from "../pages/User/view";
import ProtectRoute from "./ProtectRoute";
import StakingPage from "../pages/Staking";
import TxHistoryPage from "../pages/Tx";
import StakingViewPage from '../pages/Staking/view';
import LockupPage from "../pages/Lockup";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <SignInLayout component={<SignInPage />} /> } />
        <Route path="/sign-in" element={ <SignInLayout component={<SignInPage />} /> } />
        <Route element={<ProtectRoute/>}>
          <Route element={<DefaultLayout />}>
            <Route path="/user" element={ <UserPage /> } />
            <Route path="/user/:id" element={ <UserViewPage /> } />
          </Route>
          <Route element={<DefaultLayout />}>
            <Route path="/tx" element={ <TxHistoryPage /> } />
          </Route>
          <Route element={<DefaultLayout />}>
            <Route path="/staking" element={ <StakingPage /> } />
            <Route path="/staking/:id" element={ <StakingViewPage /> } />
          </Route>
          <Route element={<DefaultLayout />}>
            <Route path="/lockup" element={ <LockupPage /> } />
          </Route>
        </Route>
      </Routes>

    </BrowserRouter>
  );
}
export default Router;
