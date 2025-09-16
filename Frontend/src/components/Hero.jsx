import React from 'react'
import { assets } from '../assets/assets.js'
const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      <div className=" w-full sm:w-1/2 flex flex-col items-center justify-center py-10 sm:py-0">
        <div className=" flex items-center gap-2">
            <p className='w-8 md:w-11 h-[3px] bg-[#414141]'></p>
            <p className="md:text-base text-sm font-bold">Our Bestsellers</p>
        </div>
        <h1 className=' lora-regular text-3xl lg:text-5xl leading-relaxed'>Latest Arrival</h1>
        <div className='flex items-center gap-2'>
            <p className=" md:text-base text-sm font-bold">Shop Now</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
        </div>
      </div>
      <img className='w-full sm:w-1/2' src={assets.hero_img} alt="" />
    </div>
  )
}

export default Hero
