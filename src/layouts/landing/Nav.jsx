import React from 'react'
import { useNavigate } from 'react-router-dom'


export default function Nav() {
    
  return (
    <header>
        <nav className="navbar bg-cream">
            <div>
                <a href="#" className=" relative z-50"><img height="10px" width="200px" src="./img/logo-removebg-preview (1).png"/></a>
            </div>
            <ul className="nav-list">
                <li><a href="">Home</a></li>
                <li><a href="">About Us</a></li>
                <li><a href="">Teanagers</a></li>
                <li><a href="">Companies</a></li>
                
                <a href="/auth/sign-in">Sign in</a>
                <a href="/auth/sign-up">Sign Up</a>
                {/* <button className="login">
                    <a href="/auth/sign-up" />Sign Up</button> */}
            </ul>
            <div className="hamburger">
                <div className="line line-1"></div>
                <div className="line line-2"></div>
                <div className="line lin2-3"></div>
            </div>
        </nav>
    </header>
  )
}
