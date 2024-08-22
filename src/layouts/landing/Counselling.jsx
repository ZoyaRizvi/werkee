import React from 'react';

export default function ResponsiveComponent() {
  return (
    <div id='whatsnew' className="p-4 sm:p-8 lg:p-16">
      <div className="flex flex-col sm:flex-row items-center sm:space-x-8 mt-12 sm:mt-24 max-w-screen-lg mx-auto">
        <div data-aos="fade-right" className="relative w-full sm:w-1/2">
          <div className="bg-teal-500 rounded-full absolute w-12 h-12 z-0 -left-4 -top-3 animate-pulse"></div>
          <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl relative z-50 text-darken lg:pr-10">
            Discover Your Path with <span className="text-teal-500">Personalized Career <br className="hidden md:block"/> Counseling </span>
          </h1>
          <p className="py-3 sm:py-5 lg:pr-32 text-sm sm:text-base lg:text-lg">
            Navigate your career journey with confidence using our AI-powered virtual assistant.
            Receive personalized guidance tailored to your skills, interests, and goals. Whether you're a student exploring career options or a professional seeking new opportunities,
            our virtual assistant is here to help you every step of the way.
          </p>
          <a href="#" className="underline text-blue-600 hover:text-blue-800">Learn More</a>
        </div>
        <div data-aos="fade-left" className="relative w-full sm:w-1/2 mt-8 sm:mt-0">
          <div style={{ background: '#23BDEE' }} className="floating w-16 h-16 sm:w-24 sm:h-24 absolute rounded-lg z-0 -top-3 -left-3"></div>
          <img className="rounded-xl w-full max-w-xs sm:max-w-md mx-auto z-40 relative" src="img/teacher-explaining.png" alt="Teacher explaining" />
          <button className="bg-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none transition-transform hover:scale-110 duration-300 ease-in-out z-50">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.5751 12.8097C23.2212 13.1983 23.2212 14.135 22.5751 14.5236L1.51538 27.1891C0.848878 27.5899 5.91205e-07 27.1099 6.25202e-07 26.3321L1.73245e-06 1.00123C1.76645e-06 0.223477 0.848877 -0.256572 1.51538 0.14427L22.5751 12.8097Z" fill="#23BDEE" />
            </svg>
          </button>
          <div className="bg-teal-500 w-32 h-32 sm:w-40 sm:h-40 floating absolute rounded-lg z-10 -bottom-3 -right-3"></div>
        </div>
      </div>
    </div>
  );
}
