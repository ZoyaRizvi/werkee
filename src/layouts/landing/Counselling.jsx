import React from 'react'

export default function () {
  return (
    <div>
        <div className="sm:flex items-center sm:space-x-8 mt-36 max-w-screen-lg  container mx-auto flex justify-center items-center mt-24">
      <div data-aos="fade-right" className="sm:w-1/2 relative">
        <div className="bg-yellow-500 rounded-full absolute w-12 h-12 z-0 -left-4 -top-3 animate-pulse"></div>
        <h1 className="font-semibold text-2xl relative z-50 text-darken lg:pr-10">Discover Your Path with <span className="text-yellow-500">Personalized Career <br/> Counseling </span></h1>
        <p className="py-5 lg:pr-32">
          Navigate your career journey with confidence using our AI-powered virtual assistant.
          Receive personalized guidance tailored to your skills, interests, and goals. Whether you're a student exploring career options or a professional seeking new opportunities,
          our virtual assistant is here to help you every step of the way.
        </p>
        <a href="" className="underline">Learn More</a>
      </div>
      <div data-aos="fade-left" className="sm:w-1/2 relative mt-10 sm:mt-0">
        <div style={{ background: '#23BDEE' }} className="floating w-24 h-24 absolute rounded-lg z-0 -top-3 -left-3"></div>
        <img className="rounded-xl z-40 relative" src="img/teacher-explaining.png" alt="" />
        <button className="bg-white w-14 h-14 rounded-full flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none transform transition hover:scale-110 duration-300 ease-in-out z-50">
          <svg className="w-5 h-5 ml-1" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.5751 12.8097C23.2212 13.1983 23.2212 14.135 22.5751 14.5236L1.51538 27.1891C0.848878 27.5899 5.91205e-07 27.1099 6.25202e-07 26.3321L1.73245e-06 1.00123C1.76645e-06 0.223477 0.848877 -0.256572 1.51538 0.14427L22.5751 12.8097Z" fill="#23BDEE" />
          </svg>
        </button>
        <div className="bg-yellow-500 w-40 h-40 floating absolute rounded-lg z-10 -bottom-3 -right-3"></div>
      </div>
    </div>
    </div>
  )
}
