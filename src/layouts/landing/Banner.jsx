import React from 'react';
import { Link } from 'react-router-dom';

export default function Banner() {
  return (
    <div className="antialiased">
      <div className="bg-[#FFF2E1]">
        <div className="max-w-screen-xl px-8 mx-auto flex flex-col lg:flex-row items-start">
          <div className="flex flex-col w-full lg:w-6/12 justify-center lg:pt-24 items-center lg:items-start text-center lg:text-left mb-5 md:mb-0">
            <h1 data-aos="fade-right" data-aos-once="true" className="my-4 text-3xl md:text-5xl font-bold leading-tight text-darken">
              <span className="text-teal-500">Earn</span> your
              first income
            </h1>
            <p data-aos="fade-down" data-aos-once="true" data-aos-delay="300" className="leading-normal text-lg md:text-2xl mb-8">
            Real projects, real earnings—smart opportunities for the smart generation
            </p>
            <br></br>
            <div data-aos="fade-up" data-aos-once="true" data-aos-delay="700" className="w-full flex flex-col md:flex-row items-center justify-center lg:justify-start space-y-4 md:space-y-0 md:space-x-5">
              <Link to="/auth/sign-up">
                <button className="bg-teal-500 text-white text-lg md:text-xl font-bold rounded-full py-3 md:py-4 px-6 md:px-9 focus:outline-none transform transition hover:scale-110 duration-300 ease-in-out">
                  Get Started
                </button>
              </Link>
              <div className="flex items-center justify-center space-x-3 mt-5 md:mt-0">
                <Link to="/how-it-works">
                  <button className="bg-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.5751 12.8097C23.2212 13.1983 23.2212 14.135 22.5751 14.5236L1.51538 27.1891C0.848878 27.5899 5.91205e-07 27.1099 6.25202e-07 26.3321L1.73245e-06 1.00123C1.76645e-06 0.223477 0.848877 -0.256572 1.51538 0.14427L22.5751 12.8097Z" fill="#23BDEE"/>
                    </svg>
                  </button>
                </Link>
                <span className="cursor-pointer text-sm md:text-base">Watch how it works</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-4/12 relative mt-8 lg:mt-0" id="girl">
            <img data-aos="fade-up" data-aos-once="true" className="w-full h-auto mx-auto" src="/img/girl.png" alt="Girl"/>
            
            <div data-aos="fade-up" data-aos-delay="300" data-aos-once="true" className="absolute top-16 -left-16 sm:top-24 sm:-left-12 md:top-32 md:-left-16 lg:-left-8 lg:top-48 floating-4">
                <img height={'400px'} className="bg-opacity-80 rounded-lg h-32 sm:h-24" src='/img/bot.png' alt="Bot"/>
            </div>

          
            <div data-aos="fade-up" data-aos-delay="400" data-aos-once="true" className="absolute top-20 right-10 sm:right-16 sm:top-24 md:top-32 md:right-24 lg:top-3 lg:right-1 floating">
              <img className="h-12 sm:h-16 md:h-20" src='/img/like.png' alt="Like"/>
            </div>

            <div data-aos="fade-up" data-aos-delay="500" data-aos-once="true" className="absolute bottom-14 sm:-left-6 sm:bottom-16 lg:bottom-24 lg:-left-16 floating">
                <img className="bg-opacity-80 rounded-lg h-20 sm:h-24" src="/img/cat-laptop.png" alt="Cat Laptop"/>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="600" data-aos-once="true" className="absolute bottom-20 md:bottom-32 lg:bottom-38 lg:-right-12 floating-4">
  <img className="bg-opacity-80 rounded-lg h-16 sm:h-20" src="/img/bot2.png" alt="Bot 2"/>
</div>

          </div>
        </div>
        <div className="text-white -mt-14 sm:-mt-24 lg:-mt-36 z-40 relative">
          <svg className="xl:h-40 xl:w-full" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" fill="currentColor"></path>
          </svg>
          <div className="bg-white w-full h-20 -mt-px"></div>
        </div>
      </div>
    </div>
  );
}
