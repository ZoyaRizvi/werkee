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
  const [candidateDetails, setCandidateDetails] = useState({ skillset: '', experience: '' });
  const [recruiterDetails, setRecruiterDetails] = useState({ company: '', position: '' });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
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
          ...role === 'candidate' ? candidateDetails : recruiterDetails
        });
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsRegistering(false);
      }
    }
  };

  // const onGoogleSignIn = (e) => {
  //   e.preventDefault();
  //   if (!isRegistering) {
  //     setIsRegistering(true);
  //     doSignInWithGoogle().then(() => {
  //     }).catch(err => {
  //       setErrorMessage(`Auth Error: ${err.code}`);
  //       setIsRegistering(false);
  //     });
  //   }
  // };

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
              alt="Pattern"
            />
          </div>
          <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
            <div className="text-center">
              <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
              <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
            </div>
            <form onSubmit={onSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
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
                <Typography variant="h5" className="mb-4 text-center">Join as {role === 'candidate' ? 'Candidate' : 'Recruiter'}</Typography>
                <div className="mb-4 flex justify-around">
                  <Radio
                    id="candidate"
                    name="role"
                    label="Candidate"
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
                {role === 'candidate' && (
                  <>
                    <div className="mb-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">Skillset</Typography>
                      <Input
                        size="lg"
                        placeholder="Skillset"
                        value={candidateDetails.skillset}
                        onChange={e => setCandidateDetails({ ...candidateDetails, skillset: e.target.value })}
                        className="border border-gray-300 rounded-md mt-2"
                      />
                    </div>
                    <div className="mb-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">Experience (Years)</Typography>
                      <Input
                        size="lg"
                        placeholder="Experience (Years)"
                        value={candidateDetails.experience}
                        onChange={e => setCandidateDetails({ ...candidateDetails, experience: e.target.value })}
                        className="border border-gray-300 rounded-md mt-2"
                      />
                    </div>
                  </>
                )}
                {role === 'recruiter' && (
                  <>
                    <div className="mb-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">Company</Typography>
                      <Input
                        size="lg"
                        placeholder="Company"
                        value={recruiterDetails.company}
                        onChange={e => setRecruiterDetails({ ...recruiterDetails, company: e.target.value })}
                        className="border border-gray-300 rounded-md mt-2"
                      />
                    </div>
                    <div className="mb-4">
                      <Typography variant="small" color="blue-gray" className="font-medium">Position</Typography>
                      <Input
                        size="lg"
                        placeholder="Position"
                        value={recruiterDetails.position}
                        onChange={e => setRecruiterDetails({ ...recruiterDetails, position: e.target.value })}
                        className="border border-gray-300 rounded-md mt-2"
                      />
                    </div>
                  </>
                )}
              </Card>
              {errorMessage && <div className='text-red-600 font-bold text-center mb-4'>{errorMessage}</div>}
              <Button
                disabled={isRegistering}
                type="submit"
                className="mt-6"
                fullWidth>
                Register Now
              </Button>
              {/* <div className="space-y-4 mt-8">
                <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md border border-gray-300 rounded-full" fullWidth
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
              </div> */}
              <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
                Already have an account?
                <Link to="/auth/sign-in" className="text-blue-600 hover:text-blue-800 ml-1">Sign in</Link>
              </Typography>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

export default SignUp;
