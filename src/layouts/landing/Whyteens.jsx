import React from 'react'
import { 
    CurrencyDollarIcon,
    FireIcon,
    AcademicCapIcon,
    TrophyIcon,
 } from "@heroicons/react/24/outline";
 
export default function Whyteens() {
  return (
    <div id='whyteens'>
        <div data-aos="flip-up" className="max-w-xl mx-auto text-center mt-24">
            <h1 className="font-bold text-darken my-3 text-2xl">
                Why work <span className="text-teal-500">in your Teens</span>
            </h1>
            <p className="leading-relaxed text-gray-500">
                Warren Buffet, Bill Gates, Steve Jobs, all started working in their Teens. Do you need a better reason?
            </p>
        </div>

        <div className="grid md:grid-cols-4 gap-14 md:gap-5 mt-20 container mx-auto justify-center items-center">
            <div data-aos="fade-up" className="shadow-xl p-6 text-center rounded-xl bg-white">
                <div className="bg-[#FFF2E1] rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg transform -translate-y-12">
                    <CurrencyDollarIcon className="w-8 h-8 text-teal-500" />
                </div>
                <h1 className="font-medium text-xl text-darken mt-4">First Income</h1>
                <p className="px-4 py-2 text-gray-500">
                    Work with real companies and earn money.
                </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="150" className="shadow-xl p-6 text-center rounded-xl bg-white">
                <div className="bg-[#FFF2E1] rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg transform -translate-y-12">
                    <FireIcon className="w-8 h-8 text-teal-500" />
                </div>
                <h1 className="font-medium text-xl text-darken mt-4">Passion</h1>
                <p className="px-4 py-2 text-gray-500">
                    Make your passion your profession.
                </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="300" className="shadow-xl p-6 text-center rounded-xl bg-white">
                <div className="bg-[#FFF2E1] rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg transform -translate-y-12">
                    <AcademicCapIcon className="w-8 h-8 text-teal-500" />
                </div>
                <h1 className="font-medium text-xl text-darken mt-4">Learning</h1>
                <p className="px-4 py-2 text-gray-500">
                    Experiential learning by working on real projects.
                </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="450" className="shadow-xl p-6 text-center rounded-xl bg-white">
                <div className="bg-[#FFF2E1] rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg transform -translate-y-12">
                    <TrophyIcon className="w-8 h-8 text-teal-500" />
                </div>
                <h1 className="font-medium text-xl text-darken mt-4">Achievement</h1>
                <p className="px-4 py-2 text-gray-500">
                    Build your profile by upgrading your skills.
                </p>
            </div>
        </div>
    </div>
  )
}
