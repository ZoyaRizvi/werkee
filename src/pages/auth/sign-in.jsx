import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword } from '../../firebase/auth';
import { useAuth } from '../../context/authContext/index';
import React, { useState } from 'react';

export function SignIn() {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password)
        .catch((err) => {
          setErrorMessage(`Auth Error: ${err.code}`);
          setIsSigningIn(false);
        });
    }
  };

  return (
    <>
      {userLoggedIn ? (
        <Navigate to={'/dashboard/home'} replace={true} />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <section className="flex w-full max-w-4xl rounded-lg shadow-lg bg-white">
            <div className="w-full md:w-1/2 p-8 space-y-6 flex flex-col justify-center">
              <div className="text-center">
                <Typography variant="h2" className="font-bold mb-4">
                  Sign In
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
                  Enter your email and password to Sign In.
                </Typography>
              </div>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      Your email
                    </Typography>
                    <Input
                      size="lg"
                      placeholder="name@mail.com"
                      className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      Password
                    </Typography>
                    <Input
                      type="password"
                      size="lg"
                      placeholder="********"
                      className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                {errorMessage && (
                  <span className="text-red-600 font-bold">{errorMessage}</span>
                )}
                <Button
                  variant="text"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="mt-4"
                  fullWidth
                >
                  Go Back
                </Button>
                <Button
                  disabled={isSigningIn}
                  onClick={onSubmit}
                  className="mt-4"
                  fullWidth
                >
                  Sign In
                </Button>
                <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                  Not registered?
                  <Link to="/auth/sign-up" className="text-gray-900 hover:text-teal-800 ml-1">Create account</Link>
                </Typography>
              </form>
            </div>
            <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/img/auth.png')` }}>
              <div className="bg-black opacity-50 w-full h-full"></div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default SignIn;
