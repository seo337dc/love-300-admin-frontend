import { Navigate, Outlet } from 'react-router-dom';
import {getAuthorization} from "../store/authorization";

const ProtectRoute = () => {
  const token = getAuthorization();
  const checkAuth = (): boolean => {
    return !!token
  }
  return (
    checkAuth() ? <Outlet /> : <Navigate to="/sign-in" />
  );
};
export default ProtectRoute;
