import React from 'react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import {getCookie} from '../helpers/sessionCookie.js'
import i18n from '../helpers/i18n.js'

let _nav =  [
  {
    _tag: 'CSidebarNavDropdown',
    name: i18n.t('Energy'),
    icon: <CIcon content={freeSet.cilLightbulb} customClasses="c-sidebar-nav-icon"/>,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: i18n.t('Overview'),
        to: '/modules/energy/overview',
        // icon: <CIcon content={freeSet.cilChartPie} customClasses="c-sidebar-nav-icon"/>
      },
      {
        _tag: 'CSidebarNavItem',
        name: i18n.t('Trends'),
        to: '/modules/energy/trends',
        // icon: <CIcon content={freeSet.cilCloudy} customClasses="c-sidebar-nav-icon"/>
      },
      {
        _tag: 'CSidebarNavItem',
        name: i18n.t('Performance'),
        to: '/modules/energy/performance',
        // icon: <CIcon content={freeSet.cilCloudy} customClasses="c-sidebar-nav-icon"/>
      },
    ]
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: i18n.t('Revenue'),
    icon: <CIcon content={freeSet.cilDollar} customClasses="c-sidebar-nav-icon"/>,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: i18n.t('Certificates and Offsets'),
        to: '/modules/revenue/certificates-and-offsets',
        // icon: <CIcon content={freeSet.cilChartLine} customClasses="c-sidebar-nav-icon"/>
      },
      {
        _tag: 'CSidebarNavItem',
        name: i18n.t('Sales'),
        to: '/modules/revenue/sales',
        // icon: 'cil-graph',
      },
    ]
  },
]

const functionalities = JSON.parse(getCookie('functionalities'));

const filteredNav = [];
_nav.forEach(level1 => {
  if(level1._children && level1._children.length > 0) {
    const retChildren = []; 
    level1._children.forEach(level2 => {
      if(level2._children && level2._children.length > 0) {
        const retChildren2 = []; 
        level2._children.forEach(level3 => {
          if(functionalities.indexOf(level3.to) > -1){
            retChildren2.push(level3);
          }
        });
        level2._children = retChildren2;
        retChildren.push(level2);
      } else {
        if(functionalities.indexOf(level2.to) > -1){
          retChildren.push(level2);
        }
      }
    });
    level1._children = retChildren;
    filteredNav.push(level1);
  } else {
    if(functionalities.indexOf(level1.to) > -1){
      filteredNav.push(level1);
    }
  }
});

// const filteredNav = _nav


export default filteredNav
