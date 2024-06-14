import React from 'react'

export const Jobs = ({result}) => {
  return (
    <>
      <div>
       {/* <h3 className=" text-lg font-bold mb-2">{result.length}</h3> */}
      </div>
      <section className='card-container'>{result}</section>
    </>    
  )
}