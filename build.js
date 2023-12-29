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

  const output = fs.createWriteStream(`${__dirname}/out/ffbesyncv2.zip`);

  const archive = archiver('zip');

  archive.directory(`${__dirname}/build/`, false);

  archive.pipe(output);

  await archive.finalize();
}

main();
