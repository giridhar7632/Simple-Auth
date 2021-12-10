import { Button } from "@chakra-ui/button";
import React from "react";

const Profile = ({ auth, setIsLogin }) => {
  const logout = async () => {
    localStorage.clear();
    setIsLogin(false);
  };

  return (
    <div>
      {auth ? (
        <>
          <b>Firstname</b>: {auth.firstname}
          <br />
          <b>Lastname</b>: {auth.lastname}
          <br />
          <b>Email</b>: {auth.email}
          <br />
          <b>Phone</b>: {auth.phone}
          <br />
          <b>Address</b>: {auth.address}
          <br />
          <Button onClick={logout}>logout</Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
