import React from 'react'

const ProgressBar = ({progress}: {progress: number}) => {
  return (
    <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
        <div
            className='bg-background h-2 rounded-full transition-all duration-300'
            style={{ width: `${progress}%` }}
        />
    </div>
  )
}

export default ProgressBar;