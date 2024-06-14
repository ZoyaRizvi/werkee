import {
  Card,
  Input,
  Button,
  Typography,
  Radio,
} from "@material-tailwind/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from '../../firebase/auth';
import { useAuth } from '../../context/authContext/index';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";

const db = getFirestore();
// const auth = getAuth();

export function SignUp() {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Needs to pull from user object
  const [role, setRole] = useState('candidate');

  const [candidateDetails, setCandidateDetails] = useState({ skillset: '', experience: '' });
  const [recruiterDetails, setRecruiterDetails] = useState({ company: '', position: '' });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        const userCredential = await doCreateUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });

        // Save user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          role: role,
          createdAt: new Date()
        });

        if ( role == 'candidate') {
          navigate('/candidate/home');
          // return <Navigate to={'/candidate/home'} replace={true} />
        } else if ( role == 'recruiter') {
          navigate('/dashboard/home');
          // return <Navigate to={'/dashboard/home'} replace={true} />
        }
        // navigate('/auth/signupform'); // Redirect to form page after successful sign-up
      } catch (error) {
        const errorMessage = error.message;
        console.log(errorMessage);
        setErrorMessage(errorMessage); // Display error message to user
      } finally {
        setIsRegistering(false);
      }
    }
  };

  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      doSignInWithGoogle().then(() => {
        navigate('/auth/signupform'); // Redirect to form page after successful sign-in with Google
      }).catch(err => {
        setErrorMessage(`Auth Error: ${err.code}`);
        setIsRegistering(false);
      });
    }
  };

  return (
    <>
      {userLoggedIn ? (
        <Navigate to={'/dashboard/home'} replace={true} />
      ) : (
        <section className="m-8 flex">
          <div className="w-2/5 h-full hidden lg:block">
            <img
              src="/img/pattern.png"
              className="h-full w-full object-cover rounded-3xl"
            />
          </div>
          <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
            <div className="text-center">
              <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
              <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
            </div>
            <form onSubmit={onSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
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
                  onChange={e => setEmail(e.target.value)}
                />
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  Your Full Name
                </Typography>
                <Input
                  size="lg"
                  placeholder="Joshua Levitt"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
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
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              {errorMessage ? <span className='text-red-600 font-bold'>{errorMessage}</span> : null}
              <Button
                disabled={isRegistering}
                type="submit"
                className="mt-6"
                fullWidth>
                Register Now
              </Button>

              <div className="space-y-4 mt-8">
                <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth
                  disabled={isRegistering}
                  onClick={onGoogleSignIn}>
                  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_1156_824)">
                      <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                      <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                      <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                      <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1156_824">
                        <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Sign in With Google</span>
                </Button>
              </div>
              <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                Already have an account?
                <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
              </Typography>
            </form>
          </div>
          <Card className="m-8 p-8 max-w-md mx-auto">
            <Typography variant="h4" className="mb-4">Join as {role === 'candidate' ? 'Candidate' : 'Recruiter'}</Typography>
            {/* Merge this form with above form */}
            <form>
              <div className="mb-4">
                <Radio
                  id="candidate"
                  name="role"
                  label="Join as Candidate"
                  checked={role === 'candidate'}
                  onChange={() => setRole('candidate')}
                />
                <Radio
                  id="recruiter"
                  name="role"
                  label="Join as Recruiter"
                  checked={role === 'recruiter'}
                  onChange={() => setRole('recruiter')}
                />
              </div>
              
              {role === 'candidate' && (
                <>
                  <Input
                    size="lg"
                    label="Skillset"
                    value={candidateDetails.skillset}
                    onChange={e => setCandidateDetails({ ...candidateDetails, skillset: e.target.value })}
                    className="mb-4"
                  />
                  <Input
                    size="lg"
                    label="Experience (Years)"
                    value={candidateDetails.experience}
                    onChange={e => setCandidateDetails({ ...candidateDetails, experience: e.target.value })}
                    className="mb-4"
                  />
                </>
              )}

              {role === 'recruiter' && (
                <>
                  <Input
                    size="lg"
                    label="Company"
                    value={recruiterDetails.company}
                    onChange={e => setRecruiterDetails({ ...recruiterDetails, company: e.target.value })}
                    className="mb-4"
                  />
                  <Input
                    size="lg"
                    label="Position"
                    value={recruiterDetails.position}
                    onChange={e => setRecruiterDetails({ ...recruiterDetails, position: e.target.value })}
                    className="mb-4"
                  />
                </>
              )}

              {/* <Button type="submit" className="mt-6" fullWidth>
                Submit
              </Button> */}
            </form>
          </Card>
        </section>
      )}
    </>
  );
}

export default SignUp;
