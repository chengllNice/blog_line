
let socketUrl = '';
let host = window.location.host || 'http://localhost:3000';
if(process.env.NODE_ENV == 'development'){
  socketUrl = host
}else if(process.env.NODE_ENV == 'production'){
  socketUrl = host
}

export {
  socketUrl
}
