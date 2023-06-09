import React, { useState } from "react";
import AuthButton from "./AuthButton";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import TextInput from "../Shared/Inputs/TextInput";
import PasswordInput from "../Shared/Inputs/PasswordInput";
import Button from "../Shared/Buttons/Button";
import Divider from "../Shared/Divider";
import Link from "next/link";
import md5 from "md5";
import api from "../../utils/axiosInstance";
import { ToastError, ToastSuccess } from "../Shared/Toasts/Notification";
import LogError from "../../utils/LogError";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const { setIsAuthenticated } = useAuth();
  const Router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [Inputs, SetInputs] = useState({
    Email: "",
    Password: "",
  });
  const handleInputs = (event: any) => {
    const { name, value } = event.target;
    SetInputs({ ...Inputs, [name]: value });
  };

  const SubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        email: Inputs.Email,
        password: md5(Inputs.Password),
      });
      if (response) {
        console.log(response);
        if (response?.status === 200) {
          setCookie("jwToken", response?.data?.token, {
            expires: new Date(Date.now() + 3600),
          });
          setIsAuthenticated(true);
          Router.push("/");
        }
        if (response?.status === 401) {
          ToastError(response.data.message);
        }
      }
    } catch (error) {
      LogError("Login", error);
      ToastError("Unable to login");
    }
  };

  return (
    <div className="w-full h-screen grid md:grid-cols-4">
      <form
        onSubmit={SubmitLogin}
        className="w-full h-full flex flex-col md:col-span-2 lg:col-span-1 gap-8 justify-center bg-white p-4"
      >
        <p className="font-inter font-semibold text-2xl text-black">
          Log in to your account
        </p>
        <div className="w-full flex flex-col justify-center gap-4">
          <AuthButton
            Icon={<FcGoogle size={30} />}
            Text="Google"
            OnClick={() => {}}
          />
          <AuthButton
            Icon={<BsGithub size={30} />}
            Text="Github"
            OnClick={() => {}}
          />
          <Divider Content="or" />
          <div className="w-full flex flex-col gap-3 items-center justify-center">
            <TextInput
              Name="Email"
              IsCompulsory={true}
              Type="email"
              state={Inputs.Email}
              SetState={handleInputs}
              placeholder="Enter Your Email"
              label="Email"
            />
            <PasswordInput
              Name="Password"
              IsCompulsory={true}
              state={Inputs.Password}
              SetState={handleInputs}
            />
          </div>
        </div>
        <Button
          OnCLick={() => {}}
          variant="contained"
          style="bg-brand-main text-white h-[40px]"
          Type="submit"
          Text="Login"
        />
        <div className="w-full flex justify-between ">
          <div className="flex justify-center items-center gap-2">
            <p className="font-inter text-black-main text-left text-[13px] font-medium">{`Don't have an account?`}</p>
            <Link
              href={"/signup"}
              className="font-inter text-black-abbey text-[13px] font-medium"
            >
              Signup
            </Link>
          </div>
          <Link
            href={"/forgetpassword"}
            className="font-inter text-black-main text-left text-[13px] whitespace-nowrap font-medium"
          >
            Forget Password?
          </Link>
        </div>
      </form>
      <div className='w-full h-full hidden md:flex md:col-span-2 lg:col-span-3 bg-[url("/Login/Login.jpg")] bg-cover bg-no-repeat' />
    </div>
  );
};

export default Login;
