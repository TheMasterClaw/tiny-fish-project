const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const PINATA_API_KEY = '0677124828904f06a14e';
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET || '';

async function uploadToPinata(filePath) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  
  data.append('file', fs.createReadStream(filePath));
  
  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_API_KEY,
    },
  });
  
  return response.data.IpfsHash;
}

async function main() {
  const mechsDir = './mechs';
  const files = fs.readdirSync(mechsDir).filter(f => f.endsWith('.glb'));
  
  console.log('Uploading mechs to IPFS via Pinata...\n');
  
  const hashes = {};
  for (const file of files) {
    const filePath = path.join(mechsDir, file);
    console.log(`Uploading ${file}...`);
    try {
      const hash = await uploadToPinata(filePath);
      hashes[file] = hash;
      console.log(`✓ ${file} → https://gateway.pinata.cloud/ipfs/${hash}`);
    } catch (err) {
      console.error(`✗ ${file} failed:`, err.message);
    }
  }
  
  console.log('\n--- IPFS HASHES ---');
  console.log(JSON.stringify(hashes, null, 2));
}

main();
