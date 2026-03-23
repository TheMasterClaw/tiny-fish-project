// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title GuardianRewards
 * @dev Rewards system for conservation actions
 * Part of CoralGuard - Marine Conservation Platform
 * 
 * Actions rewarded:
 * - Data submission (verified reports)
 * - Cleanup events participation
 * - Conservation project completion
 * - Community referrals
 * - Staking for reef protection
 */
contract GuardianRewards is Ownable, ReentrancyGuard {
    
    enum ActionType { 
        DATA_SUBMISSION, 
        CLEANUP_EVENT, 
        PROJECT_COMPLETION, 
        REFERRAL, 
        STAKING,
        AI_VERIFICATION,
        EMERGENCY_RESPONSE
    }
    
    enum BadgeTier { 
        SEEDLING,      // 0-99 points
        CORAL_POLY,   // 100-499 points  
        REEF_KEEPER,  // 500-1499 points
        OCEAN_DEFENDER, // 1500-4999 points
        GUARDIAN_LEGEND // 5000+ points
    }
    
    struct Guardian {
        uint256 totalPoints;
        uint256 actionsCompleted;
        uint256 stakedAmount;
        uint256 stakingStartTime;
        BadgeTier currentTier;
        mapping(ActionType => uint256) actionCounts;
        string[] achievements;
        bool isActive;
    }
    
    struct ActionReward {
        uint256 basePoints;
        uint256 tokenReward;
        uint256 cooldownPeriod;
    }
    
    // Guardian data
    mapping(address => Guardian) public guardians;
    
    // Action configuration
    mapping(ActionType => ActionReward) public actionRewards;
    
    // Cooldown tracking (user => action => last completion time)
    mapping(address => mapping(ActionType => uint256)) public lastActionTime;
    
    // Reward token (can be native ETH or ERC20)
    IERC20 public rewardToken;
    bool public useNativeToken;
    
    // Minimum stake for protection
    uint256 public constant MIN_STAKE_AMOUNT = 0.1 ether;
    uint256 public constant STAKE_LOCK_PERIOD = 30 days;
    
    // Achievement thresholds
    uint256[5] public tierThresholds = [0, 100, 500, 1500, 5000];
    
    // Referral tracking
    mapping(address => address) public referredBy;
    mapping(address => uint256) public referralCount;
    
    // Authorized verifiers (AI agents, project leads)
    mapping(address => bool) public authorizedVerifiers;
    
    // Events
    event ActionCompleted(
        address indexed guardian,
        ActionType actionType,
        uint256 points,
        uint256 reward,
        uint256 timestamp
    );
    
    event GuardianRegistered(address indexed guardian, uint256 timestamp);
    event TierUpgraded(address indexed guardian, BadgeTier newTier);
    event Staked(address indexed guardian, uint256 amount);
    event Unstaked(address indexed guardian, uint256 amount);
    event AchievementUnlocked(address indexed guardian, string achievement);
    event ReferralCompleted(address indexed referrer, address indexed referee);
    
    constructor(address _rewardToken, bool _useNativeToken) Ownable(msg.sender) {
        rewardToken = IERC20(_rewardToken);
        useNativeToken = _useNativeToken;
        
        // Initialize action rewards
        actionRewards[ActionType.DATA_SUBMISSION] = ActionReward(10, 0.001 ether, 1 hours);
        actionRewards[ActionType.CLEANUP_EVENT] = ActionReward(50, 0.005 ether, 1 days);
        actionRewards[ActionType.PROJECT_COMPLETION] = ActionReward(100, 0.01 ether, 7 days);
        actionRewards[ActionType.REFERRAL] = ActionReward(25, 0.002 ether, 0);
        actionRewards[ActionType.STAKING] = ActionReward(5, 0, 1 days); // Per day staked
        actionRewards[ActionType.AI_VERIFICATION] = ActionReward(20, 0.002 ether, 0);
        actionRewards[ActionType.EMERGENCY_RESPONSE] = ActionReward(200, 0.02 ether, 0);
    }
    
    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    modifier guardianExists() {
        require(guardians[msg.sender].isActive, "Guardian not registered");
        _;
    }
    
    /**
     * @dev Register as a new guardian
     */
    function registerGuardian(address _referrer) external {
        require(!guardians[msg.sender].isActive, "Already registered");
        
        guardians[msg.sender].isActive = true;
        guardians[msg.sender].currentTier = BadgeTier.SEEDLING;
        
        // Handle referral
        if (_referrer != address(0) && _referrer != msg.sender && guardians[_referrer].isActive) {
            referredBy[msg.sender] = _referrer;
            referralCount[_referrer]++;
            
            // Reward referrer
            _completeAction(_referrer, ActionType.REFERRAL);
            emit ReferralCompleted(_referrer, msg.sender);
        }
        
        emit GuardianRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Complete a conservation action and earn rewards
     */
    function completeAction(ActionType _actionType) external guardianExists nonReentrant {
        _completeAction(msg.sender, _actionType);
    }
    
    /**
     * @dev Complete action for a user (verifier only)
     */
    function verifyAction(address _guardian, ActionType _actionType) external onlyVerifier nonReentrant {
        require(guardians[_guardian].isActive, "Guardian not registered");
        _completeAction(_guardian, _actionType);
    }
    
    /**
     * @dev Internal function to complete action
     */
    function _completeAction(address _guardian, ActionType _actionType) internal {
        ActionReward memory reward = actionRewards[_actionType];
        
        // Check cooldown (except for emergency response)
        if (reward.cooldownPeriod > 0 && _actionType != ActionType.EMERGENCY_RESPONSE) {
            require(
                block.timestamp >= lastActionTime[_guardian][_actionType] + reward.cooldownPeriod,
                "Action on cooldown"
            );
        }
        
        // Update guardian stats
        Guardian storage guardian = guardians[_guardian];
        guardian.totalPoints += reward.basePoints;
        guardian.actionsCompleted++;
        guardian.actionCounts[_actionType]++;
        lastActionTime[_guardian][_actionType] = block.timestamp;
        
        // Check for tier upgrade
        BadgeTier newTier = calculateTier(guardian.totalPoints);
        if (newTier > guardian.currentTier) {
            guardian.currentTier = newTier;
            emit TierUpgraded(_guardian, newTier);
        }
        
        // Check for achievements
        _checkAchievements(_guardian, _actionType);
        
        // Distribute reward tokens
        if (reward.tokenReward > 0) {
            _distributeReward(_guardian, reward.tokenReward);
        }
        
        emit ActionCompleted(_guardian, _actionType, reward.basePoints, reward.tokenReward, block.timestamp);
    }
    
    /**
     * @dev Stake ETH to protect a reef
     */
    function stakeForReef() external payable guardianExists nonReentrant {
        require(msg.value >= MIN_STAKE_AMOUNT, "Minimum stake is 0.1 ETH");
        
        Guardian storage guardian = guardians[msg.sender];
        
        // If already staking, add to existing stake
        if (guardian.stakedAmount > 0) {
            // Claim pending rewards first
            _claimStakingRewards(msg.sender);
        } else {
            guardian.stakingStartTime = block.timestamp;
        }
        
        guardian.stakedAmount += msg.value;
        
        emit Staked(msg.sender, msg.value);
    }
    
    /**
     * @dev Unstake ETH after lock period
     */
    function unstake() external guardianExists nonReentrant {
        Guardian storage guardian = guardians[msg.sender];
        require(guardian.stakedAmount > 0, "No stake to withdraw");
        require(
            block.timestamp >= guardian.stakingStartTime + STAKE_LOCK_PERIOD,
            "Stake still locked"
        );
        
        // Claim final rewards
        _claimStakingRewards(msg.sender);
        
        uint256 amount = guardian.stakedAmount;
        guardian.stakedAmount = 0;
        guardian.stakingStartTime = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @dev Claim staking rewards
     */
    function claimStakingRewards() external guardianExists nonReentrant {
        _claimStakingRewards(msg.sender);
    }
    
    /**
     * @dev Internal function to claim staking rewards
     */
    function _claimStakingRewards(address _guardian) internal {
        Guardian storage guardian = guardians[_guardian];
        if (guardian.stakedAmount == 0) return;
        
        uint256 daysStaked = (block.timestamp - guardian.stakingStartTime) / 1 days;
        if (daysStaked > 0) {
            uint256 reward = daysStaked * guardian.stakedAmount / 1000; // 0.1% per day
            guardian.stakingStartTime = block.timestamp;
            
            if (reward > 0) {
                _distributeReward(_guardian, reward);
                guardian.totalPoints += daysStaked * actionRewards[ActionType.STAKING].basePoints;
            }
        }
    }
    
    /**
     * @dev Distribute reward tokens
     */
    function _distributeReward(address _to, uint256 _amount) internal {
        if (useNativeToken) {
            (bool success, ) = payable(_to).call{value: _amount}("");
            require(success, "Reward transfer failed");
        } else {
            require(rewardToken.transfer(_to, _amount), "Token transfer failed");
        }
    }
    
    /**
     * @dev Check and award achievements
     */
    function _checkAchievements(address _guardian, ActionType _actionType) internal {
        Guardian storage guardian = guardians[_guardian];
        
        // First Action
        if (guardian.actionsCompleted == 1) {
            _unlockAchievement(_guardian, "First Steps");
        }
        
        // Data Master
        if (guardian.actionCounts[ActionType.DATA_SUBMISSION] == 10) {
            _unlockAchievement(_guardian, "Data Master");
        }
        
        // Cleanup Hero
        if (guardian.actionCounts[ActionType.CLEANUP_EVENT] == 5) {
            _unlockAchievement(_guardian, "Cleanup Hero");
        }
        
        // Referral Champion
        if (referralCount[_guardian] == 10) {
            _unlockAchievement(_guardian, "Community Builder");
        }
        
        // Staking Whale
        if (guardian.stakedAmount >= 1 ether) {
            _unlockAchievement(_guardian, "Reef Protector");
        }
    }
    
    /**
     * @dev Unlock achievement for guardian
     */
    function _unlockAchievement(address _guardian, string memory _achievement) internal {
        guardians[_guardian].achievements.push(_achievement);
        emit AchievementUnlocked(_guardian, _achievement);
    }
    
    /**
     * @dev Calculate tier from points
     */
    function calculateTier(uint256 _points) public view returns (BadgeTier) {
        for (uint i = tierThresholds.length; i > 0; i--) {
            if (_points >= tierThresholds[i-1]) {
                return BadgeTier(i-1);
            }
        }
        return BadgeTier.SEEDLING;
    }
    
    /**
     * @dev Authorize a verifier
     */
    function authorizeVerifier(address _verifier) external onlyOwner {
        authorizedVerifiers[_verifier] = true;
    }
    
    /**
     * @dev Revoke verifier authorization
     */
    function revokeVerifier(address _verifier) external onlyOwner {
        authorizedVerifiers[_verifier] = false;
    }
    
    /**
     * @dev Update action reward
     */
    function setActionReward(
        ActionType _actionType,
        uint256 _basePoints,
        uint256 _tokenReward,
        uint256 _cooldown
    ) external onlyOwner {
        actionRewards[_actionType] = ActionReward(_basePoints, _tokenReward, _cooldown);
    }
    
    /**
     * @dev Get guardian stats
     */
    function getGuardianStats(address _guardian) external view returns (
        uint256 totalPoints,
        uint256 actionsCompleted,
        uint256 stakedAmount,
        BadgeTier currentTier,
        uint256 referralCount_
    ) {
        Guardian storage g = guardians[_guardian];
        return (
            g.totalPoints,
            g.actionsCompleted,
            g.stakedAmount,
            g.currentTier,
            referralCount[_guardian]
        );
    }
    
    /**
     * @dev Get guardian achievements
     */
    function getGuardianAchievements(address _guardian) external view returns (string[] memory) {
        return guardians[_guardian].achievements;
    }
    
    /**
     * @dev Get leaderboard (top guardians by points)
     */
    function getLeaderboard(address[] memory _guardians) external view returns (
        address[] memory rankedAddresses,
        uint256[] memory rankedPoints
    ) {
        // Simple bubble sort for small arrays
        uint256 n = _guardians.length;
        rankedAddresses = new address[](n);
        rankedPoints = new uint256[](n);
        
        for (uint i = 0; i < n; i++) {
            rankedAddresses[i] = _guardians[i];
            rankedPoints[i] = guardians[_guardians[i]].totalPoints;
        }
        
        for (uint i = 0; i < n - 1; i++) {
            for (uint j = 0; j < n - i - 1; j++) {
                if (rankedPoints[j] < rankedPoints[j + 1]) {
                    // Swap points
                    uint256 tempPoints = rankedPoints[j];
                    rankedPoints[j] = rankedPoints[j + 1];
                    rankedPoints[j + 1] = tempPoints;
                    
                    // Swap addresses
                    address tempAddr = rankedAddresses[j];
                    rankedAddresses[j] = rankedAddresses[j + 1];
                    rankedAddresses[j + 1] = tempAddr;
                }
            }
        }
        
        return (rankedAddresses, rankedPoints);
    }
    
    /**
     * @dev Fund the reward pool
     */
    function fundRewardPool() external payable onlyOwner {
        // ETH automatically added to contract balance
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    receive() external payable {}
}
