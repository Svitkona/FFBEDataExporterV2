import { FFBERequest } from './FFBERequest';

class LoginCheckRequest extends FFBERequest {
  public readonly urlSymbol = 'Qfpa24mZ';
  public readonly encodeKey = 'F83wNKFt';
  public readonly requestId = 'ufKRrNc7';

  data(): string {
    return JSON.stringify({
      LhVz6aD2: [
        {
          io30YcLA: 'ASUS_I003DD_android9',
          K1G4fBjF: '2',
          e8Si6TGh: '',
          '1WKh6Xqe': 'ver.8.9.0',
          '64anJRhx': this.formatDate(new Date()),
          '6e4ik6kA': '',
          NggnPgQC: '',
          X6jT6zrQ: this.accountId,
          DOFV3qRF: this.authToken,
          f2LMEe34: '',
        },
      ],
      c402FmRD: [{ kZdGGshD: '1' }],
      c1qYg84Q: [
        { a4hXTIm0: 'F_APP_VERSION_AND', wM9AfX6I: '10000' },
        { a4hXTIm0: 'F_RSC_VERSION', wM9AfX6I: '0' },
        { a4hXTIm0: 'F_MST_VERSION', wM9AfX6I: '10000' },
      ],
    });
  }
}

export { LoginCheckRequest };
