import React from 'react'
import Inputfield from './Inputfield'
// import Inputfield from '../Component/Inputfield'

const Location = ({handleChange}) => {
  return (
    <div >
        <h4 className=' text-lg mb-2 font-medium'>Location</h4>
        <div>
            <label className='sidebar-label-container'>
                <input type='radio' name='test' id='test' value="" onChange={handleChange}></input>
                <span className='checkmark'></span>ALL
            </label>

            <Inputfield handleChange={handleChange} 
            value="Karachi" 
            title="Karachi" 
            name="test"
            />
            <Inputfield handleChange={handleChange} 
            value="Lahore" 
            title="Lahore" 
            name="test"
            />
            <Inputfield handleChange={handleChange} 
            value="Islamabad" 
            title="Islamabad" 
            name="test"
            />
            <Inputfield handleChange={handleChange} 
            value="Faislabad" 
            title="Faislabad" 
            name="test"
            />

        </div>
    </div>
  )
}

export default Location