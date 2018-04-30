
let socketUrl = '';
if(process.env.NODE_ENV == 'development'){
  socketUrl = 'http://localhost:3000'
}else if(process.env.NODE_ENV == 'production'){
  console.log('-----')
  console.log(process.env.NODE_ENV)
  socketUrl = 'http://39.107.89.167:80'
}

export {
  socketUrl
}
