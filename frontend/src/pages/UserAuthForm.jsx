import React from "react";
import InputBox from "../components/InputBox";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/AnimationWrapper";
import { useRef } from "react";

const UserAuthForm = ({ type }) => {

  const authForm = useRef(null);

  const handleSubmit =(event)=>{
    event.preventDefault();
    console.log(authForm.current);

    // formData
    const form = new FormData(authForm.current);
    let formData = {};

    for(let [key, value] of form.entries())
    {
      formData[key] = value;
    }

    console.log(formData);
  }
  return (
    <div>
      <AnimationWrapper keyValue={type}>
        <section className="h-cover flex items-center justify-center ">
          <form ref={authForm} className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
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

            <button className="btn-dark center mt-14" type="submit"
            >
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
