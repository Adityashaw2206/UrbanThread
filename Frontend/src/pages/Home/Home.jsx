import React from 'react'
import Hero from '../../components/Hero.jsx'
import LatestCollections from '../../components/LatestCollections.jsx'
import BestSeller from '../../components/BestSeller.jsx'
import OurPolicy from '../../components/OurPolicy.jsx'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollections />
      <BestSeller />
      <OurPolicy />
    </div>
  )
}

export default Home
