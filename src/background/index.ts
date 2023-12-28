import Browser, { runtime } from 'webextension-polyfill';

runtime.onInstalled.addListener(() => {
  console.log('[background] loaded');
});

runtime.onMessage.addListener(async (message, sender, sendResponse) => {
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
  }
});

export {};
