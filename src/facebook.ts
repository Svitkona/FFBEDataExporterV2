import Browser from 'webextension-polyfill';

console.log('facebook.js executing');

const facebookResponse = document.getElementsByTagName('script')[0].innerHTML;
const tokenReg = /access_token=(.*?)&/;
const tokenMatch = tokenReg.exec(facebookResponse);
if (tokenMatch) {
  Browser.runtime.sendMessage({
    type: 'facebookToken',
    data: tokenMatch[1],
  });
} else {
  Browser.runtime.sendMessage({
    type: 'fbLoginCancelled',
    data: 'Login Canceled',
  });
}
