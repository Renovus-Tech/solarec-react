import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { freeSet } from '@coreui/icons'
import { getCookie } from './helpers/sessionCookie.js'
import i18n from './helpers/i18n.js'

let _nav = [
  {
    component: CNavGroup,
    name: i18n.t('Energy'),
    to: '/base',
    icon: <CIcon icon={freeSet.cilLightbulb} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: i18n.t('Overview'),
        to: '/modules/energy/overview',
      },
      {
        component: CNavItem,
        name: i18n.t('Trends'),
        to: '/modules/energy/trends',
      },
      {
        component: CNavItem,
        name: i18n.t('Performance'),
        to: '/modules/energy/performance',
      },
    ],
  },
  {
    component: CNavGroup,
    name: i18n.t('Revenue'),
    icon: <CIcon icon={freeSet.cilDollar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: i18n.t('Certificates and Offsets'),
        to: '/modules/revenue/certificates-and-offsets',
      },
      {
        component: CNavItem,
        name: i18n.t('Sales'),
        to: '/modules/revenue/sales',
      },
    ],
  },
]

// const functionalities = JSON.parse(getCookie('functionalities'));

// const filteredNav = [];
// _nav.forEach(level1 => {
//   if(level1._children && level1._children.length > 0) {
//     const retChildren = []; 
//     level1._children.forEach(level2 => {
//       if(level2._children && level2._children.length > 0) {
//         const retChildren2 = []; 
//         level2._children.forEach(level3 => {
//           if(functionalities.indexOf(level3.to) > -1){
//             retChildren2.push(level3);
//           }
//         });
//         level2._children = retChildren2;
//         retChildren.push(level2);
//       } else {
//         if(functionalities.indexOf(level2.to) > -1){
//           retChildren.push(level2);
//         }
//       }
//     });
//     level1._children = retChildren;
//     filteredNav.push(level1);
//   } else {
//     if(functionalities.indexOf(level1.to) > -1){
//       filteredNav.push(level1)
//     }
//   }
// })

const filteredNav = _nav

export default filteredNav

