const fs = require('fs');
const fsPromises = require('fs/promises');
const archiver = require('archiver');

async function main() {
  try {
    await fsPromises.mkdir('out');
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }

  const manifestBase = require('./build/manifest.json');

  // pack Chrome extension
  // prepare manifest.json
  const chromeManifest = JSON.parse(JSON.stringify(manifestBase));

  delete chromeManifest.background.scripts;

  chromeManifest.background = {
    ...chromeManifest.background,
    service_worker: './static/js/background.js',
  };

  const chromeExtensionOutput = fs.createWriteStream(
    `${__dirname}/out/ffbesyncv2-chrome.zip`,
  );
  const chromeExtensionArchive = archiver('zip');
  chromeExtensionArchive.glob('**/*', {
    cwd: `${__dirname}/build`,
    ignore: 'manifest.json',
  });
  chromeExtensionArchive.append(JSON.stringify(chromeManifest, undefined, 2), {
    name: 'manifest.json',
  });
  chromeExtensionArchive.pipe(chromeExtensionOutput);

  // pack Firefox extension
  // prepare manifest.json
  const firefoxManifest = JSON.parse(JSON.stringify(manifestBase));

  firefoxManifest.background = {
    ...firefoxManifest.background,
    scripts: ['./static/js/background.js'],
  };

  delete firefoxManifest.background.service_worker;

  const firefoxExtensionOutput = fs.createWriteStream(
    `${__dirname}/out/ffbesyncv2-firefox.zip`,
  );
  const firefoxExtensionArchive = archiver('zip');
  firefoxExtensionArchive.glob('**/*', {
    cwd: `${__dirname}/build`,
    ignore: 'manifest.json',
  });
  firefoxExtensionArchive.append(
    JSON.stringify(firefoxManifest, undefined, 2),
    {
      name: 'manifest.json',
    },
  );
  firefoxExtensionArchive.pipe(firefoxExtensionOutput);

  // pack src -- useful for uploading to Firefox extension portal
  const srcOutput = fs.createWriteStream(`${__dirname}/out/src.zip`);
  const srcArchive = archiver('zip');
  srcArchive.directory(`${__dirname}/src/`, 'src');
  srcArchive.directory(`${__dirname}/public/`, 'public');
  srcArchive.glob('*.+(js|json|md|gitignore)', { cwd: __dirname });
  srcArchive.pipe(srcOutput);

  await Promise.all([
    chromeExtensionArchive.finalize(),
    firefoxExtensionArchive.finalize(),
    srcArchive.finalize(),
  ]);
}

main();
