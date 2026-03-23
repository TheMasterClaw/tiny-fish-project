// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ReefMonitor
 * @dev On-chain storage for reef health data from AI sensors and satellite imagery
 * Part of CoralGuard - Marine Conservation Platform
 */
contract ReefMonitor is Ownable, ReentrancyGuard {
    
    struct ReefData {
        string reefId;
        string location;
        uint256 healthScore;
        uint256 temperature;
        uint256 phLevel;
        uint256 coralCoverage;
        string[] speciesDetected;
        string imageHash;
        uint256 timestamp;
        address reporter;
        DataSource source;
    }
    
    enum DataSource { SENSOR, SATELLITE, DIVER_REPORT, AI_ANALYSIS }
    enum HealthStatus { CRITICAL, POOR, FAIR, GOOD, EXCELLENT }
    
    // Reef ID => Latest Data
    mapping(string => ReefData) public reefData;
    
    // Reef ID => Historical Data Array
    mapping(string => ReefData[]) public reefHistory;
    
    // Authorized data providers (AI agents, sensors, verified divers)
    mapping(address => bool) public authorizedProviders;
    
    // All reef IDs
    string[] public reefIds;
    
    // Global stats
    uint256 public totalReefs;
    uint256 public totalDataPoints;
    
    // Events
    event ReefDataUpdated(
        string indexed reefId,
        uint256 healthScore,
        uint256 timestamp,
        address reporter,
        DataSource source
    );
    
    event HealthAlert(string indexed reefId, HealthStatus status, uint256 timestamp);
    event ProviderAuthorized(address indexed provider);
    event ProviderRevoked(address indexed provider);
    
    constructor() Ownable(msg.sender) {}
    
    modifier onlyAuthorized() {
        require(authorizedProviders[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    /**
     * @dev Authorize a new data provider (AI agent, sensor, verified diver)
     */
    function authorizeProvider(address provider) external onlyOwner {
        authorizedProviders[provider] = true;
        emit ProviderAuthorized(provider);
    }
    
    /**
     * @dev Revoke data provider authorization
     */
    function revokeProvider(address provider) external onlyOwner {
        authorizedProviders[provider] = false;
        emit ProviderRevoked(provider);
    }
    
    /**
     * @dev Submit new reef health data
     */
    function submitReefData(
        string memory _reefId,
        string memory _location,
        uint256 _healthScore,
        uint256 _temperature,
        uint256 _phLevel,
        uint256 _coralCoverage,
        string[] memory _speciesDetected,
        string memory _imageHash,
        DataSource _source
    ) external onlyAuthorized nonReentrant {
        require(_healthScore <= 100, "Health score must be 0-100");
        require(_phLevel >= 0 && _phLevel <= 1400, "pH level must be 0-14 (x100 for precision)");
        
        // Create new data entry
        ReefData memory newData = ReefData({
            reefId: _reefId,
            location: _location,
            healthScore: _healthScore,
            temperature: _temperature,
            phLevel: _phLevel,
            coralCoverage: _coralCoverage,
            speciesDetected: _speciesDetected,
            imageHash: _imageHash,
            timestamp: block.timestamp,
            reporter: msg.sender,
            source: _source
        });
        
        // Update current data
        reefData[_reefId] = newData;
        
        // Add to history
        reefHistory[_reefId].push(newData);
        
        // Track new reef
        if (reefHistory[_reefId].length == 1) {
            reefIds.push(_reefId);
            totalReefs++;
        }
        
        totalDataPoints++;
        
        // Check for health alerts
        HealthStatus status = getHealthStatus(_healthScore);
        if (status == HealthStatus.CRITICAL || status == HealthStatus.POOR) {
            emit HealthAlert(_reefId, status, block.timestamp);
        }
        
        emit ReefDataUpdated(_reefId, _healthScore, block.timestamp, msg.sender, _source);
    }
    
    /**
     * @dev Get health status from score
     */
    function getHealthStatus(uint256 score) public pure returns (HealthStatus) {
        if (score < 20) return HealthStatus.CRITICAL;
        if (score < 40) return HealthStatus.POOR;
        if (score < 60) return HealthStatus.FAIR;
        if (score < 80) return HealthStatus.GOOD;
        return HealthStatus.EXCELLENT;
    }
    
    /**
     * @dev Get reef data history
     */
    function getReefHistory(string memory _reefId) external view returns (ReefData[] memory) {
        return reefHistory[_reefId];
    }
    
    /**
     * @dev Get latest reef data
     */
    function getLatestReefData(string memory _reefId) external view returns (ReefData memory) {
        return reefData[_reefId];
    }
    
    /**
     * @dev Get all reef IDs
     */
    function getAllReefIds() external view returns (string[] memory) {
        return reefIds;
    }
    
    /**
     * @dev Get reef count by status
     */
    function getReefStatusCounts() external view returns (
        uint256 critical,
        uint256 poor,
        uint256 fair,
        uint256 good,
        uint256 excellent
    ) {
        for (uint i = 0; i < reefIds.length; i++) {
            HealthStatus status = getHealthStatus(reefData[reefIds[i]].healthScore);
            if (status == HealthStatus.CRITICAL) critical++;
            else if (status == HealthStatus.POOR) poor++;
            else if (status == HealthStatus.FAIR) fair++;
            else if (status == HealthStatus.GOOD) good++;
            else excellent++;
        }
    }
    
    /**
     * @dev Batch submit reef data for multiple reefs
     */
    function batchSubmitReefData(ReefData[] memory _dataBatch) external onlyAuthorized {
        for (uint i = 0; i < _dataBatch.length; i++) {
            this.submitReefData(
                _dataBatch[i].reefId,
                _dataBatch[i].location,
                _dataBatch[i].healthScore,
                _dataBatch[i].temperature,
                _dataBatch[i].phLevel,
                _dataBatch[i].coralCoverage,
                _dataBatch[i].speciesDetected,
                _dataBatch[i].imageHash,
                _dataBatch[i].source
            );
        }
    }
}
