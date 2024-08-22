import React from 'react';

export default function Messaging() {
  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center md:space-x-10">
          <div data-aos="fade-right" className="md:w-7/12 mb-8 md:mb-0">
            <img
              style={{ borderRadius: "20px" }}
              className="w-full"
              src="./img/msgs.png"
              alt="Messaging"
            />
          </div>
          <div data-aos="fade-left" className="md:w-5/12 md:transform md:-translate-y-6">
            <h1 className="font-semibold text-darken text-2xl sm:text-3xl lg:text-4xl mb-4 lg:pr-12">
              One-on-One <span className="text-teal-500">Discussions</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg lg:pr-12">
              Companies and students can communicate privately through our in-app messaging feature,
              ensuring smooth and clear conversations between both parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

