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

  const extensionOutput = fs.createWriteStream(
    `${__dirname}/out/ffbesyncv2.zip`,
  );
  const extensionArchive = archiver('zip');
  extensionArchive.directory(`${__dirname}/build/`, false);
  extensionArchive.pipe(extensionOutput);

  const srcOutput = fs.createWriteStream(`${__dirname}/out/src.zip`);
  const srcArchive = archiver('zip');
  srcArchive.directory(`${__dirname}/src/`, 'src');
  srcArchive.directory(`${__dirname}/public/`, 'public');
  srcArchive.glob('*.+(js|json|md|gitignore)', { cwd: __dirname });
  srcArchive.pipe(srcOutput);

  await Promise.all([extensionArchive.finalize(), srcArchive.finalize()]);
}

main();
