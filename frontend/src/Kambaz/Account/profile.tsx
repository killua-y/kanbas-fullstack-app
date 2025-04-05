import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { FormControl, Button } from "react-bootstrap";
import * as client from "./client";
export default function Profile() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(currentUser);

  const updateProfile = async () => {
    console.log("Updating profile:", profile);
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/Kambaz/Account/Signin");
  };

  // old user logic
  // const fetchProfile = () => {
  //   if (!currentUser) return navigate("/Kambaz/Account/Signin");
  //   setProfile(currentUser);
  // };

  // useEffect(() => { fetchProfile(); });
  
  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>
      {profile && (
        <div>
          <FormControl value={profile.username || ""} id="wd-username" className="mb-2" 
                       onChange={(e) => setProfile({ ...profile, username:  e.target.value })}/>
          <FormControl value={profile.password} id="wd-password" className="mb-2"
                       onChange={(e) => setProfile({ ...profile, password:  e.target.value })}/>
          <FormControl value={profile.firstName} id="wd-firstname" className="mb-2" placeholder="First Name"
                       onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}/>
          <FormControl value={profile.lastName} id="wd-lastname" className="mb-2" placeholder="Last Name"
                       onChange={(e) => setProfile({ ...profile, lastName:  e.target.value })}/>
          <FormControl value={profile.dob} id="wd-dob" className="mb-2"
                       onChange={(e) => setProfile({ ...profile, dob: e.target.value })} type="date"/>
          <FormControl value={profile.email} id="wd-email" className="mb-2" placeholder="Email"
                       onChange={ (e) => setProfile({ ...profile, email: e.target.value })}/>
          <select value={profile.role} onChange={(e) => setProfile({ ...profile, role:  e.target.value })}
                 className="form-control mb-2" id="wd-role">
            <option value="USER">User</option>            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>      <option value="STUDENT">Student</option>
          </select>
          <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update </button>
          <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
            Sign out
          </Button>
        </div>
      )}
</div>);}