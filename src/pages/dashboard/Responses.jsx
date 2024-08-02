import React, { useEffect, useState } from 'react';
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Adjust the path as necessary
import { getAuth } from "firebase/auth";

export default function Responses() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) {
        console.error("No user is currently signed in.");
        return;
      }

      try {
        const recruiterDocRef = collection(db, 'JobResponses', currentUser.uid, 'applications');
        const querySnapshot = await getDocs(recruiterDocRef);
        const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(apps);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications: ", error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardBody>
        <div className="mb-4 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Latest Responses
          </Typography>
          <Typography
            as="a"
            href="#"
            variant="small"
            color="blue"
            className="font-bold"
          >
            View all
          </Typography>
        </div>
        <div className="divide-y divide-gray-200">
          {applications.map(({ id, name, email, jobTitle, resume, coverLetter }, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-x-3">
                <div className="flex flex-col">
                  <Typography color="blue-gray" variant="h6">
                    {name}
                  </Typography>
                  <Typography variant="small" color="gray" >
                    {email}
                  </Typography>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <Typography variant="small" color="blue-gray">
                     Job Title: <b>{jobTitle}</b>
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="small" color="black">
                      {coverLetter}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="small" color="blue">
                      <a href={resume} download className="text-blue-500">
                        Download Resume
                      </a>
                    </Typography>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

