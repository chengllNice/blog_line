
export const isIE = () => {
  let isIEOff = false;

  if (!!window.ActiveXObject || "ActiveXObject" in window){
    isIEOff = true;
  }
  if(navigator.userAgent.indexOf("Edge") > -1){
    isIEOff = true;
  }
  return isIEOff;
};

export const isPC = () => {
  let userAgentInfo = navigator.userAgent;
  let Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  let flag = true;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
};
