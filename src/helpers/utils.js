import "react-datepicker/dist/react-datepicker.css"
import colorLib from '@kurkle/color';
import i18n from './i18n'

export const colors =  ['#003f5c', '#7a5195', '#bc5090', '#ef5675', '#ff764a', '#ffa600','#9ceb01']

export const formatDate = (date, flags = '') => {

  if (!date) return date;

	const dateArr = date.split(' ')[0].split('-');

  if (flags.includes('noyear')){
    return `${dateArr[2]}/${dateArr[1]}`; 
  }else if (flags.includes('time')){
    return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]} ${dateArr[3]}`;
  } else {
    return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
  }

}


export const formatDate2 = (sourceDate, options = '') => {

  const dateArr = sourceDate.split(' ');
  const date = dateArr[0].split('-');
  const time = dateArr[1];

  const timeArr = time.split(':');

  const hours = timeArr[0];
  const minutes = timeArr[1];

  return `${date[2]}/${date[1]}/${date[0]} ${hours}:${minutes}`;
}

export const formatDateWithSeconds = (sourceDate, options = '') => {

  const dateArr = sourceDate.split(' ');
  const date = dateArr[0].split('-');
  const time = dateArr[1];

  const timeArr = time.split(':');

  const hours = timeArr[0];
  const minutes = timeArr[1];
  const seconds = timeArr[2];

  return `${date[2]}/${date[1]}/${date[0]} ${hours}:${minutes}:${seconds}`;
}


export function getCurrentDateNDaysBefore(separator='',daysBefore){

  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - daysBefore);
  let date = yesterday.getDate();
  let month = yesterday.getMonth() + 1;
  let year = yesterday.getFullYear();
  
  return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date<10?`0${date}`:`${date}`}`
}

export const round = (number,decimals=1) => {

  if (!number) return number;

  return (+(Math.round(number + "e+" + decimals) + "e-" + decimals )).toFixed(decimals);

}

export const formatNumber = (number) => {

  if (!number) return number
  number = '' + number
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

}

export const transparentize = (value, opacity) => {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
}

export const getDateLabel = (dateValue,from,to,t) => {

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
    default : return `{${dateValue}}`;
  }

}