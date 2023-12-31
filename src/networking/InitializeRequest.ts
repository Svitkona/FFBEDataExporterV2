import { FFBERequest } from './FFBERequest';

class InitializeRequest extends FFBERequest {
  public readonly urlSymbol = 'fSG1eXI9';
  public readonly encodeKey = 'rVG09Xnt';
  public readonly requestId = '75fYdNxq';

  data(): string {
    if (this.isGoogle) {
      return JSON.stringify({
        LhVz6aD2: [
          {
            '6Nf5risL': '0',
            '40w6brpQ': '0',
            jHstiL12: '0',
            io30YcLA: 'ASUS_I003DD_android9',
            K1G4fBjF: '2',
            e8Si6TGh: '',
            '1WKh6Xqe': 'ver.8.9.0',
            '64anJRhx': this.formatDate(new Date()),
            Y76dKryw: null,
            '6e4ik6kA': '',
            NggnPgQC: '',
            e5zgvyv7: this.authToken,
            GwtMEDfU: this.accountId,
          },
        ],
        Euv8cncS: [{ K2jzG6bp: '1' }],
        c402FmRD: [{ kZdGGshD: '2' }],
        c1qYg84Q: [
          { a4hXTIm0: 'F_APP_VERSION_AND', wM9AfX6I: '10000' },
          { a4hXTIm0: 'F_RSC_VERSION', wM9AfX6I: '0' },
          { a4hXTIm0: 'F_MST_VERSION', wM9AfX6I: '5135' },
        ],
      });
    }

    return JSON.stringify({
      LhVz6aD2: [
        {
          '9Tbns0eI': '',
          '9qh17ZUf': '',
          '6Nf5risL': '0',
          '40w6brpQ': '0',
          jHstiL12: '0',
          io30YcLA: 'ASUS_I003DD_android9',
          K1G4fBjF: '2',
          e8Si6TGh: '',
          '1WKh6Xqe': 'ver.8.9.0',
          '64anJRhx': this.formatDate(new Date()),
          mESKDlqL: '',
          iVN1HD3p: '',
          '6e4ik6kA': '',
          NggnPgQC: '',
          X6jT6zrQ: this.accountId,
          DOFV3qRF: this.authToken,
          f2LMEe34: '',
        },
      ],
      c402FmRD: [{ kZdGGshD: '1' }],
      Euv8cncS: [{ K2jzG6bp: '1' }],
      c1qYg84Q: [
        { a4hXTIm0: 'F_APP_VERSION_AND', wM9AfX6I: '10000' },
        { a4hXTIm0: 'F_RSC_VERSION', wM9AfX6I: '0' },
        { a4hXTIm0: 'F_MST_VERSION', wM9AfX6I: '5135' },
      ],
    });
  }
}

export { InitializeRequest };
