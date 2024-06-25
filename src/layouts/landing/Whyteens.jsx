import React from 'react'

export default function Whyteens() {
  return (
    <div>
		<div data-aos="flip-up" className="max-w-xl mx-auto text-center mt-24">
    <h1 className="font-bold text-darken my-3 text-2xl">Why work <span className="text-teal-500">in your Teens</span></h1>
    <p className="leading-relaxed text-gray-500">
        Warren Buffet, Bill Gates, Steve Jobs, all started working in their Teens, do you need a better reason?
    </p>
</div>

<div  className="grid md:grid-cols-4 gap-14 md:gap-5 mt-20 container mx-auto flex justify-center items-center mt-24">
    <div data-aos="fade-up" className="bg-white shadow-xl p-6 text-center rounded-xl" >
        <div style={{backgroundColor:'teal'}} className="rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg transform -translate-y-12">
        
        </div>
        <h1  className="font-medium text-xl lg:px-4 text-darken">First Income</h1>
        <p className="px-4 py-2 text-gray-500">
            Work with real companies and Earn money
        </p>
    </div>
	<div data-aos="fade-up" data-aos-delay="150" className="bg-white shadow-xl p-6 text-center rounded-xl" >
    <div style={{backgroundColor:'teal'}} className="rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg transform -translate-y-12">
        <svg className="w-8 h-8 text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG path data */}
        </svg>
    </div>
    <h1 className="font-medium text-xl lg:px-14 text-darken">Passion</h1>
    <p className="px-4 py-3 text-gray-500">
        Make your passion as your profession
    </p>
</div>

<div data-aos="fade-up" data-aos-delay="300" className="bg-white shadow-xl p-6 text-center rounded-xl">
    <div style={{backgroundColor:'teal'}} className="rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg transform -translate-y-12">
        <svg className="w-6 h-6 text-white" viewBox="0 0 55 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG path data */}
        </svg>
    </div>
    <h1 className="font-medium text-xl lg:px-14 text-darken lg:h-14 ">Learning</h1>
    <p className="px-4  text-gray-500">
        Experiential Learning by working on real projects
    </p>
</div>

<div data-aos="fade-up" data-aos-delay="150" className="bg-white shadow-xl p-6 text-center rounded-xl" >
    <div style={{backgroundColor:'teal'}} className="rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg transform -translate-y-12">
        <svg className="w-6 h-6 text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG path data */}
        </svg>
    </div>
    <h1 className="font-medium text-xl mb-3 lg:px-14 text-darken">Certifications</h1>
    <p className="px-4 text-gray-500">
        Build your profile by getting experience certificates
    </p>
</div>

    {/* Add similar divs for other items */}
</div>
    </div>
  )
}
