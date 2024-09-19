const jwt = require('jsonwebtoken');
const jwtPassword = 'secret';

function verifyJwt(token) {

  try{
   const verified =  jwt.verify(token, jwtPassword);
       return true;
  }
  catch(e){
   return false;
  }
}

const ans = verifyJwt("eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpc2hhbEBnbWFpbC5jb20iLCJpYXQiOjE3MjY3MzAxODh9.j7LJtoSwj1XmFmAp4AUB8SXLszN5ax7mGNvDaLM8D1c");
console.log("verified : ", ans);

