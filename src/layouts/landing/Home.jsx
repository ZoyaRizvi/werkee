import React from 'react'
import Navbar from './Nav';
import AboutWerky from './AboutWerky';
import Banner from './Banner';
import Counselling from './Counselling';
import Footer from './Footer';
import SkillAssessment from './SkillAssessment';
import Talent from './Talent';
import TrustedBy from './TrustedBy';
import Whyteens from './Whyteens';
import Messaging from './Messaging';

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Banner/>
      <TrustedBy/>
      <Whyteens/>
      <AboutWerky/>
      <Counselling/>
      <Talent/>
       <SkillAssessment/>
       <Messaging/>
      <Footer/>
    </div>
  )
}
