"use client"
import React from 'react'
import Projects from '../pages/Projects'
import Layout from '../component/Layout'
import Header from '../component/Header.jsx';


const page = () => {
  return (
    <div>
      <Layout showHeader={true}>
        <Projects/>
      </Layout>
      
    </div>
  )
}

export default page
