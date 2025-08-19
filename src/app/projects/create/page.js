
"use client"

import Layout from '@/app/component/Layout'
import CreateProject from '@/app/pages/CreateProject'
import React from 'react'

const page = () => {
  return (
    <div>
        <Layout showHeader = {false} >
      <CreateProject/>
        </Layout>
    </div>
  )
}

export default page
