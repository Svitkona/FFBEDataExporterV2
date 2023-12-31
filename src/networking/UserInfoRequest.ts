import { FFBERequest } from './FFBERequest';

const data = {
  first: {
    url: 'u7sHDCg4',
    encodeKey: 'rcsq2eG7',
    requestId: 'X07iYtp5',
  },
  second: {
    url: '7KZ4Wvuw',
    encodeKey: '7VNRi6Dk',
    requestId: '2eK5Vkr8',
  },
  third: {
    url: 'lZXr14iy',
    encodeKey: '0Dn4hbWC',
    requestId: '4rjw5pnv',
  },
};

class UserInfoRequest extends FFBERequest {
  protected constructor(
    public isGoogle: boolean,
    public readonly urlSymbol: string,
    public readonly encodeKey: string,
    public readonly requestId: string,
    public accountId: string,
    public authToken: string,
    public loginToken: string,
    public timeMillis: number,
  ) {
    super(isGoogle, accountId, authToken, timeMillis);
  }

  public static First(
    isGoogle: boolean,
    accountId: string,
    authToken: string,
    loginToken: string,
    timeMillis: number,
  ) {
    return new UserInfoRequest(
      isGoogle,
      data.first.url,
      data.first.encodeKey,
      data.first.requestId,
      accountId,
      authToken,
      loginToken,
      timeMillis,
    );
  }

  public static Second(
    isGoogle: boolean,
    accountId: string,
    authToken: string,
    loginToken: string,
    timeMillis: number,
  ) {
    return new UserInfoRequest(
      isGoogle,
      data.second.url,
      data.second.encodeKey,
      data.second.requestId,
      accountId,
      authToken,
      loginToken,
      timeMillis,
    );
  }

  public static Third(
    isGoogle: boolean,
    accountId: string,
    authToken: string,
    loginToken: string,
    timeMillis: number,
  ) {
    return new UserInfoRequest(
      isGoogle,
      data.third.url,
      data.third.encodeKey,
      data.third.requestId,
      accountId,
      authToken,
      loginToken,
      timeMillis,
    );
  }

  data(): string {
    return this.loginToken;
  }
}

export { UserInfoRequest };
