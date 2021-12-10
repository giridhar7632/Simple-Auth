import React, { useEffect, useState } from "react";
import { ChakraProvider, Flex, theme } from "@chakra-ui/react";

// import { ColorModeSwitcher } from './components/ColorModeSwitcher'
import Login from "./components/Login";
import Profile from "./components/Profile";
import axios from "axios";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [auth, setAuth] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const verified = await axios.get("/user/verify", {
          headers: { Authorization: token }
        });
        setIsLogin(verified.data);
        if (verified.data) {
          const res = await axios.get("/user", {
            headers: { Authorization: token }
          });
          setAuth(res.data.user);
          setLoading(false);
        }
        if (verified.data === false) return localStorage.clear();
      } else {
        setIsLogin(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ChakraProvider theme={theme}>
      <Flex p={8} h="100vh" flexDirection="column" textAlign="center">
        <Flex maxW="100%" justifyContent="center" mt={8}>
          {isLogin ? (
            <Profile auth={auth} setIsLogin={setIsLogin} />
          ) : (
            <Login setAuth={setAuth} setIsLogin={setIsLogin} />
          )}
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
