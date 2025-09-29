// generateHash.js (arquivo temporário)
const bcrypt = require('bcryptjs');

const senhaOriginal = '24092007'; // A sua senha
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(senhaOriginal, salt);

console.log('O seu hash de senha é:');
console.log(hash);