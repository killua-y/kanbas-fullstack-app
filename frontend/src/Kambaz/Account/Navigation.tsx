import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export default function AccountNavigation() {
  useSelector((state: any) => state.accountReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  useLocation();
  return (
    <div id="wd-account-navigation">
      {currentUser ? (
        <Link to={`/Kambaz/Account/Profile`}>Profile</Link>
      ) : (
        <>
          <Link to={`/Kambaz/Account/Signin`}>Signin</Link> <br />
          <Link to={`/Kambaz/Account/Signup`}>Signup</Link> <br />
        </>
      )}
    </div>
  );
}
