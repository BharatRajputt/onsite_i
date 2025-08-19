import React from 'react'
import Layout from '../component/Layout'
import Members from '../pages/Members'

const page = () => {
  return (
    <div>
      <Layout showHeader={true}>
        <Members/>
      </Layout>
    </div>
  )
}

export default page
