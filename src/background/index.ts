import CryptoJS from 'crypto-js';
import Browser, { runtime } from 'webextension-polyfill';
import ky from 'ky';

runtime.onInstalled.addListener(() => {
  console.log('[background] loaded');
  console.log(
    `[background] redirect URI: ${Browser.identity.getRedirectURL('oauth2')}`,
  );
});

Browser.action.onClicked.addListener(() => {
  Browser.tabs.create({
    url: runtime.getURL('index.html'),
  });
});

runtime.onMessage.addListener(async message => {
  if (message.type === 'googleAuth') {
    const authParams = {
      client_id:
        '1076020971973-2ddarlm99oogcsud6t3ci9ocf5fu9p0a.apps.googleusercontent.com',
      redirect_uri: Browser.identity.getRedirectURL('oauth2'),
      response_type: 'token',
      scope: 'openid profile',
    };

    const params = new URLSearchParams(Object.entries(authParams));

    const authUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;

    try {
      const res = await Browser.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true,
      });
      console.log(res);

      return {
        type: 'success',
        data: res,
      };
    } catch (error) {
      return {
        type: 'error',
        data: error,
      };
    }
  } else if (message.type === 'startFfbeExport') {
    if (!message.data) {
      return {
        type: 'error',
        data: {
          message: "Missing params for 'startFfbeExport'",
        },
      };
    }

    const { accountId, oauthToken, isGoogle } = message.data;
    if (!accountId || !oauthToken || !isGoogle) {
      return {
        type: 'error',
        data: {
          message: "Missing params for 'startFfbeExport'",
        },
      };
    }

    const res = await initateDataExport(accountId, oauthToken, isGoogle);

    return res;
  }
});

function makeAuthenticationPayload(
  accountId: string,
  authToken: string,
  isGoogle: boolean,
  actionKey: string,
) {
  const payload = isGoogle
    ? '{"LhVz6aD2":[{"6Nf5risL":"0","40w6brpQ":"0","jHstiL12":"0","io30YcLA":"Nexus 6P_android6.0","K1G4fBjF":"2","e8Si6TGh":"","1WKh6Xqe":"ver.2.7.0.1","64anJRhx":"2019-02-08 11:15:15","Y76dKryw":null,"6e4ik6kA":"","NggnPgQC":"","e5zgvyv7":"' +
      authToken +
      '","GwtMEDfU":"' +
      accountId +
      '"}],"Euv8cncS":[{"K2jzG6bp":"1"}],"c402FmRD":[{"kZdGGshD":"2"}],"c1qYg84Q":[{"a4hXTIm0":"F_APP_VERSION_AND","wM9AfX6I":"10000"},{"a4hXTIm0":"F_RSC_VERSION","wM9AfX6I":"0"},{"a4hXTIm0":"F_MST_VERSION","wM9AfX6I":"2047"}]}'
    : '{"LhVz6aD2":[{"9Tbns0eI":null,"9qh17ZUf":null,"6Nf5risL":"0","io30YcLA":"Nexus 6P_android6.0","K1G4fBjF":"2","e8Si6TGh":"","U7CPaH9B":null,"1WKh6Xqe":"ver.2.7.0.1","64anJRhx":"2019-02-08 11:15:15","Y76dKryw":null,"6e4ik6kA":"","NggnPgQC":"","X6jT6zrQ":null,"DOFV3qRF":null,"P_FB_TOKEN":"' +
      authToken +
      '","P_FB_ID":"' +
      accountId +
      '"}],"Euv8cncS":[{"K2jzG6bp":"0"}],"c1qYg84Q":[{"a4hXTIm0":"F_APP_VERSION_IOS","wM9AfX6I":"10000"},{"a4hXTIm0":"F_RSC_VERSION","wM9AfX6I":"0"},{"a4hXTIm0":"F_MST_VERSION","wM9AfX6I":"377"}]}';

  const encrypted = CryptoJS.AES.encrypt(
    payload,
    CryptoJS.enc.Utf8.parse(actionKey),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    },
  );

  return {
    payload:
      '{"TEAYk6R1":{"ytHoz4E2":"75527","z5hB3P01":"75fYdNxq"},"t7n6cVWf":{"qrVcDe48":"' +
      encrypted.ciphertext.toString(CryptoJS.enc.Base64) +
      '"}}',
  };
}

async function callActionSymbol(
  actionSymbol: string,
  actionKey: string,
  data: { payload: string },
) {
  const res = await ky
    .post(
      `https://lapis340v-gndgr.gumi.sg/lapisProd/app/php/gme/actionSymbol/${actionSymbol}.php`,
      {
        body: data.payload,
      },
    )
    .json();

  // TODO: check response and fix any
  const encryptedPayloadBase64 = (res as any)['t7n6cVWf']['qrVcDe48'];

  const decrypted = CryptoJS.AES.decrypt(
    encryptedPayloadBase64.toString(),
    CryptoJS.enc.Utf8.parse(actionKey),
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 },
  );

  const obj = decrypted.toString(CryptoJS.enc.Utf8);

  return JSON.parse(obj);
}

