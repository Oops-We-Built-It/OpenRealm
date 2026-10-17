// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

/// @notice Aetheria Passport, module permissions and pull-payment revenue ledger.
/// @dev Implements the ABI in IWorldProtocol; purchases stay with wallets on NFT transfer.
contract WorldProtocol is ERC721, Ownable2Step, ReentrancyGuard {
    struct Module { string name; address creator; uint256 priceWei; bool active; }
    uint256 public constant worldId = 1;
    uint256 public totalSupply;
    address public immutable treasury;
    mapping(address => bool) public hasMinted;
    mapping(uint256 => Module) public modules;
    mapping(uint256 => bool) public moduleExists;
    mapping(address => mapping(uint256 => bool)) public purchased;
    mapping(address => uint256) public pendingWithdrawals;

    error ZeroAddress();
    error AlreadyMinted();
    error InvalidModule();
    error ModuleAlreadyRegistered();
    error PassportRequired();
    error AlreadyPurchased();
    error IncorrectPayment(uint256 expected, uint256 received);
    error NothingToWithdraw();
    error WithdrawalFailed();

    event PassportMinted(address indexed player, uint256 indexed tokenId);
    event ModuleRegistered(uint256 indexed moduleId, string name, address indexed creator, uint256 priceWei);
    event ModuleActivityChanged(uint256 indexed moduleId, bool active);
    event ModulePurchased(address indexed player, uint256 indexed moduleId, uint256 priceWei, uint256 creatorShare, uint256 treasuryShare);
    event Withdrawal(address indexed payee, uint256 amount);

    constructor(address initialOwner, address treasuryAddress)
        ERC721("OpenRealm World Passport", "REALM") Ownable(initialOwner)
    {
        if (treasuryAddress == address(0)) revert ZeroAddress();
        treasury = treasuryAddress;
    }

    /// @notice Free mint; each address may mint once, including after transferring away.
    function mintPassport() external nonReentrant {
        if (hasMinted[msg.sender]) revert AlreadyMinted();
        hasMinted[msg.sender] = true;
        uint256 tokenId = ++totalSupply;
        _safeMint(msg.sender, tokenId);
        emit PassportMinted(msg.sender, tokenId);
    }

    function registerModule(uint256 moduleId, string calldata name, address creator, uint256 priceWei) external onlyOwner {
        if (creator == address(0)) revert ZeroAddress();
        if (moduleId == 0 || bytes(name).length == 0) revert InvalidModule();
        if (moduleExists[moduleId]) revert ModuleAlreadyRegistered();
        moduleExists[moduleId] = true;
        modules[moduleId] = Module(name, creator, priceWei, true);
        emit ModuleRegistered(moduleId, name, creator, priceWei);
    }

    /// @notice Disabling access never prevents payees from withdrawing earned funds.
    function setModuleActive(uint256 moduleId, bool active) external onlyOwner {
        if (!moduleExists[moduleId]) revert InvalidModule();
        modules[moduleId].active = active;
        emit ModuleActivityChanged(moduleId, active);
    }

    function hasAccess(address player, uint256 moduleId) external view returns (bool) {
        Module storage m = modules[moduleId];
        return player != address(0) && m.active && balanceOf(player) > 0
            && (m.priceWei == 0 || purchased[player][moduleId]);
    }

    function buyModule(uint256 moduleId) external payable nonReentrant {
        Module storage m = modules[moduleId];
        if (!m.active) revert InvalidModule();
        if (balanceOf(msg.sender) == 0) revert PassportRequired();
        if (purchased[msg.sender][moduleId]) revert AlreadyPurchased();
        if (msg.value != m.priceWei) revert IncorrectPayment(m.priceWei, msg.value);
        purchased[msg.sender][moduleId] = true;
        uint256 creatorShare = Math.mulDiv(msg.value, 80, 100);
        uint256 treasuryShare = msg.value - creatorShare;
        pendingWithdrawals[m.creator] += creatorShare;
        pendingWithdrawals[treasury] += treasuryShare;
        emit ModulePurchased(msg.sender, moduleId, msg.value, creatorShare, treasuryShare);
    }

    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        if (amount == 0) revert NothingToWithdraw();
        pendingWithdrawals[msg.sender] = 0;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        if (!success) revert WithdrawalFailed();
        emit Withdrawal(msg.sender, amount);
    }
}
