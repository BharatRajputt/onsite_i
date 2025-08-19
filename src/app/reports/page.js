"use client"

import React from 'react'
import Layout from '../component/Layout'
import Reports from '../pages/reports'
const page = () => {
  return (
    <div>
      <Layout showHeader={true}>
        <Reports/>
      </Layout>
    </div>
  )
}

export default page