function makeLoginToken(
  accountId: string,
  authToken: string,
  isGoogle: boolean,
  data: any, // TODO: fix
) {
  if (isGoogle) {
    return JSON.stringify({
      LhVz6aD2: [
        {
          '9qh17ZUf': data['LhVz6aD2'][0]['9qh17ZUf'],
          JC61TPqS: data['LhVz6aD2'][0]['JC61TPqS'],
          '6Nf5risL': data['LhVz6aD2'][0]['6Nf5risL'],
          '40w6brpQ': '0',
          jHstiL12: '0',
          io30YcLA: 'Nexus 6P_android6.0',
          K1G4fBjF: '2',
          e8Si6TGh: data['LhVz6aD2'][0]['e8Si6TGh'],
          '1WKh6Xqe': 'ver.2.7.0.1',
          '64anJRhx': '2019-02-08 11:15:15',
          m3Wghr1j: data['LhVz6aD2'][0]['m3Wghr1j'],
          ma6Ac53v: '0',
          D2I1Vtog: '0',
          '9K0Pzcpd': '10000',
          mESKDlqL: data['LhVz6aD2'][0]['mESKDlqL'],
          iVN1HD3p: data['LhVz6aD2'][0]['iVN1HD3p'],
          Y76dKryw: null,
          '6e4ik6kA': '',
          NggnPgQC: data['LhVz6aD2'][0]['NggnPgQC'],
          GwtMEDfU: accountId,
          e5zgvyv7: authToken,
          '9Tbns0eI': data['LhVz6aD2'][0]['9Tbns0eI'],
        },
      ],
      QCcFB3h9: [
        {
          qrVcDe48: data['QCcFB3h9'][0]['qrVcDe48'],
        },
      ],
      c1qYg84Q: [
        {
          a4hXTIm0: 'F_APP_VERSION_AND',
          wM9AfX6I: '10000',
        },
        {
          a4hXTIm0: 'F_RSC_VERSION',
          wM9AfX6I: '0',
        },
        {
          a4hXTIm0: 'F_MST_VERSION',
          wM9AfX6I: '10000',
        },
      ],
    });
  } else {
    throw new Error('Unimplemented.');
  }
}

function makeUserInfoPayload(
  actionKey: string,
  payloadKey: string,
  loginToken: string,
) {
  const secondEncrypted = CryptoJS.AES.encrypt(
    loginToken,
    CryptoJS.enc.Utf8.parse(actionKey),
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 },
  );

  const payload = `{"TEAYk6R1":{"ytHoz4E2":"75528","z5hB3P01":"${payloadKey}"},"t7n6cVWf":{"qrVcDe48":"${secondEncrypted.ciphertext.toString(
    CryptoJS.enc.Base64,
  )}"}}`;

  return payload;
}

async function initateDataExport(
  accountId: string,
  oauthToken: string,
  isGoogle: boolean,
) {
  const loginUrlSymbol = 'fSG1eXI9';
  const loginKey = 'rVG09Xnt\0\0\0\0\0\0\0\0';

  const userInfo1UrlSymbol = 'u7sHDCg4';
  const userInfo1Key = 'rcsq2eG7\0\0\0\0\0\0\0\0';
  const userInfo1PayloadKey = 'X07iYtp5';

  const userInfo2UrlSymbol = '7KZ4Wvuw';
  const userInfo2Key = '7VNRi6Dk\0\0\0\0\0\0\0\0';
  const userInfo2PayloadKey = '2eK5Vkr8';

  const userInfo3UrlSymbol = 'lZXr14iy';
  const userInfo3Key = '0Dn4hbWC\0\0\0\0\0\0\0\0';
  const userInfo3PayloadKey = '4rjw5pnv';

  try {
    const initialAuthenticationPayload = makeAuthenticationPayload(
      accountId,
      oauthToken,
      isGoogle,
      loginKey,
    );

    const initialAuthenticationRes = await callActionSymbol(
      loginUrlSymbol,
      loginKey,
      initialAuthenticationPayload,
    );

    const loginToken = makeLoginToken(
      accountId,
      oauthToken,
      isGoogle,
      initialAuthenticationRes,
    );

    const userData1Payload = makeUserInfoPayload(
      userInfo1Key,
      userInfo1PayloadKey,
      loginToken,
    );

    const userData1 = await callActionSymbol(userInfo1UrlSymbol, userInfo1Key, {
      payload: userData1Payload,
    });

    const userData2Payload = makeUserInfoPayload(
      userInfo2Key,
      userInfo2PayloadKey,
      loginToken,
    );

    const userData2 = await callActionSymbol(userInfo2UrlSymbol, userInfo2Key, {
      payload: userData2Payload,
    });

    const userData3Payload = makeUserInfoPayload(
      userInfo3Key,
      userInfo3PayloadKey,
      loginToken,
    );

    const userData3 = await callActionSymbol(userInfo3UrlSymbol, userInfo3Key, {
      payload: userData3Payload,
    });

    return {
      type: 'success',
      data: {
        userData1,
        userData2,
        userData3,
      },
    };
  } catch (error) {
    return {
      type: 'error',
      data: (error as Error).message,
    };
  }
}
export {};
