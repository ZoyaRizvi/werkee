import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Banner />
          <Whyteens />
          <AboutWerky />
          <Counselling />
          <Talent />
          <SkillAssessment />
          <Messaging />
        </Route>
        <Route path="#about">
          <AboutWerky />
        </Route>
        <Route path="#whyteens">
          <Whyteens/>
        </Route>
        <Route path="#whatsnew">
         <Counselling/>
        </Route>
        {/* Add more routes as needed */}
      </Switch>
      <Footer />
    </Router>
  );
}

