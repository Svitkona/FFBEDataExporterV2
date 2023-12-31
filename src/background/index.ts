import Browser, { runtime } from 'webextension-polyfill';
import { InitializeRequest } from '../networking/InitializeRequest';
import { UserInfoRequest } from '../networking/UserInfoRequest';

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
  } else if (message.type === 'facebookAuth') {
    const fbTabId = message.data.tabId;

    Browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (tabId === fbTabId && tab.status === 'complete') {
        Browser.scripting.executeScript({
          target: {
            tabId,
          },
          files: ['/static/js/facebook.js'],
        });
      }
    });
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
    if (!accountId || !oauthToken || isGoogle === undefined) {
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
    return JSON.stringify({
      LhVz6aD2: [
        {
          JC61TPqS: data['LhVz6aD2'][0]['JC61TPqS'],
          m3Wghr1j: data['LhVz6aD2'][0]['m3Wghr1j'],
          mESKDlqL: data['LhVz6aD2'][0]['mESKDlqL'],
          iVN1HD3p: data['LhVz6aD2'][0]['iVN1HD3p'],
          '9K0Pzcpd': '10000',
          X6jT6zrQ: accountId,
          '9Tbns0eI': data['LhVz6aD2'][0]['9Tbns0eI'],
          '9qh17ZUf': data['LhVz6aD2'][0]['9qh17ZUf'],
          '6Nf5risL': data['LhVz6aD2'][0]['6Nf5risL'],
          io30YcLA: 'Nexus 6P_android6.0',
          K1G4fBjF: '2',
          e8Si6TGh: data['LhVz6aD2'][0]['e8Si6TGh'],
          U7CPaH9B: data['LhVz6aD2'][0]['U7CPaH9B'],
          '1WKh6Xqe': 'ver.2.7.0.1',
          '64anJRhx': '2019-02-08 11:15:15',
          Y76dKryw: null,
          '6e4ik6kA': '',
          NggnPgQC: '',
          DOFV3qRF: authToken,
        },
      ],
      QCcFB3h9: [
        {
          qrVcDe48: data['QCcFB3h9'][0]['qrVcDe48'],
        },
      ],
      Euv8cncS: [
        {
          K2jzG6bp: '0',
        },
      ],
      c1qYg84Q: [
        {
          a4hXTIm0: 'F_APP_VERSION_IOS',
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
  }
}

async function initateDataExport(
  accountId: string,
  oauthToken: string,
  isGoogle: boolean,
) {
  const start = new Date();
  try {
    const initializeRequest = new InitializeRequest(
      isGoogle,
      accountId,
      oauthToken,
      new Date().getMilliseconds() - start.getMilliseconds(),
    );

    const initializeResponse = await initializeRequest.send();

    const loginToken = makeLoginToken(
      accountId,
      oauthToken,
      isGoogle,
      initializeResponse,
    );

    const userInfo1Request = UserInfoRequest.First(
      isGoogle,
      accountId,
      oauthToken,
      loginToken,
      new Date().getMilliseconds() - start.getMilliseconds(),
    );

    const userInfo1 = await userInfo1Request.send();

    const userInfo2Request = UserInfoRequest.Second(
      isGoogle,
      accountId,
      oauthToken,
      loginToken,
      new Date().getMilliseconds() - start.getMilliseconds(),
    );

    const userInfo2 = await userInfo2Request.send();

    const userInfo3Request = UserInfoRequest.Third(
      isGoogle,
      accountId,
      oauthToken,
      loginToken,
      new Date().getMilliseconds() - start.getMilliseconds(),
    );

    const userInfo3 = await userInfo3Request.send();

    return {
      type: 'success',
      data: {
        userInfo1,
        userInfo2,
        userInfo3,
      },
    };
  } catch (error) {
    return {
      type: 'error',
      data: {
        message: (error as any).message,
      },
    };
  }
}
export {};
