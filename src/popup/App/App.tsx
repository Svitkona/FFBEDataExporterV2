import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';
import Browser, { runtime } from 'webextension-polyfill';
import { useState } from 'react';
import ky from 'ky';

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

function makeConsumablesData({ userData }: { userData: any /* TODO: fix */ }) {
  let ret: { itemId: string; itemQty: string }[] = [];

  let itemList = userData['4rC0aLkA'];

  itemList.forEach((item: any /* TODO: fix */) => {
    let itemCSV: string = item['HpL3FM4V'];
    let array = itemCSV.split(',');

    array.forEach(array => {
      let itemId = array.split(':')[0];
      let itemQty = array.split(':')[1];
      let consumble = {
        itemId,
        itemQty,
      };

      ret.push(consumble);
    });
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

function makeUnitListData({
  userData,
  userData3,
  fetchReserves,
}: {
  userData: any; // TODO fix
  userData3: any; // TODO fix
  fetchReserves: boolean;
}) {
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

  const unitList = fetchReserves
    ? userData['B71MekS8'].concat(userData3['6KWVR3Dw'])
    : userData['B71MekS8'];
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
  const map: Record<
    string,
    { id: string; rarity: number; level: number; board?: any /* TODO: fix */ }
  > = {};

  userData['gP9TW2Bf'].forEach((e: any /* TODO: fix */) => {
    const id = e['Iwfx42Wo'];

    const esper = {
      id,
      rarity: parseInt(e['9fW0TePj']),
      level: parseInt(e['7wV3QZ80']),
    };

    map[id] = esper;
  });

  userData['1S8P2u9f'].forEach((e: any) => {
    const id = e['Iwfx42Wo'];

    map[id].board = e['E8WRi1bg'];
  });

  return Object.values(map);
}

function exportDate() {
  const now = new Date();

  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();

  return [year, month, day].join('-');
}

enum State {
  Initial,
  GettingToken,
  GotToken,
  GettingData,
  GotData,
  Error,
}

const App = () => {
  const [state, setState] = useState(State.Initial);
  const [errorMesage, setErrorMessage] = useState('');
  const [oauthToken, setOauthToken] = useState('');
  const [isGoogle, setIsGoogle] = useState(true);
  const [accountId, setAccountId] = useState('');
  const [data, setData] = useState({} as Record<string, unknown>);
  const [fetchReserves, setFetchReserves] = useState(false);

  const dateString = exportDate();

  async function initiateGoogleConnection() {
    try {
      setState(State.GettingToken);

      setIsGoogle(true);

      const authRes = await Browser.runtime.sendMessage({
        type: 'googleAuth',
      });

      if (authRes.type === 'error') {
        setState(State.Error);
        setErrorMessage(authRes.data.message);
        return;
      }

      console.log(`[popup] got res '${JSON.stringify(authRes)}'`);

      const params = new URLSearchParams(
        new URL(authRes.data).hash.substring(1),
      );

      const accessToken = params.get('access_token');

      console.log(`token ${accessToken}`);

      setOauthToken(accessToken!);

      const userInfoRes = await ky
        .post('https://openidconnect.googleapis.com/v1/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .json();

      console.log('Got user info');

      // TODO: check response and fix any
      const id: string = (userInfoRes as any).sub;

      setState(State.GotToken);

      setAccountId(id);
    } catch (error) {
      setState(State.Error);
      console.error(error);
    }
  }

  async function initiateFacebookConnection() {
    const permissionsRes = await Browser.permissions.request({
      origins: [
        'https://lapis340v-gndgr.gumi.sg/*',
        'https://v890-lapis.gumi.sg/*',
        'https://www.facebook.com/*',
      ],
    });

    if (!permissionsRes) {
      setErrorMessage('Please approve the requested permissions.');
      setState(State.Error);
      return;
    }

    setState(State.GettingToken);

    setIsGoogle(false);

    const tab = await Browser.tabs.create({
      url: 'https://m.facebook.com/login.php?skip_api_login=1&api_key=1238083776220999&signed_next=1&next=https%3A%2F%2Fm.facebook.com%2Fv3.3%2Fdialog%2Foauth%3Fredirect_uri%3Dfbconnect%253A%252F%252Fsuccess%26display%3Dtouch%26state%3D%257B%25220_auth_logger_id%2522%253A%2522792e45db-e19b-4aec-9efa-767011b65d81%2522%252C%25223_method%2522%253A%2522web_view%2522%257D%26scope%3Duser_friends%26response_type%3Dtoken%252Csigned_request%26default_audience%3Dfriends%26return_scopes%3Dtrue%26auth_type%3Drerequest%26client_id%3D1238083776220999%26ret%3Dlogin%26sdk%3Dandroid-4.40.0%26logger_id%3D792e45db-e19b-4aec-9efa-767011b65d81&cancel_url=fbconnect%3A%2F%2Fsuccess%3Ferror%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26state%3D%257B%25220_auth_logger_id%2522%253A%2522792e45db-e19b-4aec-9efa-767011b65d81%2522%252C%25223_method%2522%253A%2522web_view%2522%257D%26e2e%3D%257B%2522init%2522%253A1549652357497%257D&display=touch&locale=en_US&logger_id=792e45db-e19b-4aec-9efa-767011b65d81&_rdr',
    });

    Browser.runtime.sendMessage({
      type: 'facebookAuth',
      data: {
        tabId: tab.id,
      },
    });

    const listener = async (message: any) => {
      if (message.type === 'facebookToken') {
        console.log(`Got token (token=${message.data})`);

        Browser.tabs.remove(tab.id!);

        setState(State.GotToken);
        setOauthToken(message.data);

        try {
          const userInfoRes = await ky
            .get(
              `https://graph.facebook.com/v18.0/me?fields=id%2Cname&access_token=${message.data}`,
            )
            .json();

          // TODO: check response and fix any
          const id: string = (userInfoRes as any).id;

          console.log(`Got user info (id=${id})`);

          setState(State.GotToken);

          setAccountId(id);
        } catch (error) {
          setErrorMessage((error as Error).message);
          setState(State.Error);
        }
      } else if (message.type === 'fbLoginCancelled') {
        setState(State.Initial);
      }
    };

    Browser.runtime.onMessage.addListener(listener);
  }

  async function initiateDataExport() {
    const permissionsRes = await Browser.permissions.request({
      origins: [
        'https://lapis340v-gndgr.gumi.sg/*',
        'https://v890-lapis.gumi.sg/*',
        'https://www.facebook.com/*',
      ],
    });

    if (!permissionsRes) {
      setErrorMessage('Please approve the requested permissions.');
      setState(State.Error);
      return;
    }

    setState(State.GettingData);

    const res = await runtime.sendMessage({
      type: 'startFfbeExport',
      data: {
        accountId,
        oauthToken,
        isGoogle,
        fetchReserves,
      },
    });

    if (res.type === 'error') {
      setState(State.Error);
      setErrorMessage(res.data.message);
      return;
    }

    const { userInfo1, userInfo3 } = res.data;

    const inventoryData = makeInventoryData({
      userData: userInfo1,
      userData3: userInfo3,
    });
    const unitListData = makeUnitListData({
      userData: userInfo1,
      userData3: userInfo3,
      fetchReserves,
    });
    const esperData = makeEsperData({ userData: userInfo1 });
    const consumablesData = makeConsumablesData({ userData: userInfo1 });

    setData({
      inventoryData,
      unitListData,
      esperData,
      consumablesData,
    });

    setState(State.GotData);
  }

  return (
    <div className="p-3">
      <div className="row">
        <div className="col">
          <h4>FFBE data exporter (Facebook/Google)</h4>
        </div>
      </div>
      {state === State.Initial && (
        <>
          <div className="row">
            <div className="col col-6">
              <button
                className="btn btn-primary me-3"
                onClick={initiateGoogleConnection}
              >
                Start Google based export
              </button>
              <button
                className="btn btn-primary"
                onClick={initiateFacebookConnection}
              >
                Start Facebook based export
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <input
                type="checkbox"
                className="me-2"
                id="fetch-reserves"
                onChange={event =>
                  setFetchReserves(event.target.value === 'on')
                }
              />
              <label htmlFor="fetch-reserves">
                Fetch reserves in units.json?
              </label>
            </div>
          </div>
        </>
      )}
      {(state === State.GettingToken || state === State.GettingData) && (
        <div className="row">
          <div className="col">
            <div className="spinner-border" role="status" />
          </div>
        </div>
      )}
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
            <code>{errorMesage ?? 'An unknown error occurred.'}</code>
          </div>
          <div className="row">
            <div className="col col-1">
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
          <div className="row">
            <div className="col">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(data.inventoryData),
                )}`}
                download={`inventory_${dateString}.json`}
              >
                Download inventory data
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(data.unitListData),
                )}`}
                download={`units_${dateString}.json`}
              >
                Download unit data
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(data.esperData),
                )}`}
                download={`espers_${dateString}.json`}
              >
                Download esper data
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(data.consumablesData),
                )}`}
                download={`consumables_${dateString}.json`}
              >
                Download consumables data
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col col-1">
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
    </div>
  );
};

export { App };
