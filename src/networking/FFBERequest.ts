import ky from 'ky';
import CryptoJS from 'crypto-js';

abstract class FFBERequest {
  public abstract readonly urlSymbol: string;
  public abstract readonly encodeKey: string;
  public abstract readonly requestId: string;

  constructor(
    public isGoogle: boolean,
    public accountId: string,
    public authToken: string,
    public timeMillis: number,
  ) {}

  abstract data(): string;

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  makeEncryptedPayload(): string {
    const data = this.data();

    // don't know why we need to do manual padding
    // investigate using different crypto implementations
    // might be a crypto-js issue
    const paddingLength = 16 - (data.length % 16);
    const paddingChar = String.fromCharCode(paddingLength);

    // don't pad manually when isGoogle
    // don't know why this is required...
    const paddedData = this.isGoogle
      ? data
      : data + paddingChar.repeat(paddingLength);

    const options: Record<string, any> = {
      padding: CryptoJS.pad.Pkcs7,
    };

    if (this.isGoogle) {
      options.mode = CryptoJS.mode.ECB;
    } else {
      options.mode = CryptoJS.mode.CBC;
      options.iv = CryptoJS.enc.Utf8.parse('dZMjkk8gFDzKHlsx');
    }

    const encrypted = CryptoJS.AES.encrypt(
      paddedData,
      CryptoJS.enc.Utf8.parse(this.encodeKey.padEnd(16, '\0')),
      options,
    );

    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  /**
   *
   * @returns The decrypted response.
   */
  async send() {
    const body = {
      TEAYk6R1: {
        ytHoz4E2: `${this.timeMillis}`,
        z5hB3P01: this.requestId,
        // '9K0Pzcpd': '1158',
        ...(this.isGoogle ? {} : { '9K0Pzcpd': '10000' }),
      },
      t7n6cVWf: {
        qrVcDe48: this.makeEncryptedPayload(),
      },
    };

    console.log('body');
    console.log(body);

    const response = await ky.post(
      `https://v890-lapis.gumi.sg/lapisProd/app/php/gme/actionSymbol/${this.urlSymbol}.php`,
      {
        json: body,
      },
    );

    const res = await response.json();

    console.log('FFBE response...');
    console.log(res);

    // TODO: check response and fix any
    const encryptedPayloadBase64 = (res as any)['t7n6cVWf']['qrVcDe48'];

    const options: Record<string, any> = {
      padding: CryptoJS.pad.Pkcs7,
      //   mode: CryptoJS.mode.ECB,
    };

    if (this.isGoogle) {
      options.mode = CryptoJS.mode.ECB;
    } else {
      //   options.mode = CryptoJS.mode.ECB;
      options.mode = CryptoJS.mode.CBC;
      options.iv = CryptoJS.enc.Utf8.parse('dZMjkk8gFDzKHlsx');
    }

    const decrypted = CryptoJS.AES.decrypt(
      encryptedPayloadBase64.toString(),
      CryptoJS.enc.Utf8.parse(this.encodeKey.padEnd(16, '\0')),
      options,
    );

    const obj = decrypted.toString(CryptoJS.enc.Utf8);

    const end = obj.lastIndexOf('}');

    return JSON.parse(obj.substring(0, end + 1));
  }
}

export { FFBERequest };
