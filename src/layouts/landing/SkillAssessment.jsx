import React from 'react';

export default function SkillAssessment() {
  return (
    <div className="py-8 sm:py-12 lg:py-16 mx-auto max-w-screen-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:space-x-8 mt-12">
          <div data-aos="fade-right" className="lg:w-1/2">
            <h1 className="text-darken font-semibold text-2xl sm:text-3xl lg:text-4xl mb-4 lg:mb-6">
              Unlock Your Potential with <span className="text-teal-500">Skill Assessments</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
              At WERKEE, we understand the importance of knowing your strengths and talents.
              That's why we're introducing skill assessments tailored specifically for teens. 
              Our assessments are designed to help you 
              uncover your unique skills, abilities, and interests, empowering you to make informed decisions about your future.
            </p>
          </div>
          <img 
            data-aos="fade-left" 
            className="w-full lg:w-1/2 mt-8 lg:mt-0 rounded-lg" 
            src="img/girl-with-books.png" 
            alt="Girl with books" 
          />
        </div>
      </div>
    </div>
  );
}
