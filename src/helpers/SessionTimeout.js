import React, {
    useEffect,
    useCallback,
    useRef,
    Fragment,
  } from 'react';
import moment from 'moment';
import {setCookie,getCookie} from './sessionCookie.js'
  
const SessionTimeout =()=> {

    
    // const [second, setSecond] = useState(0);

    const authenticated = getCookie('name')!==false && getCookie('name')!=='';

    let timeStamp;
    let userInactiveInterval = useRef();
    let startTimerInterval = useRef();
    

    // start inactive check
    let timeChecker = useCallback(() => {
        startTimerInterval.current = setTimeout(() => {
            let storedTimeStamp = getCookie('lastTimeStamp'); //sessionStorage.getItem('lastTimeStamp');
            userInactive(storedTimeStamp);
        }, 60000);
    },[]);

    // inactive timer
    let userInactive = (timeString) => {
        clearTimeout(startTimerInterval.current);
    
        userInactiveInterval.current = setInterval(() => {
        const maxTime = 540; // Maximum ideal time given before logout 
        // const popTime = 1; // remaining time (notification) left to logout.
    
        const diff = moment.duration(moment().diff(moment(timeString)));
        const minPast = diff.minutes();
        // const leftSecond = 60 - diff.seconds();
    
        // if (minPast === popTime) {
        //     setSecond(leftSecond);
        // }
    
        if (minPast === maxTime) {
            clearInterval(userInactiveInterval.current);
            setCookie('lastTimeStamp', '');
            setCookie('name', '');
            window.location.reload();
        }
        }, 1000);
    };

    // reset interval timer
    let resetTimer = useCallback(() => {
        clearTimeout(startTimerInterval.current);
        clearInterval(userInactiveInterval.current);
    
        if (authenticated) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            timeStamp = moment();
            setCookie('lastTimeStamp', timeStamp);
        } else {
            clearInterval(userInactiveInterval.current);
            setCookie('lastTimeStamp', '');
        }
        timeChecker();
    }, [authenticated]);
    
    
    useEffect(() => {
        const events = ['click', 'load', 'scroll'];
        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });
    
        timeChecker();
    
        return () => {
            clearTimeout(startTimerInterval.current);
        };
    }, [resetTimer, timeChecker]);


    return <Fragment />;
};

export default SessionTimeout;