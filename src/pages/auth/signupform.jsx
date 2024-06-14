import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography, Radio } from '@material-tailwind/react';

function SignUpForm() {
  const [role, setRole] = useState('candidate');
  const [candidateDetails, setCandidateDetails] = useState({ skillset: '', experience: '' });
  const [recruiterDetails, setRecruiterDetails] = useState({ company: '', position: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    if (role === 'candidate') {
      navigate('/candidate/home');
    } else {
      navigate('/dashboard/home');
    }
  };

  return (
    <Card className="m-8 p-8 max-w-md mx-auto">
      <Typography variant="h4" className="mb-4">Join as {role === 'candidate' ? 'Candidate' : 'Recruiter'}</Typography>
      <form onSubmit={handleSubmit}>
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

        <Button type="submit" className="mt-6" fullWidth>
          Submit
        </Button>
      </form>
    </Card>
  );
}

export default SignUpForm;
