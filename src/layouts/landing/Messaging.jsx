import React from 'react'

export default function Messaging() {
  return (
    <div>
        <div className="mt-24 flex flex-col-reverse md:flex-row items-center md:space-x-10 mx-auto max-w-screen-lg">
			<div data-aos="fade-right" className="md:w-7/12">
				<img style={{borderRadius:"20px"}} className="md:w-11/12" src="./img/msgs.png"/>
			</div>
			<div data-aos="fade-left" className="md:w-5/12 md:transform md:-translate-y-6">
				<h1 className="font-semibold text-darken text-3xl lg:pr-64">One-on-One <span className="text-teal-500">Discussions</span></h1>
				<p className="text-gray-500 my-5 lg:pr-24">Companies and Students can communicate privately through our In App Messaging feature
                so there will be smooth and clear conversation between both</p>
			</div>
		</div>
    </div>
  )
}
