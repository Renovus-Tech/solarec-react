import React, { useState, useEffect } from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'
import {getCookie} from '../helpers/sessionCookie.js'
import { useLocation } from "react-router-dom";


const TheLayout = () => {

  const location = useLocation()
  // const parkType = location.pathname == '/modules/solar-battery'? 'solar' : getCookie('parkType')
  const parkType = getCookie('parkType')

  return (
    <div className={"c-app solar c-default-layout "+parkType}>
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent/>
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default TheLayout
