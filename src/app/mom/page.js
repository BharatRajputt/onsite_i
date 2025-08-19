import React from 'react'
import Layout from '../component/Layout'
import Mom from '../pages/Mom'

const page = () => {
  return (
    <div>
      <Layout showHeader={true}>
        <Mom/>
      </Layout>
    </div>
  )
}

export default page
