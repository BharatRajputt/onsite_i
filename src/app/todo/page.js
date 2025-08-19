import React from 'react'
import Todo from '../pages/Todo'
import Layout from '../component/Layout'

const page = () => {
  return (
    <div>
      <Layout showHeader={true}>
 <Todo/>
      </Layout>
     
    </div>
  )
}

export default page
