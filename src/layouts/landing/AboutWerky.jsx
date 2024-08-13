import React from 'react'

export default function AboutWerky() {
  return (
    <div>
            <div id='about' className="mt-28">
      <div data-aos="flip-down" className="text-center max-w-screen-md mx-auto">
        <h1 className="text-3xl font-bold mb-4">What <span className="text-teal-500">WERKY </span> is about?</h1>
        <p className="text-gray-500">
          At WERKY, we're revolutionizing the way individuals explore,
          showcase, and advance their careers. Our comprehensive career platform empowers students, professionals,
          small businesses, and startups to connect,
          collaborate, and succeed in today's dynamic job market.
        </p>
      </div>
      <div data-aos="fade-up" className="flex flex-col md:flex-row justify-center items-center space-y-5 md:space-y-0 md:space-x-6 lg:space-x-10 mt-7">
        <div className="relative md:w-5/12">
          <img className="rounded-2xl" src="img/Rectangle 19.png" alt="" />
          <div className="absolute bg-black bg-opacity-20 bottom-0 left-0 right-0 w-full h-full rounded-2xl">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h1 className="uppercase text-white font-bold text-center text-sm lg:text-xl mb-3">FOR COMPANIES</h1>
              <a  href='/form' className="rounded-full text-white border text-xs lg:text-md px-6 py-3 w-full font-medium focus:outline-none transform transition hover:scale-110 duration-300 ease-in-out">Hire Now</a>
            </div>
          </div>
        </div>
        <div className="relative md:w-5/12">
          <img className="rounded-2xl" src="img/Rectangle 21.png" alt="" />
          <div className="absolute bg-black bg-opacity-20 bottom-0 left-0 right-0 w-full h-full rounded-2xl">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h1 className="uppercase text-white font-bold text-center text-sm lg:text-xl mb-3">FOR STUDENTS</h1>
              <button className="rounded-full text-white text-xs lg:text-md px-6 py-3 w-full font-medium focus:outline-none transform transition hover:scale-110 duration-300 ease-in-out" style={{ background: "rgba(35, 189, 238, 0.9)" }}>Get Your First Job</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
