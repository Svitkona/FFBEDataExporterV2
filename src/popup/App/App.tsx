import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import './App.css';
import Browser from 'webextension-polyfill';
import { useState } from 'react';

import agent from 'superagent';
import { AES } from 'crypto-js';
import CryptoJS from 'crypto-js';

enum State {
  Initial,
  GettingToken,
  GotToken,
  GettingData,
  GotData,
  Error,
}

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

  const encrypted = AES.encrypt(payload, CryptoJS.enc.Utf8.parse(actionKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

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
  const res = await agent
    .post(
      `https://lapis340v-gndgr.gumi.sg/lapisProd/app/php/gme/actionSymbol/${actionSymbol}.php`,
    )
    .set('Content-Type', 'application/json')
    .send(data.payload);

  const encryptedPayloadBase64 = res.body['t7n6cVWf']['qrVcDe48'];

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

function makeInventoryData({
  userData,
  userData3,
}: {
  userData: any;
  userData3: any;
}) {
  const ret: {
    id: string;
    count: number;
    level?: string;
    enhancements?: string[];
  }[] = [];

  const userEquipListStringArray =
    userData['w83oV9uP'][0]['HpL3FM4V'].split(',');

  userEquipListStringArray.forEach(function (userEquipStr: string) {
    const equipStrData = userEquipStr.split(':');
    const equipId = equipStrData[0];
    const equipCount = parseInt(equipStrData[1]);
    if (equipId && equipCount) {
      ret.push({ id: equipId, count: equipCount });
    }
  });

  const visionCards = userData['2Xi0wuGA'];
  visionCards.forEach((vc: Record<string, string>) => {
    ret.push({
      id: vc['5giCMUd2'],
      count: 1,
      level: vc['7wV3QZ80'],
    });
  });

  if (userData3 != null) {
    const userCustomEquips = userData3['uRZxw78i'];
    userCustomEquips.forEach(function (
      userCustomEquip: Record<string, string>,
    ) {
      const equipId = userCustomEquip['J1YX9kmM'];
      const enhancements: string[] = [];
      const customAbilityArray = userCustomEquip['nM63Zvtp'].split(',');
      customAbilityArray.forEach(function (customAbilityStr) {
        if (customAbilityStr) {
          const abilityId = customAbilityStr.split(':')[1];
          enhancements.push(abilityId);
        }
      });
      ret.push({ id: equipId, count: 1, enhancements });
    });
  }

  const userMateriaListStringArray =
    userData['aS39Eshy'][0]['HpL3FM4V'].split(',');

  userMateriaListStringArray.forEach(function (userMateriaStr: string) {
    const materiaStrData = userMateriaStr.split(':');
    const materiaId = materiaStrData[0];
    const materiaCount = parseInt(materiaStrData[1]);
    if (materiaId && materiaCount) {
      ret.push({ id: materiaId, count: materiaCount });
    }
  });

  return ret;
}

interface Unit {
  id: string;
  uniqueId: string;
  level: number;
  pots: {
    hp: number;
    mp: number;
    atk: number;
    def: number;
    mag: number;
    spr: number;
  };
  doors: {
    hp: number;
    mp: number;
    atk: number;
    def: number;
    mag: number;
    spr: number;
  };
  enhancements: string[];
  tmr: number;
  stmr: number;
  lbLevel: number;
  currentLbLevelExp: number;
  totalExp: number;
  currentLevelExp: number;
  exRank: number;
  nvRarity: boolean;
  nva: boolean;
  tmrId?: string;
  stmrId?: string;
}

function makeUnitListData({ userData }: { userData: any }) {
  const unitSublimiation: Record<string, string[]> = {};

  const subInfoList = userData['Duz1v8x9'];
  subInfoList.forEach(function (subinfo: Record<string, string>) {
    const unitUniqueId = subinfo['og2GHy49'];
    const subLvl = subinfo['yjY4GK3X'];
    const subSkillId = subinfo['6bHxDEL0'];

    if (!unitSublimiation[unitUniqueId]) {
      unitSublimiation[unitUniqueId] = [];
    }
    unitSublimiation[unitUniqueId].push(subSkillId + ',' + subLvl);
  });

  const ret: Unit[] = [];

  const unitList = userData['B71MekS8'];
  unitList.forEach(function (unitToken: Record<string, string>) {
    const unitId = unitToken['3HriTp6B'];
    const unitUniqueId = unitToken['og2GHy49'];

    const pots = {
      hp: parseInt(unitToken['em5hx4FX'].split('-')[1]),
      mp: parseInt(unitToken['L0MX7edB'].split('-')[1]),
      atk: parseInt(unitToken['o7Ynu1XP'].split('-')[1]),
      def: parseInt(unitToken['6tyb58Kc'].split('-')[1]),
      mag: parseInt(unitToken['Y9H6TWnv'].split('-')[1]),
      spr: parseInt(unitToken['sa8Ewx3H'].split('-')[1]),
    };
    const doors = {
      hp: parseInt(unitToken['em5hx4FX'].split('-')[2]) || 0,
      mp: parseInt(unitToken['L0MX7edB'].split('-')[2]) || 0,
      atk: parseInt(unitToken['o7Ynu1XP'].split('-')[2]) || 0,
      def: parseInt(unitToken['6tyb58Kc'].split('-')[2]) || 0,
      mag: parseInt(unitToken['Y9H6TWnv'].split('-')[2]) || 0,
      spr: parseInt(unitToken['sa8Ewx3H'].split('-')[2]) || 0,
    };

    const skillEnhancements: string[] = [];
    if (unitSublimiation[unitUniqueId]) {
      unitSublimiation[unitUniqueId].forEach(function (skillInfo) {
        skillEnhancements.push(skillInfo.split(',')[0]);
      });
    }
    const unitData: Unit = {
      id: unitId,
      uniqueId: unitUniqueId,
      level: parseInt(unitToken['7wV3QZ80']),
      pots: pots,
      doors: doors,
      enhancements: skillEnhancements,
      tmr: parseInt(unitToken['f17L8wuX']),
      stmr: parseInt(unitToken['o6m7L38B']),
      lbLevel: parseInt(unitToken['a71oxzCH']),
      currentLbLevelExp: parseInt(unitToken['EXf5G3Mk']),
      totalExp: parseInt(unitToken['X9ABM7En']),
      currentLevelExp: parseInt(unitToken['B6H34Mea']),
      exRank: parseInt(unitToken['f8vk4JrD']),
      nvRarity: unitToken['T9Apq5fS'].toString() === '1',
      nva: unitToken['k9GFaWm1'].toString() === '1',
    };
    if (
      unitId.toString() === '904000115' ||
      unitId.toString() === '904000103'
    ) {
      // Prism Moogle or specific trust moogle
      const tmrId = unitToken['9mu4boy7'];
      if (tmrId) {
        unitData['tmrId'] = tmrId.split(':')[1];
      }
    }
    if (unitId.toString() === '906000103') {
      // super trust moogle
      const stmrId = unitToken['C74EmZ1I'];
      if (stmrId) {
        unitData['stmrId'] = stmrId.split(':')[1];
      }
    }
    ret.push(unitData);
  });

  return ret;
}

function makeEsperData({ userData }: { userData: any }) {
  let ret: { id: string; rarity: number; level: number }[] = [];

  userData['gP9TW2Bf'].forEach((e: any) => {
    let esper = {
      id: e['Iwfx42Wo'],
      rarity: parseInt(e['9fW0TePj']),
      level: parseInt(e['7wV3QZ80']),
    };
    ret.push(esper);
  });

  return ret;
}

function exportDate() {
  const now = new Date();

  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();

  return [year, month, day].join('-');
}

const App = () => {
  const [state, setState] = useState(State.Initial);
  const [oauthToken, setOauthToken] = useState('');
  const [isGoogle, setIsGoogle] = useState(true);
  const [accountId, setAccountId] = useState('');
  const [data, setData] = useState({} as Record<string, unknown>);

  const dateString = exportDate();

  async function initiateGoogleConnection() {
    try {
      setState(State.GettingToken);

      setIsGoogle(true);

      const authRes = await Browser.runtime.sendMessage({
        type: 'googleAuth',
      });

      console.log(`[popup] got res '${JSON.stringify(authRes)}'`);

      const params = new URLSearchParams(
        new URL(authRes.data).hash.substring(1),
      );

      const accessToken = params.get('access_token');

      console.log(`token ${accessToken}`);

      setOauthToken(accessToken!);

      const userInfoRes = await agent
        .post('https://openidconnect.googleapis.com/v1/userinfo')
        .set('Authorization', `Bearer ${accessToken}`);

      console.log('Got user info');

      const id: string = userInfoRes.body.sub;

      setState(State.GotToken);

      setAccountId(id);
    } catch (error) {
      setState(State.Error);
      console.error(error);
    }
  }

  async function initiateDataExport() {
    setState(State.GettingData);

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

      const userData1 = await callActionSymbol(
        userInfo1UrlSymbol,
        userInfo1Key,
        {
          payload: userData1Payload,
        },
      );

      const userData2Payload = makeUserInfoPayload(
        userInfo2Key,
        userInfo2PayloadKey,
        loginToken,
      );

      const userData2 = await callActionSymbol(
        userInfo2UrlSymbol,
        userInfo2Key,
        { payload: userData2Payload },
      );

      const userData3Payload = makeUserInfoPayload(
        userInfo3Key,
        userInfo3PayloadKey,
        loginToken,
      );

      const userData3 = await callActionSymbol(
        userInfo3UrlSymbol,
        userInfo3Key,
        { payload: userData3Payload },
      );

      const inventoryData = makeInventoryData({
        userData: userData1,
        userData3,
      });
      const unitListData = makeUnitListData({ userData: userData1 });
      const esperData = makeEsperData({ userData: userData1 });

      setData({
        inventoryData,
        unitListData,
        esperData,
      });

      setState(State.GotData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container p-3">
      <div className="row">
        <div className="col">
          <h4>FFBE data exporter (Facebook/Google)</h4>
        </div>
      </div>
      {state === State.Initial && (
        <div className="row">
          <div className="col">
            <button
              className="btn btn-primary me-3"
              onClick={initiateGoogleConnection}
            >
              Start Google based export
            </button>
          </div>
          <div className="col">
            <button className="btn btn-primary">
              Start Facebook based export
            </button>
          </div>
        </div>
      )}
      {state === State.GettingToken ||
        (state === State.GettingData && (
          <div className="row">
            <div className="col">
              <div className="spinner-border" role="status" />
            </div>
          </div>
        ))}
      {state === State.GotToken && (
        <div className="row">
          <div className="col">
            <button
              type="button"
              className="btn btn-primary"
              onClick={initiateDataExport}
            >
              Connect to FFBE and export data
            </button>
          </div>
        </div>
      )}
      {state === State.Error && (
        <>
          <div className="row">
            <div className="col">An error occurred.</div>
          </div>
          <div className="row">
            <div className="col">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setState(State.Initial)}
              >
                Start over
              </button>
            </div>
          </div>
        </>
      )}
      {state === State.GotData && (
        <>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(
              JSON.stringify(data.inventoryData),
            )}`}
            download={`inventory_${dateString}.json`}
          >
            Download inventory data
          </a>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(
              JSON.stringify(data.unitListData),
            )}`}
            download={`units_${dateString}.json`}
          >
            Download unit data
          </a>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(
              JSON.stringify(data.esperData),
            )}`}
            download={`espers_${dateString}.json`}
          >
            Download esper data
          </a>
        </>
      )}
    </div>
  );
};

export { App };
