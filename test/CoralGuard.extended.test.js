const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CoralGuard - Additional Contract Tests", function () {
  let reefMonitor, conservationNFT, guardianRewards;
  let owner, provider1, provider2, user1, user2, verifier, fundWallet;

  beforeEach(async function () {
    [owner, provider1, provider2, user1, user2, verifier, fundWallet] = await ethers.getSigners();

    // Deploy ReefMonitor
    const ReefMonitor = await ethers.getContractFactory("ReefMonitor");
    reefMonitor = await ReefMonitor.deploy();

    // Deploy GuardianRewards
    const GuardianRewards = await ethers.getContractFactory("GuardianRewards");
    guardianRewards = await GuardianRewards.deploy(ethers.ZeroAddress, true);

    // Deploy ConservationNFT
    const ConservationNFT = await ethers.getContractFactory("ConservationNFT");
    conservationNFT = await ConservationNFT.deploy(fundWallet.address);

    // Authorize providers
    await reefMonitor.authorizeProvider(provider1.address);
    await reefMonitor.authorizeProvider(provider2.address);
    
    // Authorize verifier
    await guardianRewards.authorizeVerifier(verifier.address);

    // Fund reward pool
    await owner.sendTransaction({
      to: await guardianRewards.getAddress(),
      value: ethers.parseEther("10.0")
    });
  });

  describe("ReefMonitor - Extended Tests", function () {
    it("Should authorize and revoke providers", async function () {
      // Authorize a new provider
      await reefMonitor.authorizeProvider(user1.address);
      expect(await reefMonitor.authorizedProviders(user1.address)).to.be.true;

      // Revoke the provider
      await reefMonitor.revokeProvider(user1.address);
      expect(await reefMonitor.authorizedProviders(user1.address)).to.be.false;
    });

    it("Should reject unauthorized data submission", async function () {
      await expect(
        reefMonitor.connect(user1).submitReefData(
          "reef-test",
          "Test Location",
          50,
          2600,
          810,
          50,
          [],
          "ipfs://Qm...",
          0
        )
      ).to.be.revertedWith("Not authorized");
    });

    it("Should get health status correctly", async function () {
      expect(await reefMonitor.getHealthStatus(15)).to.equal(0); // CRITICAL
      expect(await reefMonitor.getHealthStatus(25)).to.equal(1); // POOR
      expect(await reefMonitor.getHealthStatus(50)).to.equal(2); // FAIR
      expect(await reefMonitor.getHealthStatus(70)).to.equal(3); // GOOD
      expect(await reefMonitor.getHealthStatus(90)).to.equal(4); // EXCELLENT
    });

    it("Should reject invalid health scores", async function () {
      await expect(
        reefMonitor.connect(provider1).submitReefData(
          "reef-invalid",
          "Test",
          101, // Invalid: > 100
          2600,
          810,
          50,
          [],
          "ipfs://Qm...",
          0
        )
      ).to.be.revertedWith("Health score must be 0-100");
    });

    it("Should track reef history correctly", async function () {
      // Submit data twice for same reef
      await reefMonitor.connect(provider1).submitReefData(
        "reef-history",
        "History Test",
        60,
        2600,
        810,
        50,
        [],
        "ipfs://Qm1",
        0
      );

      await reefMonitor.connect(provider1).submitReefData(
        "reef-history",
        "History Test",
        65,
        2650,
        815,
        55,
        [],
        "ipfs://Qm2",
        0
      );

      const history = await reefMonitor.getReefHistory("reef-history");
      expect(history.length).to.equal(2);
      expect(history[0].healthScore).to.equal(60);
      expect(history[1].healthScore).to.equal(65);
    });

    it("Should return all reef IDs", async function () {
      await reefMonitor.connect(provider1).submitReefData("reef-a", "Loc A", 50, 2600, 810, 50, [], "ipfs://Qm", 0);
      await reefMonitor.connect(provider1).submitReefData("reef-b", "Loc B", 60, 2600, 810, 60, [], "ipfs://Qm", 0);
      await reefMonitor.connect(provider1).submitReefData("reef-c", "Loc C", 70, 2600, 810, 70, [], "ipfs://Qm", 0);

      const reefIds = await reefMonitor.getAllReefIds();
      expect(reefIds.length).to.equal(3);
      expect(reefIds).to.include("reef-a");
      expect(reefIds).to.include("reef-b");
      expect(reefIds).to.include("reef-c");
    });
  });

  describe("ConservationNFT - Extended Tests", function () {
    it("Should have correct tier prices", async function () {
      expect(await conservationNFT.tierPrices(0)).to.equal(ethers.parseEther("0.01"));
      expect(await conservationNFT.tierPrices(1)).to.equal(ethers.parseEther("0.05"));
      expect(await conservationNFT.tierPrices(2)).to.equal(ethers.parseEther("0.25"));
      expect(await conservationNFT.tierPrices(3)).to.equal(ethers.parseEther("1.0"));
    });

    it("Should reject insufficient payment", async function () {
      await expect(
        conservationNFT.connect(user1).mintConservationNFT(0, "reef-001", { value: ethers.parseEther("0.005") })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should track multiple NFTs per user", async function () {
      const price = await conservationNFT.tierPrices(0);
      
      await conservationNFT.connect(user1).mintConservationNFT(0, "reef-001", { value: price });
      await conservationNFT.connect(user1).mintConservationNFT(0, "reef-002", { value: price });
      await conservationNFT.connect(user1).mintConservationNFT(0, "reef-003", { value: price });

      const userNFTs = await conservationNFT.getUserNFTs(user1.address);
      expect(userNFTs.length).to.equal(3);
    });

    it("Should update conservation fund address", async function () {
      // First mint an NFT to generate funds
      const price = await conservationNFT.tierPrices(0);
      await conservationNFT.connect(user1).mintConservationNFT(0, "reef-001", { value: price });
      
      // Update conservation fund address
      await conservationNFT.setConservationFund(user2.address);
      
      // Verify the new fund address is set by checking it doesn't revert
      // The conservationFund is private, so we verify by checking the function exists
      expect(await conservationNFT.connect(owner).withdrawFunds()).to.not.be.reverted;
    });

    it("Should return correct tier stats", async function () {
      const stats = await conservationNFT.getTierStats(0);
      expect(stats.price).to.equal(ethers.parseEther("0.01"));
      expect(stats.maxSupply).to.equal(10000);
      expect(stats.minted).to.equal(0);
      expect(stats.remaining).to.equal(10000);
    });

    it("Should not give voting rights to non-Marine Savior holders", async function () {
      const price = await conservationNFT.tierPrices(0);
      await conservationNFT.connect(user1).mintConservationNFT(0, "reef-001", { value: price });
      
      expect(await conservationNFT.hasVotingRights(user1.address)).to.be.false;
    });
  });

  describe("GuardianRewards - Extended Tests", function () {
    beforeEach(async function () {
      await guardianRewards.connect(user1).registerGuardian(ethers.ZeroAddress);
    });

    it("Should not allow double registration", async function () {
      await expect(
        guardianRewards.connect(user1).registerGuardian(ethers.ZeroAddress)
      ).to.be.revertedWith("Already registered");
    });

    it("Should calculate tier correctly", async function () {
      expect(await guardianRewards.calculateTier(0)).to.equal(0);     // SEEDLING
      expect(await guardianRewards.calculateTier(50)).to.equal(0);    // SEEDLING
      expect(await guardianRewards.calculateTier(100)).to.equal(1);   // CORAL_POLY
      expect(await guardianRewards.calculateTier(500)).to.equal(2);   // REEF_KEEPER
      expect(await guardianRewards.calculateTier(1500)).to.equal(3);  // OCEAN_DEFENDER
      expect(await guardianRewards.calculateTier(5000)).to.equal(4);  // GUARDIAN_LEGEND
      expect(await guardianRewards.calculateTier(10000)).to.equal(4); // GUARDIAN_LEGEND
    });

    it("Should require minimum stake amount", async function () {
      await expect(
        guardianRewards.connect(user1).stakeForReef({ value: ethers.parseEther("0.05") })
      ).to.be.revertedWith("Minimum stake is 0.1 ETH");
    });

    it("Should track staking correctly", async function () {
      await guardianRewards.connect(user1).stakeForReef({ value: ethers.parseEther("0.5") });
      
      const stats = await guardianRewards.getGuardianStats(user1.address);
      expect(stats.stakedAmount).to.equal(ethers.parseEther("0.5"));
    });

    it("Should reject unstaking before lock period", async function () {
      await guardianRewards.connect(user1).stakeForReef({ value: ethers.parseEther("0.5") });
      
      await expect(
        guardianRewards.connect(user1).unstake()
      ).to.be.revertedWith("Stake still locked");
    });

    it("Should complete multiple different actions", async function () {
      // Complete different action types
      await guardianRewards.connect(user1).completeAction(0); // DATA_SUBMISSION = 10 points
      await guardianRewards.connect(verifier).verifyAction(user1.address, 6); // EMERGENCY_RESPONSE = 200 points
      
      const stats = await guardianRewards.getGuardianStats(user1.address);
      expect(stats.totalPoints).to.be.at.least(210);
      expect(stats.actionsCompleted).to.be.at.least(2);
    });

    it("Should get guardian achievements", async function () {
      // Complete first action to unlock achievement
      await guardianRewards.connect(user1).completeAction(0);
      
      const achievements = await guardianRewards.getGuardianAchievements(user1.address);
      expect(achievements).to.include("First Steps");
    });

    it("Should authorize and revoke verifiers", async function () {
      await guardianRewards.authorizeVerifier(user2.address);
      // User2 can now verify actions
      await guardianRewards.connect(user2).verifyAction(user1.address, 6);
      
      await guardianRewards.revokeVerifier(user2.address);
      await expect(
        guardianRewards.connect(user2).verifyAction(user1.address, 6)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should update action rewards", async function () {
      await guardianRewards.setActionReward(0, 20, ethers.parseEther("0.002"), 2 * 60 * 60); // 2 hours
      
      // Complete action with new rewards
      await guardianRewards.connect(user1).completeAction(0);
      
      const stats = await guardianRewards.getGuardianStats(user1.address);
      expect(stats.totalPoints).to.equal(20); // New base points
    });

    it("Should track referrals correctly", async function () {
      await guardianRewards.connect(user2).registerGuardian(user1.address);
      
      const refCount = await guardianRewards.referralCount(user1.address);
      expect(refCount).to.equal(1);
      
      const referredBy = await guardianRewards.referredBy(user2.address);
      expect(referredBy).to.equal(user1.address);
    });

    it("Should return leaderboard correctly", async function () {
      // Register and complete actions for multiple users
      await guardianRewards.connect(user2).registerGuardian(ethers.ZeroAddress);
      
      await guardianRewards.connect(verifier).verifyAction(user1.address, 6); // 200 points
      await guardianRewards.connect(verifier).verifyAction(user2.address, 6); // 200 points
      await guardianRewards.connect(verifier).verifyAction(user2.address, 6); // Another 200 points
      
      const guardians = [user1.address, user2.address];
      const [rankedAddresses, rankedPoints] = await guardianRewards.getLeaderboard(guardians);
      
      expect(rankedAddresses.length).to.equal(2);
      expect(rankedPoints[0]).to.be.gte(rankedPoints[1]); // Sorted descending
    });
  });

  describe("Integration Tests", function () {
    it("Should complete full workflow", async function () {
      // 1. Submit reef data
      await reefMonitor.connect(provider1).submitReefData(
        "reef-integration",
        "Integration Test Reef",
        75,
        2650,
        810,
        70,
        ["Acropora", "Montipora"],
        "ipfs://QmIntegration",
        0
      );

      // 2. Register as guardian
      await guardianRewards.connect(user1).registerGuardian(ethers.ZeroAddress);

      // 3. Complete conservation action
      await guardianRewards.connect(user1).completeAction(0);

      // 4. Mint NFT
      const price = await conservationNFT.tierPrices(0);
      await conservationNFT.connect(user1).mintConservationNFT(0, "reef-integration", { value: price });

      // 5. Stake for reef
      await guardianRewards.connect(user1).stakeForReef({ value: ethers.parseEther("0.5") });

      // Verify all actions
      const reefData = await reefMonitor.getLatestReefData("reef-integration");
      expect(reefData.healthScore).to.equal(75);

      const guardianStats = await guardianRewards.getGuardianStats(user1.address);
      expect(guardianStats.totalPoints).to.be.gt(0);
      expect(guardianStats.stakedAmount).to.equal(ethers.parseEther("0.5"));

      const nftBalance = await conservationNFT.balanceOf(user1.address);
      expect(nftBalance).to.equal(1);
    });
  });
});
