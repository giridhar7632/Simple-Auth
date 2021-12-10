import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import React, { useRef, useState } from "react";

const Login = ({ setIsLogin, setAuth }) => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });
  const [show, setShow] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);

  const toast = useToast();
  const toastIdRef = useRef();
  const addToast = (text, type) => {
    toastIdRef.current = toast({
      title: `${text}`,
      status: `${type}`,
      isClosable: true,
      duration: 3000
    });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const handlePassword = () => setShow(!show);
  const handleResigter = () => setIsRegistered(!isRegistered);
  const handleLogin = () => setIsRegistered(!isRegistered);

  const registerUser = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("/user/register", {
        firstname: user.firstname,
        lastname: user.firstname,
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address
      });
      setUser({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phone: "",
        address: ""
      });
      addToast(res.data.message, res.data.type);
      setIsRegistered(true);
    } catch (error) {
      error.response.data.message &&
        addToast(error.response.data.message, error.response.data.type);
    }
  };

  const userLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("/user/login", {
        email: user.email,
        password: user.password
      });
      setAuth(res.data.user);
      setUser({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phone: "",
        address: ""
      });
      addToast(res.data.message, "success");
      localStorage.setItem("token", res.data.token);
      setIsLogin(true);
    } catch (error) {
      error.data.message && addToast(error.data.message, error.data.type);
    }
  };

  return (
    <Stack direction="column">
      {isRegistered ? (
        <Flex
          className="login"
          p="6"
          flexDirection="column"
          justifyContent="center"
        >
          <form onSubmit={userLogin}>
            <Heading as="h2" size="lg" textAlign="center" mb={6}>
              Login
            </Heading>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </FormControl>
            <FormControl id="password" mt="2" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handlePassword}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button mt={6} type="submit" colorScheme="purple" variant="solid">
              Login
            </Button>
          </form>
          <Text mt={6}>
            Don't have an account?{" "}
            <Link color="purple.500" onClick={handleResigter}>
              Register now
            </Link>
          </Text>
        </Flex>
      ) : (
        <Flex
          className="register"
          p="6"
          flexDirection="column"
          justifyContent="center"
        >
          <form onSubmit={registerUser}>
            <Heading as="h2" size="lg" textAlign="center" mb={6}>
              Register
            </Heading>
            <FormControl id="firstname">
              <FormLabel>Firstname</FormLabel>
              <Input
                value={user.firstname}
                name="firstname"
                onChange={handleChange}
                placeholder=""
              />
            </FormControl>
            <FormControl id="lastname">
              <FormLabel>Lastname</FormLabel>
              <Input
                value={user.lastname}
                name="lastname"
                onChange={handleChange}
                placeholder=""
              />
            </FormControl>
            <FormControl id="email" mt="2" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </FormControl>
            <FormControl id="password" mt="2" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  value={user.password}
                  name="password"
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handlePassword}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="phone" mt="2">
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                value={user.phone}
                onChange={handleChange}
                placeholder="+91"
              />
            </FormControl>
            <FormControl id="address" mt="2">
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                value={user.address}
                onChange={handleChange}
                placeholder=""
              />
            </FormControl>

            <Button mt={6} type="submit" colorScheme="purple" variant="solid">
              Register
            </Button>
          </form>
          <Text mt={6}>
            Already have an account?{" "}
            <Link color="purple.500" onClick={handleLogin}>
              Sign in
            </Link>
          </Text>
        </Flex>
      )}
    </Stack>
  );
};

export default Login;
