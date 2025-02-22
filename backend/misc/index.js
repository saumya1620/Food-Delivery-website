const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'ABC@123';

function genPasswordHash(password)
{
    const genSalt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, genSalt);
    return hash;
}
function validatePasswordHash(password, hash)
{
    return bcrypt.compareSync(password, hash);
}
function mapValidationError(errors)
{
    return (errors|| []).reduce((prev, curr)=>{
        prev[curr.path] = curr.msg;
        return prev;
    },{});
}
function genJwtToken(payload){
    return jwt.sign(payload, jwtSecret, {expiresIn: '1h'});
}


function verifyJwtToken(token,cb){
    jwt.verify(token, jwtSecret,cb )
}
module.exports = {genPasswordHash, mapValidationError, validatePasswordHash, genJwtToken, verifyJwtToken};