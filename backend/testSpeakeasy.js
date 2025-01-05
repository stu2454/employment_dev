const speakeasy = require('speakeasy');

const secret = speakeasy.generateSecret({ length: 20, name: 'TestApp' });
console.log('Generated Secret:', secret.base32);

const token = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32',
});
console.log('Generated TOTP:', token);

const verified = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: token,
});
console.log('Verification Result:', verified);

