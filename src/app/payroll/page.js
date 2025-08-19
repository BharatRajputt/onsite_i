import React from 'react'
import Layout from '../component/Layout'
import Payroll from '../pages/Payroll'

const page = () => {
  return (
    <div>

        <Layout showHeader={false}>
<Payroll/>
        </Layout>
      
    </div>
  )
}

export default page
