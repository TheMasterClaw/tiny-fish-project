const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CoralGuard Contracts", function () {
  let reefMonitor, conservationNFT, guardianRewards;
  let owner, provider1, provider2, user1, user2, verifier;

  beforeEach(async function () {
    [owner, provider1, provider2, user1, user2, verifier] = await ethers.getSigners();

    // Deploy ReefMonitor
    const ReefMonitor = await ethers.getContractFactory("ReefMonitor");
    reefMonitor = await ReefMonitor.deploy();

    // Deploy GuardianRewards
    const GuardianRewards = await ethers.getContractFactory("GuardianRewards");
    guardianRewards = await GuardianRewards.deploy(ethers.ZeroAddress, true);

    // Deploy ConservationNFT
    const ConservationNFT = await ethers.getContractFactory("ConservationNFT");
    conservationNFT = await ConservationNFT.deploy(owner.address);

    // Authorize providers
    await reefMonitor.authorizeProvider(provider1.address);
    await reefMonitor.authorizeProvider(provider2.address);
    
    // Authorize verifier
    await guardianRewards.authorizeVerifier(verifier.address);
  });

  describe("ReefMonitor", function () {
    it("Should submit reef data", async function () {
      await reefMonitor.connect(provider1).submitReefData(
        "reef-001",
        "Great Barrier Reef, Australia",
        75,
        2600, // 26°C * 100
        810,  // 8.1 pH * 100
        60,
        ["Acropora", "Montipora", "Clownfish"],
        "ipfs://Qm...",
        0 // SENSOR
      );

      const data = await reefMonitor.getLatestReefData("reef-001");
      expect(data.healthScore).to.equal(75);
      expect(data.location).to.equal("Great Barrier Reef, Australia");
    });

    it("Should emit health alert for critical reef", async function () {
      await expect(reefMonitor.connect(provider1).submitReefData(
        "reef-critical",
        "Damaged Reef",
        15, // Critical score
        2800,
        750,
        10,
        [],
        "ipfs://Qm...",
        0
      )).to.emit(reefMonitor, "HealthAlert");
    });

    it("Should get reef status counts", async function () {
      // Submit various health scores
      await reefMonitor.connect(provider1).submitReefData("reef-1", "Loc1", 15, 2500, 800, 20, [], "ipfs://Qm", 0);
      await reefMonitor.connect(provider1).submitReefData("reef-2", "Loc2", 35, 2500, 800, 30, [], "ipfs://Qm", 0);
      await reefMonitor.connect(provider1).submitReefData("reef-3", "Loc3", 55, 2500, 800, 45, [], "ipfs://Qm", 0);
      await reefMonitor.connect(provider1).submitReefData("reef-4", "Loc4", 75, 2500, 800, 65, [], "ipfs://Qm", 0);
      await reefMonitor.connect(provider1).submitReefData("reef-5", "Loc5", 95, 2500, 800, 85, [], "ipfs://Qm", 0);

      const counts = await reefMonitor.getReefStatusCounts();
      expect(counts.critical).to.equal(1);
      expect(counts.poor).to.equal(1);
      expect(counts.fair).to.equal(1);
      expect(counts.good).to.equal(1);
      expect(counts.excellent).to.equal(1);
    });
  });

  describe("ConservationNFT", function () {
    it("Should mint NFT for donation", async function () {
      const tier = 0; // CORAL_SUPPORTER
      const price = await conservationNFT.tierPrices(tier);
      
      await conservationNFT.connect(user1).mintConservationNFT(tier, "reef-001", { value: price });
      
      expect(await conservationNFT.balanceOf(user1.address)).to.equal(1);
      expect(await conservationNFT.ownerOf(0)).to.equal(user1.address);
    });

    it("Should track user NFTs", async function () {
      const tier = 0;
      const price = await conservationNFT.tierPrices(tier);
      
      await conservationNFT.connect(user1).mintConservationNFT(tier, "reef-001", { value: price });
      await conservationNFT.connect(user1).mintConservationNFT(tier, "reef-002", { value: price });
      
      const userNFTs = await conservationNFT.getUserNFTs(user1.address);
      expect(userNFTs.length).to.equal(2);
    });

    it("Should give voting rights to Marine Savior holders", async function () {
      const tier = 3; // MARINE_SAVIOR
      const price = await conservationNFT.tierPrices(tier);
      
      await conservationNFT.connect(user1).mintConservationNFT(tier, "reef-001", { value: price });
      
      expect(await conservationNFT.hasVotingRights(user1.address)).to.be.true;
    });

    it("Should withdraw funds to conservation fund", async function () {
      const tier = 0;
      const price = await conservationNFT.tierPrices(tier);
      
      await conservationNFT.connect(user1).mintConservationNFT(tier, "reef-001", { value: price });
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      await conservationNFT.withdrawFunds();
      
      expect(await conservationNFT.getTotalDonations()).to.equal(0);
    });
  });

  describe("GuardianRewards", function () {
    beforeEach(async function () {
      // Fund the reward pool so transfers can succeed
      await owner.sendTransaction({
        to: await guardianRewards.getAddress(),
        value: ethers.parseEther("1.0")
      });
      await guardianRewards.connect(user1).registerGuardian(ethers.ZeroAddress);
    });

    it("Should register guardian", async function () {
      const stats = await guardianRewards.getGuardianStats(user1.address);
      expect(stats.totalPoints).to.equal(0);
      expect(stats.currentTier).to.equal(0); // SEEDLING
    });

    it("Should complete action and earn points", async function () {
      await guardianRewards.connect(user1).completeAction(0); // DATA_SUBMISSION
      
      const stats = await guardianRewards.getGuardianStats(user1.address);
      expect(stats.totalPoints).to.equal(10);
      expect(stats.actionsCompleted).to.equal(1);
    });

    it("Should upgrade tier after earning points", async function () {
      // Complete EMERGENCY_RESPONSE action for 200 points (no cooldown)
      await guardianRewards.connect(verifier).verifyAction(user1.address, 6); // EMERGENCY_RESPONSE = 200 points
      await guardianRewards.connect(verifier).verifyAction(user1.address, 6); // Another 200 points = 400 total
      
      const stats = await guardianRewards.getGuardianStats(user1.address);
      expect(stats.totalPoints).to.equal(400); // 200 + 200 (registered gives points too)
      expect(stats.currentTier).to.be.greaterThanOrEqual(1); // Should be at least CORAL_POLY
    });

    it("Should allow staking for reef protection", async function () {
      await guardianRewards.connect(user1).stakeForReef({ value: ethers.parseEther("0.5") });
      
      const stats = await guardianRewards.getGuardianStats(user1.address);
      expect(stats.stakedAmount).to.equal(ethers.parseEther("0.5"));
    });

    it("Should track referrals", async function () {
      await guardianRewards.connect(user2).registerGuardian(user1.address);
      
      const refCount = await guardianRewards.referralCount(user1.address);
      expect(refCount).to.equal(1);
    });
  });
});
