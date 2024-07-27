import React from 'react'

export default function Talent() {
  return (
    <div>
            <div className="container mx-auto max-w-screen-lg">
      <div className="md:flex mt-40 md:space-x-10 items-start">
        <div data-aos="fade-down" className="md:w-7/12 relative">
          <div style={{ background: '#33EFA0' }} className="w-32 h-32 rounded-full absolute z-0 left-4 -top-12 animate-pulse"></div>
          <div style={{ background: '#33D9EF' }} className="w-5 h-5 rounded-full absolute z-0 left-36 -top-12 animate-ping"></div>
          <img style={{ borderRadius: '20px', opacity: '0.8' }} className="relative z-50 floating" src="img/vcall.png" alt="" />
          <div style={{ background: '#5B61EB' }} className="w-36 h-36 rounded-full absolute z-0 right-16 -bottom-1 animate-pulse"></div>
          <div style={{ background: '#F56666' }} className="w-5 h-5 rounded-full absolute z-0 right-52 bottom-1 animate-ping"></div>
        </div>
        <div data-aos="fade-down" className="md:w-5/12 mt-20 md:mt-0 text-gray-500">
          <h1 className="text-2xl font-semibold text-darken lg:pr-40">Showcase Your <span className="text-teal-500"> Talent </span> and Projects</h1>
          <div className="flex items-center space-x-5 my-5">
            <p>
              Stand out from the crowd by showcasing your projects, creations, and achievements on our platform.
              Share your portfolio with potential employers, collaborators, and clients.
              With multimedia capabilities and easy-to-use tools, you can highlight your skills and attract exciting opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
