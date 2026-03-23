// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ConservationNFT
 * @dev Fundraising NFTs for marine conservation
 * Part of CoralGuard - Marine Conservation Platform
 * 
 * Tiers:
 * - Coral Supporter (0.01 ETH): Basic supporter badge
 * - Reef Guardian (0.05 ETH): Rare coral artwork
 * - Ocean Champion (0.25 ETH): Exclusive marine life art
 * - Marine Savior (1.0 ETH): Legendary animated artwork + voting rights
 */
contract ConservationNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    
    enum Tier { CORAL_SUPPORTER, REEF_GUARDIAN, OCEAN_CHAMPION, MARINE_SAVIOR }
    
    struct NFTMetadata {
        Tier tier;
        string reefId;
        uint256 mintTimestamp;
        uint256 donationAmount;
    }
    
    // Tier configurations
    mapping(Tier => uint256) public tierPrices;
    mapping(Tier => uint256) public tierMaxSupply;
    mapping(Tier => uint256) public tierMinted;
    
    // Token metadata
    mapping(uint256 => NFTMetadata) public nftMetadata;
    
    // Token URI templates by tier
    mapping(Tier => string) public tierBaseURIs;
    
    // Funds recipient (conservation organization)
    address public conservationFund;
    
    // Counters
    uint256 private _tokenIdCounter;
    
    // Events
    event NFTMinted(
        address indexed minter,
        uint256 indexed tokenId,
        Tier tier,
        uint256 amount,
        string reefId
    );
    
    event FundsWithdrawn(address indexed to, uint256 amount);
    event ConservationFundUpdated(address indexed newFund);
    
    constructor(
        address _conservationFund
    ) ERC721("CoralGuard Conservation", "CORAL") Ownable(msg.sender) {
        conservationFund = _conservationFund;
        
        // Set tier prices (in wei)
        tierPrices[Tier.CORAL_SUPPORTER] = 0.01 ether;    // ~$25
        tierPrices[Tier.REEF_GUARDIAN] = 0.05 ether;      // ~$125
        tierPrices[Tier.OCEAN_CHAMPION] = 0.25 ether;     // ~$625
        tierPrices[Tier.MARINE_SAVIOR] = 1.0 ether;       // ~$2500
        
        // Set max supplies
        tierMaxSupply[Tier.CORAL_SUPPORTER] = 10000;
        tierMaxSupply[Tier.REEF_GUARDIAN] = 2000;
        tierMaxSupply[Tier.OCEAN_CHAMPION] = 500;
        tierMaxSupply[Tier.MARINE_SAVIOR] = 100;
    }
    
    /**
     * @dev Mint a conservation NFT
     */
    function mintConservationNFT(
        Tier _tier,
        string memory _reefId
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= tierPrices[_tier], "Insufficient payment");
        require(tierMinted[_tier] < tierMaxSupply[_tier], "Tier sold out");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Store metadata
        nftMetadata[tokenId] = NFTMetadata({
            tier: _tier,
            reefId: _reefId,
            mintTimestamp: block.timestamp,
            donationAmount: msg.value
        });
        
        tierMinted[_tier]++;
        
        // Generate unique URI
        string memory uri = generateTokenURI(tokenId, _tier);
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit NFTMinted(msg.sender, tokenId, _tier, msg.value, _reefId);
        
        return tokenId;
    }
    
    /**
     * @dev Generate token URI based on tier and tokenId
     */
    function generateTokenURI(uint256 _tokenId, Tier _tier) internal view returns (string memory) {
        // In production, this would generate dynamic metadata JSON
        // For now, we use tier-based base URIs with token ID
        return string(abi.encodePacked(
            tierBaseURIs[_tier],
            "/",
            _uintToString(_tokenId),
            ".json"
        ));
    }
    
    /**
     * @dev Set base URI for a tier
     */
    function setTierBaseURI(Tier _tier, string memory _uri) external onlyOwner {
        tierBaseURIs[_tier] = _uri;
    }
    
    /**
     * @dev Update conservation fund address
     */
    function setConservationFund(address _newFund) external onlyOwner {
        require(_newFund != address(0), "Invalid address");
        conservationFund = _newFund;
        emit ConservationFundUpdated(_newFund);
    }
    
    /**
     * @dev Withdraw funds to conservation organization
     */
    function withdrawFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(conservationFund).call{value: balance}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(conservationFund, balance);
    }
    
    /**
     * @dev Get user's NFTs
     */
    function getUserNFTs(address _user) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(_user);
        uint256[] memory tokens = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(_user, i);
        }
        
        return tokens;
    }
    
    /**
     * @dev Get NFTs by tier for a user
     */
    function getUserNFTsByTier(address _user, Tier _tier) external view returns (uint256[] memory) {
        uint256[] memory allTokens = getUserNFTs(_user);
        uint256 count = 0;
        
        // Count matching tokens
        for (uint256 i = 0; i < allTokens.length; i++) {
            if (nftMetadata[allTokens[i]].tier == _tier) {
                count++;
            }
        }
        
        // Build result array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allTokens.length; i++) {
            if (nftMetadata[allTokens[i]].tier == _tier) {
                result[index] = allTokens[i];
                index++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get tier stats
     */
    function getTierStats(Tier _tier) external view returns (
        uint256 price,
        uint256 maxSupply,
        uint256 minted,
        uint256 remaining
    ) {
        return (
            tierPrices[_tier],
            tierMaxSupply[_tier],
            tierMinted[_tier],
            tierMaxSupply[_tier] - tierMinted[_tier]
        );
    }
    
    /**
     * @dev Check if user has voting rights (Marine Savior tier)
     */
    function hasVotingRights(address _user) external view returns (bool) {
        uint256[] memory userTokens = getUserNFTs(_user);
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (nftMetadata[userTokens[i]].tier == Tier.MARINE_SAVIOR) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Get total donations raised
     */
    function getTotalDonations() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Override required functions
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    // Utility function
    function _uintToString(uint256 v) internal pure returns (string memory) {
        if (v == 0) return "0";
        uint256 j = v;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (v != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(v - (v / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            v /= 10;
        }
        return string(bstr);
    }
}
