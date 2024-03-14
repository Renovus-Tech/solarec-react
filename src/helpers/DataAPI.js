import {setCookie} from '../helpers/sessionCookie.js'

export async function DataAPI(options = {}) {

	const {
	  endpoint = {},
    method = 'POST',
    body = {}
	} = options

   const fetchOptions = {}

  //  body.location = getCookie('location')

   const staging = (process.env.REACT_APP_API_URL === '/data')

  fetchOptions.method = staging ? 'GET' : method
  fetchOptions.headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'credentials': 'include',
    'Origin': window.location.href,
    'Access-Control-Request-Method' : staging ? 'GET' : method
  }
  fetchOptions.credentials = 'include'
  // fetchOptions.mode = 'no-cors'


// JSESSIONID

  if (body && !staging && method !== 'GET') fetchOptions.body = JSON.stringify(body)

  console.log(`Calling DataAPI to ${process.env.REACT_APP_API_URL}/${endpoint} with options:`, options)

  const APIResponse = await fetch(

    `${process.env.REACT_APP_API_URL}/${endpoint}`, fetchOptions).then(function (response) {
        if (response.status === 401) {
          setCookie('lastTimeStamp', '')
          setCookie('name', '')
          window.location.reload()
        } else {
          return response.json()
        }
      }).catch(
        er => {
          if (endpoint === 'admin/locations/current') {
            setCookie('lastTimeStamp', '')
            setCookie('name', '')
            window.location.reload()
          }
          console.log('APIError!', er, `${process.env.REACT_APP_API_URL}/${endpoint}`)
        }
      )

    console.log('fetchOptions for', endpoint, fetchOptions)
    console.log('APIResponse for', endpoint, APIResponse)

    if (APIResponse && APIResponse.chart && APIResponse.chart.resultCode===404) alert(APIResponse.chart.resultText)

    return APIResponse

  }



export default DataAPI