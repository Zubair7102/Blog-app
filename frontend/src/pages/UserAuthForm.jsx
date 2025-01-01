import React from "react";
import InputBox from "../components/InputBox";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/AnimationWrapper";
import { useRef } from "react";
import {Toaster, toast} from 'react-hot-toast';
import axios from 'axios';

const UserAuthForm = ({ type }) => {


  // const authForm = useRef(null);
  // use useRef react hook we can reference the form here and can use the authForm in any function to use the form data
  const userAuthThroughServer = (serverRoute, formData ) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
    .then(({data}) => {
      console.log(data);
    })
    .catch(({response}) => { toast.error(response.data.error)
  })
}
  
  const handleSubmit = (event) => {
    event.preventDefault();

    let serverRoute = type === "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


    // formData
    let form = new FormData(formElement);
    // authForm.current is the form element and we are passing it to the FormData constructor to get the form data which is stored in the form variable
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    console.log(formData);

    // form validation
    // Destructuring data from the formData
    let { fullname, email, password } = formData;
    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be at least 3 letters long");
      }
    }
    if (!email.length) {
      return toast.error("Enter Email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Invalid Email");
    }
    if (!passwordRegex.test(password)) {
      return toast.error("Password must be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter");
    }

    userAuthThroughServer(serverRoute, formData);
  };
  return (
    <div>
      <AnimationWrapper keyValue={type}>
        <section className="h-cover flex items-center justify-center ">
          <Toaster/>
          <form
            id = "formElement"
            className="w-[80%] max-w-[400px]"
            onSubmit={handleSubmit}
          >
            <h1 className="text-4xl font-bold font-gelasio capitalize text-center mb-24">
              {type === "sign-in" ? "Welcome Back" : "Join Us Today"}
            </h1>

            {type != "sign-in" ? (
              <InputBox
                name="fullname"
                type="text"
                placeholder="Full Name"
                icon="fi-rr-user-add"
              />
            ) : (
              ""
            )}

            <InputBox
              name="email"
              type="email"
              placeholder="Em@il"
              icon="fi-rr-envelope"
            />

            <InputBox
              name="password"
              type="password"
              placeholder="Password"
              icon="fi-rr-key"
            />

            <button className="btn-dark center mt-14" type="submit">
              {type.replace("-", " ")}
            </button>

            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
              <hr className="w-1/2 border-black" />
              <p>Or</p>
              <hr className="w-1/2 border-black" />
            </div>

            <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
              <img src={googleIcon} className="w-5" />
              Continue with Google
            </button>

            {type == "sign-in" ? (
              <p className="mt-6 text-dark-grey text-xl text-center  ">
                Don't have an account ?
                <Link
                  to="/signup"
                  className="underline text-black text-xl ml-1 "
                >
                  Create Account
                </Link>
              </p>
            ) : (
              <p className="mt-6 text-dark-grey text-xl text-center  ">
                Already a member ?
                <Link
                  to="/signin"
                  className="underline text-black text-xl ml-1 "
                >
                  Login here
                </Link>
              </p>
            )}
          </form>
        </section>
      </AnimationWrapper>
    </div>
  );
};

export default UserAuthForm;
