import getZipCodeDatabase from './helpers/database.js';
import registerServiceWorker from './helpers/install-sw.js';

async function getCepData(zipCode) {
  const db = await getZipCodeDatabase();
  let zipCodeData = await db.zipCode.get(zipCode);
  if (zipCodeData) return zipCodeData;
  const { getFromNetwork } = await import('./install-data/index.js');
  zipCodeData = await getFromNetwork(zipCode);
  return zipCodeData;
}

function fillTable(zipCodeData) {
  console.log(zipCodeData);
  // this is necessary because we don't have phone number for now
  delete zipCodeData.phoneCode;
  const addToTheTable = (key) => {
    console.log(`${key}: ${zipCodeData[key]}`);
    const tdElement = document.getElementById(key);
    tdElement.textContent = zipCodeData[key];
  };
  Object.keys(zipCodeData).forEach(addToTheTable);
}

const linkToInstall = document.querySelector("a[href='#']");
linkToInstall.addEventListener('click', async () => {
  console.log('install data...');
  const { installData } = await import('./install-data/index.js');
  console.log(installData);
  alert('Will install');
  // button.disabled = true;
  // button.setAttribute('aria-busy', true);
  // await installData();
  // button.removeAttribute('aria-busy');
});

function setLoading(isLoading) {
  const submitButton = document.querySelector("button[type='submit']");
  submitButton.setAttribute('aria-busy', isLoading);
  submitButton.disabled = isLoading;
}

const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setLoading(true);
  const zipCodeData = await getCepData(form.cep.value.replace('-', ''));
  setLoading(false);
  fillTable(zipCodeData);
});

registerServiceWorker();

// TODO: improve this code, use class such as HTMLService, ZipCodeService and so on
// TODO: format CEP data to show in the table
