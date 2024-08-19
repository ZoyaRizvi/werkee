import React, { useState } from 'react';

function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full text-gray-700 bg-[#FFF2E1]">
            <div className="flex flex-col max-w-screen-xl px-8 mx-auto md:items-center md:justify-between md:flex-row">
                <div className="flex flex-row items-center justify-between py-4 md:py-8">
                    <div className="relative">
                        <a href="#" className="text-lg font-bold tracking-widest text-gray-900 rounded-lg focus:outline-none focus:shadow-outline">
                            <img width="200" height="100" src='./img/logo.png' alt="Logo" />
                        </a>
                    </div>
                    <button
                        className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
                        onClick={() => setOpen(!open)}
                    >
                        <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                            <path
                                style={{ display: !open ? 'block' : 'none' }}
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            ></path>
                            <path
                                style={{ display: open ? 'block' : 'none' }}
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div>
                <nav
                    className={`md:flex md:items-center md:justify-end md:flex-row flex flex-col pb-4 md:pb-0 md:scale-100 transform duration-300 ${open ? 'scale-100' : 'scale-y-0'}`}
                >
                    <a
                        className="px-4 py-2 text-sm bg-transparent rounded-lg md:mt-0 mt-2 md:ml-4 hover:text-gray-900 focus:outline-none focus:shadow-outline"
                        href="#"
                    >
                        Home
                    </a>
                    <a
                        className="px-4 py-2 text-sm bg-transparent rounded-lg md:mt-0 mt-2 md:ml-4 hover:text-gray-900 focus:outline-none focus:shadow-outline"
                        href="#about"
                    >
                        About Us
                    </a>
                    <a
                        className="px-4 py-2 text-sm bg-transparent rounded-lg md:mt-0 mt-2 md:ml-4 hover:text-gray-900 focus:outline-none focus:shadow-outline"
                        href="#whyteens"
                    >
                        Why Teens
                    </a>
                    <a
                        className="px-4 py-2 text-sm bg-transparent rounded-lg md:mt-0 mt-2 md:ml-4 hover:text-gray-900 focus:outline-none focus:shadow-outline"
                        href="#whatsnew"
                    >
                        What's new
                    </a>
                    <a
                        className="px-10 py-3 text-sm text-center bg-white text-gray-800 rounded-full md:mt-0 mt-2 md:ml-4"
                        href="/auth/sign-in"
                    >
                        Login
                    </a>
                    <a
                        className="px-10 py-3 text-sm text-center bg-teal-500 text-white rounded-full md:mt-0 mt-2 md:ml-4"
                        href="/auth/sign-up"
                    >
                        Sign Up
                    </a>
                </nav>
            </div>
        </div>
    );
}

export default Navbar;

