// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Integration interface only. Member B implements WorldProtocol with ERC-721.
interface IWorldProtocol {
    function mintPassport() external;
    function balanceOf(address owner) external view returns (uint256);
    function registerModule(uint256 moduleId, string calldata name, address creator, uint256 priceWei) external;
    function modules(uint256 moduleId) external view returns (string memory name, address creator, uint256 priceWei, bool active);
    function treasury() external view returns (address);
    function hasAccess(address player, uint256 moduleId) external view returns (bool);
    function buyModule(uint256 moduleId) external payable;
    function pendingWithdrawals(address payee) external view returns (uint256);
    function withdraw() external;
}
