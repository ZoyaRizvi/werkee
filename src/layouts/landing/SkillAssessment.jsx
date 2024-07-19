import React from 'react'

export default function SkillAssessment() {
  return (
    <div>
    <div className="container mx-auto ">
      <div className="flex flex-col md:flex-row items-center mt-16">
        <div data-aos="fade-right" className="md:w-1/2 lg:pl-14">
          <h1 className="text-darken font-semibold text-3xl lg:pr-56">Unlock Your Potential with <span className="text-teal-500">Skill Assessments</span> </h1>
          <p className="text-gray-500 my-4 lg:pr-32">
            At WERKY, we understand the importance of knowing your strengths and talents.
            That's why we're introducing skill assessments tailored specifically for teens. 
            Our assessments are designed to help you 
            uncover your unique skills, abilities, and interests, empowering you to make informed decisions about your future.
          </p>
        </div>
        <img style={{borderRadius:"20px"}} data-aos="fade-left" className="md:w-1/2" src="img/girl-with-books.png" alt="" />
      </div>
    </div>

    </div>
  )
}
