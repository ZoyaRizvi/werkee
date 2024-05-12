import React from 'react'
import Nav from './Nav';
import AboutWerky from './AboutWerky';
import Banner from './Banner';
import Counselling from './Counselling';
import Footer from './Footer';
import SkillAssessment from './SkillAssessment';
import Talent from './Talent';
import TrustedBy from './TrustedBy';
import Whyteens from './Whyteens';
import Messaging from './Messaging';

export default function landing() {
  return (
    <div>
      <Nav/>
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
