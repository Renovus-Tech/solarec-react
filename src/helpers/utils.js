import "react-datepicker/dist/react-datepicker.css"
import colorLib from '@kurkle/color';
import i18n from './i18n'

export const colors =  ['#003f5c', '#7a5195', '#bc5090', '#ef5675', '#ff764a', '#ffa600','#9ceb01']
export const months =  ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export const formatDate = (date, flags = '') => {

  if (!date) return date;

	const dateTimeArr = date.split(' ')
  const dateArr = dateTimeArr[0].split('-')

  if (flags.includes('noyear')){
    return `${dateArr[2]}/${dateArr[1]}`; 
  }else if (flags.includes('time')){
    return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]} ${dateTimeArr[1]}`;
  } else {
    return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
  }
}

export const round = (number,decimals=1) => {
  if (!number) return number;
  return (+(Math.round(number + "e+" + decimals) + "e-" + decimals )).toFixed(decimals)
}

export const formatNumber = (number) => {
  if (!number) return number
  number = '' + number
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const transparentize = (value, opacity) => {
  if (!value) return value
  var alpha = opacity === undefined ? 0.5 : 1 - opacity
  return colorLib(value).alpha(alpha).rgbString()
}

export const getDateLabel = (dateValue,from,to,t) => {
  if (!dateValue) return dateValue
  if (dateValue.includes('cy-')) {
    return ((new Date()).getFullYear() - dateValue.split('-')[1]) + ''
  } else {
    switch(dateValue) {
      case 'y' : return i18n.t('Yesterday');
      case '30d' : return '30 '+i18n.t('days');
      case '12w' : return '12 '+i18n.t('weeks'); 
      case '12m' : return '12 '+i18n.t('month');
      case 'cy' : return i18n.t('Current year');
      case 'cm' : return i18n.t('Current month');
      case 'cw' : return i18n.t('Current week');
      case 'x' : return i18n.t('Custom range');
      case 'xx' : return from+' - '+to;
      default : return dateValue;
    }
  }

}