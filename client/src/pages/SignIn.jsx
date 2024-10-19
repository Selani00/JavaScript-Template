import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoWhite from "../assets/images/LogoWhite.png";
import logo from "../assets/images/Agastra Logo.svg";
import { Button, Spinner, Toast } from "flowbite-react";
import { HiX } from "react-icons/hi";

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      dispatch(signInFailure("Please fill all the fields!"));
    }
    try {
      dispatch(signInStart());
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data));
        navigate("/dashboard");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="min-h-screen flex">
      <div className="hidden w-full md:w-1/2 md:flex flex-col items-center justify-center bg-gray-200">
        <img src={logo} alt="Logo" className="w-3/4 max-w-lg" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="w-3/4 max-w-md">
          <div className="text-center mb-6">
            <Link to="/">
              <img src={logoWhite} alt="Logo" className="w-35 mx-auto mb-4" />
            </Link>
            <h2 className="text-2xl font-bold">Welcome to Agastra!</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-300 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Username
              </label>
              <input
                className="bg-[#111827] text-white shadow  border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Enter your email..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-300 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="bg-[#111827] text-white shadow appearance-none border rounded w-full py-2 px-3  mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center">
            <Button gradientDuoTone="purpleToBlue" size="lg" type="submit">

                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Loading...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>

        </div>
        {errorMessage && (
            <Toast className="mt-10">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <HiX className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">{errorMessage}</div>
              <Toast.Toggle />
            </Toast>
          )}
      </div>
    </div>
  );
};

export default SignIn;
