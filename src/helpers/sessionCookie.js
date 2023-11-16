import Cookies from "js-cookie";

export const setCookie = (name, value) => {
  Cookies.remove(name);
  Cookies.set(name, value, { expires: 14 });
};

export const getCookie = (name) => {
  
  const sessionCookie = Cookies.get(name);

  if (sessionCookie === undefined) {
    return false;
  } else {
    return sessionCookie;
  }
};