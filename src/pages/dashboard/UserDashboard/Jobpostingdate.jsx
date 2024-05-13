import React from 'react'
import Inputfield from './Inputfield';
//import Inputfield from '../Component/Inputfield';

const Jobpostingdate = ({handleChange}) => {
    const now = new Date();
    console.log(now)
    const twentyFourHoursAgo = new Date( now - 24 * 60 * 60 * 10000);
    const SevenDaysAgo = new Date( now - 7 * 24 * 60 * 60 * 10000);
    const ThirtyDaysAgo = new Date( now - 30 * 24 * 60 * 60 * 10000);
    //console.log(twentyFourHoursAgo)
    
    // convert date to string
    const twentyFourHoursAgoDate = twentyFourHoursAgo.toISOString().slice(0, 10);
    const sevenDaysAgoDate = SevenDaysAgo.toISOString().slice(0, 10);
    const ThirtyDaysAgoDate = ThirtyDaysAgo.toISOString().slice(0, 10);
    //console.log(twentyFourHoursAgo)




  return (
    <div >
    <h4 className=' text-lg mb-2 font-medium'>Date of Posting</h4>
    <div>
        <label className='sidebar-label-container'>
            <input type='radio' name='test' id='test' value="" onChange={handleChange}></input>
            <span className='checkmark'></span>ALL
        </label>

        <Inputfield handleChange={handleChange} 
        value={twentyFourHoursAgoDate} 
        title="Last 24 Hours" 
        name="test"
        />
        <Inputfield handleChange={handleChange} 
        value={sevenDaysAgoDate} 
        title="Last 7 days" 
        name="test"
        />
        <Inputfield handleChange={handleChange} 
        value={ThirtyDaysAgoDate} 
        title=" Last Thirty Days" 
        name="test"
        />

    </div>
</div>
  )
}

export default Jobpostingdate