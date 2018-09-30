
let socketUrl = window.location.host || 'http://localhost:3000';
if(process.env.NODE_ENV == 'development'){
  socketUrl = 'http://localhost:3000'
}else if(process.env.NODE_ENV == 'production'){
  socketUrl = 'http://39.106.63.9:80'
}

export {
  socketUrl
}
