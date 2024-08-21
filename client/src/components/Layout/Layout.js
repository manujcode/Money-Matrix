import React from 'react'
import Header from './Header'
import Footer from './Footer'
import "../../index.css";
const Layout = ({children}) => {
    return (
        <>
           <Header />
           <div className='app-container'>
           <div className='content container mt-4 content-wrap'>
               {children}
           </div>
           <Footer />
           </div>
        </>
    )
}
export default Layout;