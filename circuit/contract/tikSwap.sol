// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import './helpers/ITikSwap.sol';
import './noirstarter/plonk_vk.sol';

contract TikSwap {
    IERC20 public token;
    bytes32 public signThis;
    UltraVerifier public verifier;

    struct EventInfo {
        string title;
        string date;
        uint256 eventId;
        uint256 maxTickets;
        uint256 ticketCount;
        uint256 price;
    }

    mapping(uint256 => EventInfo) public eventInfo;
    mapping(uint256 => mapping(bytes32 => bool)) public nullifiers;
    mapping(uint256 => mapping(bytes32 => bool)) public intentNullifiers;
    mapping(uint256 => bytes32[]) private eventIntents;
    mapping(uint256 => uint256) private intentCount;

    uint256 public totalTicketsSold;
    uint256 public eventCounter;

    event TicketPurchased(uint256 indexed eventId, bytes32 indexed nullifier);
    event NewIntent(uint256 indexed eventId, bytes32 indexed nullifier);

    constructor(address tokenAddress, UltraVerifier _verifier) {
        token = IERC20(tokenAddress);
        verifier = _verifier;
    }

    modifier tokenGated() {
        require(token.balanceOf(msg.sender) >= 1, 'Token gating required');
        _;
    }

    //intention to stay on the waitlist for a secondary ticket exchange
    function submitIntent(uint256 _eventId, bytes32 _intentNullifier) external tokenGated {
        EventInfo storage _event = eventInfo[_eventId];
        require(_event.eventId != 0, 'Event does not exist');
        require(_event.ticketCount < _event.maxTickets, 'sold out');
        require(
            !intentNullifiers[_eventId][_intentNullifier],
            'nullifier has been spent for this event'
        );
        require(token.balanceOf(msg.sender) >= _event.price, 'Insufficient balance');
        intentNullifiers[_eventId][_intentNullifier] = true;
        eventIntents[_eventId].push(_intentNullifier);
        intentCount[_eventId]++;
        emit NewIntent(_eventId, _intentNullifier);
    }

    function offerTicket(
        bytes calldata proof,
        uint256 _eventId,
        bytes32 message,
        bytes32 _intentNullifier,
        bytes32 _sellersNullifier
    ) external tokenGated {
        EventInfo storage _event = eventInfo[_eventId];
        require(_event.eventId != 0, 'Event does not exist');

        require(
            intentNullifiers[_eventId][_intentNullifier],
            'Intent does not exist or nullifier has already been spent'
        );

        bytes32[] storage intents = eventIntents[_eventId];

        require(intents.length > 0, 'No intents available');

        uint256 randomIndex = random(intents.length);
        bytes32 selectedIntentNullifier = intents[randomIndex];

        require(_verifyProof(proof, message, msg.sender), 'invalid proof of ownership');

        swapTicket(_eventId, selectedIntentNullifier, _sellersNullifier);
        _event.ticketCount++;
        emit TicketPurchased(_eventId, selectedIntentNullifier);
    }

    function swapTicket(
        uint256 _eventId,
        bytes32 _intentNullifier,
        bytes32 _sellersNullifier
    ) internal {
        nullifiers[_eventId][_intentNullifier] = true;
        nullifiers[_eventId][_sellersNullifier] = false;
        intentNullifiers[_eventId][_intentNullifier] = false;
    }

    function addEvent(
        string memory _title,
        string memory _date,
        uint256 _eventId,
        uint256 _maxTickets,
        uint256 _price
    ) external {
        eventInfo[_eventId] = EventInfo(_title, _date, ++eventCounter, _maxTickets, 0, _price);
    }

    function purchaseTicket(uint256 _eventId, bytes32 _nullifier, uint256 _ticketId) external {
        EventInfo storage _event = eventInfo[_eventId];
        require(_event.eventId != 0, 'Event does not exist');
        require(_event.ticketCount < _event.maxTickets, 'sold out');
        require(!nullifiers[_eventId][_nullifier], 'nullifier has been spent for this event');
        require(token.balanceOf(msg.sender) >= _event.price, 'Insufficient balance');

        nullifiers[_eventId][_nullifier] = true;
        _event.ticketCount++;
        totalTicketsSold++;

        emit TicketPurchased(_eventId, _nullifier);
    }

    function verifyProof(
        bytes memory proof,
        bytes32 message,
        address sender
    ) external view returns (bool) {
        bytes32[] memory _publicInputs = new bytes32[](2);
        _publicInputs[0] = message;
        _publicInputs[1] = bytes32(uint256(uint160(sender)));
        return verifier.verify(proof, _publicInputs);
    }
    function _verifyProof(
        bytes calldata proof,
        bytes32 message,
        address sender
    ) internal view returns (bool) {
        bytes32[] memory _publicInputs = new bytes32[](2);
        _publicInputs[0] = message;
        _publicInputs[1] = bytes32(uint256(uint160(sender)));
        bool x = verifier.verify(proof, _publicInputs);
        return x;
    }

    function random(uint256 _mod) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % _mod;
    }
}
