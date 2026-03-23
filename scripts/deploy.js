const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying CoralGuard contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy ReefMonitor
  console.log("\n📊 Deploying ReefMonitor...");
  const ReefMonitor = await hre.ethers.getContractFactory("ReefMonitor");
  const reefMonitor = await ReefMonitor.deploy();
  await reefMonitor.waitForDeployment();
  console.log("✅ ReefMonitor deployed to:", await reefMonitor.getAddress());

  // Deploy GuardianRewards (using native ETH as reward token for now)
  console.log("\n🏆 Deploying GuardianRewards...");
  const GuardianRewards = await hre.ethers.getContractFactory("GuardianRewards");
  const guardianRewards = await GuardianRewards.deploy(
    hre.ethers.ZeroAddress, // No ERC20 token, using native ETH
    true // use native token
  );
  await guardianRewards.waitForDeployment();
  console.log("✅ GuardianRewards deployed to:", await guardianRewards.getAddress());

  // Deploy ConservationNFT
  console.log("\n🎨 Deploying ConservationNFT...");
  const ConservationNFT = await hre.ethers.getContractFactory("ConservationNFT");
  const conservationNFT = await ConservationNFT.deploy(deployer.address);
  await conservationNFT.waitForDeployment();
  console.log("✅ ConservationNFT deployed to:", await conservationNFT.getAddress());

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    contracts: {
      ReefMonitor: await reefMonitor.getAddress(),
      GuardianRewards: await guardianRewards.getAddress(),
      ConservationNFT: await conservationNFT.getAddress(),
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verify on Etherscan if on a public network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 Waiting for block confirmations before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    try {
      await hre.run("verify:verify", {
        address: await reefMonitor.getAddress(),
        constructorArguments: [],
      });
      console.log("✅ ReefMonitor verified");
    } catch (e) {
      console.log("ReefMonitor verification error:", e.message);
    }

    try {
      await hre.run("verify:verify", {
        address: await guardianRewards.getAddress(),
        constructorArguments: [hre.ethers.ZeroAddress, true],
      });
      console.log("✅ GuardianRewards verified");
    } catch (e) {
      console.log("GuardianRewards verification error:", e.message);
    }

    try {
      await hre.run("verify:verify", {
        address: await conservationNFT.getAddress(),
        constructorArguments: [deployer.address],
      });
      console.log("✅ ConservationNFT verified");
    } catch (e) {
      console.log("ConservationNFT verification error:", e.message);
    }
  }

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
