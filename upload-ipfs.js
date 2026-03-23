const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const path = require('path');

const pinata = new pinataSDK({ pinataApiKey: '0677124828904f06a14e', pinataSecretApiKey: '' });

async function uploadFile(filePath) {
  const readableStreamForFile = fs.createReadStream(filePath);
  const options = {
    pinataMetadata: {
      name: path.basename(filePath),
    },
    pinataOptions: {
      cidVersion: 0
    }
  };
  
  try {
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    return result.IpfsHash;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error.message);
    return null;
  }
}

async function main() {
  const files = [
    'frontend/public/mechs/omega_textured.glb',
    'frontend/public/mechs/vanguard_textured.glb',
    'frontend/public/mechs/scout_textured.glb',
    'frontend/public/mechs/striker_textured.glb',
  ];
  
  console.log('Uploading to IPFS via Pinata...\n');
  
  const hashes = {};
  for (const file of files) {
    if (fs.existsSync(file)) {
      console.log(`Uploading ${path.basename(file)}...`);
      const hash = await uploadFile(file);
      if (hash) {
        hashes[path.basename(file)] = hash;
        console.log(`✓ https://gateway.pinata.cloud/ipfs/${hash}`);
      }
    } else {
      console.log(`✗ ${file} not found`);
    }
  }
  
  fs.writeFileSync('ipfs-hashes.json', JSON.stringify(hashes, null, 2));
  console.log('\n✅ Hashes saved to ipfs-hashes.json');
}

main();
