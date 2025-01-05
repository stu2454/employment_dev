const qrcode = require('qrcode');

qrcode.toDataURL('otpauth://totp/TestApp:example@test.com?secret=JBSWY3DPEHPK3PXP&issuer=TestApp', (err, url) => {
  if (err) {
    console.error('Error generating QR Code:', err);
  } else {
    console.log('Generated QR Code URL:', url);
  }
});

