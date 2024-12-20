import {
  Card,
  Input,
  Button,
  Typography,
  Radio,
} from "@material-tailwind/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';
import { useAuth } from '../../context/authContext/index';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const db = getFirestore();

export function SignUp() {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [role, setRole] = useState('candidate');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('Email already in use');
    
    if (!email || !name || !password) {
      setErrorMessage('All fields are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (name.trim().length < 3) {
      setErrorMessage('Full name must be at least 3 characters.');
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        const userCredential = await doCreateUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          role: role,
          createdAt: new Date(),
        });
        
        navigate('/dashboard/home');
      } catch (error) {
        setErrorMessage("Email already in use");
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn ? (
        <Navigate to={'/dashboard/home'} replace={true} />
      ) : (
        <section className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/img/auth.png')` }}>
              <div className="bg-black opacity-50 w-full h-full"></div>
            </div>
            <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center">
              <div className="text-center">
                <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
                <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
              </div>
              <form onSubmit={onSubmit} className="mt-8 mb-2 w-full">
                <div className="mb-4">
                  <Typography variant="small" color="blue-gray" className="font-medium">Your Email</Typography>
                  <Input
                    size="lg"
                    placeholder="name@mail.com"
                    className="border border-gray-300 rounded-md mt-2"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <Typography variant="small" color="blue-gray" className="font-medium">Your Full Name</Typography>
                  <Input
                    size="lg"
                    placeholder="Joshua Levitt"
                    className="border border-gray-300 rounded-md mt-2"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <Typography variant="small" color="blue-gray" className="font-medium">Password</Typography>
                  <Input
                    type="password"
                    size="lg"
                    placeholder="********"
                    className="border border-gray-300 rounded-md mt-2"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <Card className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                  <Typography variant="h5" className="mb-4 text-center">Join as {role === 'candidate' ? 'Worker' : 'Recruiter'}</Typography>
                  <div className="mb-4 flex justify-around">
                    <Radio
                      id="candidate"
                      name="role"
                      label="Worker"
                      checked={role === 'candidate'}
                      onChange={() => setRole('candidate')}
                    />
                    <Radio
                      id="recruiter"
                      name="role"
                      label="Recruiter"
                      checked={role === 'recruiter'}
                      onChange={() => setRole('recruiter')}
                    />
                  </div>
                </Card>
                {errorMessage && <div className='text-red-600 font-bold text-center mb-4'>{errorMessage}</div>}
                <Button
                  disabled={isRegistering}
                  type="submit"
                  className="mt-6"
                  fullWidth>
                  Register Now
                </Button>
                <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                  Already have an account?
                  <Link to="/auth/sign-in" className="text-gray-900 hover:text-teal-800 ml-1">Sign in</Link>
                </Typography>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default SignUp;
