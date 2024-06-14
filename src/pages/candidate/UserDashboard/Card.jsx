import React from 'react'
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';

const Card = ({data}) => {
    const {companyName, jobTitle, companyLogo,  Requirements, minPrice, maxPrice, salaryType, jobLocation, 
    postingDate,employmentType, experienceLevel, description} = data;

  return (
    <section className='card' style={{'paddingTop': '20px'}}>
        <Link to={"/"}c className=' flex gap-4 flex-col sm:flex-row items-start'>
            <img src={`${companyLogo}`} alt="" />
            <div>
                <h3 className=' text-lg mb-2 font-semibold'>{jobTitle}</h3>
                <h4 className=' text-primary mb-1'>{companyName}</h4>
                 <h4 className=' text-base text-primary/70 pb-2'>{Requirements}</h4>
                <div className=' text-primary/70 text-base flex flex-wrap gap-2 mb-2'>
                    <span className=' flex items-center gap-2'><FiMapPin/>{jobLocation}</span>
                    <span className=' flex items-center gap-2'><FiClock/>{employmentType}</span>
                    <span className=' flex items-center gap-2'><FiDollarSign/>{minPrice}-{maxPrice}</span>
                    <span className=' flex items-center gap-2'><FiCalendar/>{postingDate}</span>
                </div>

                <p className=' text-base text-primary/70'>{description}</p>
            </div>
        </Link>
    </section>
  )
}

export default Card;

