// ITikSwap.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import './IERC20.sol';

interface ITikSwap {
    function submitIntent() external;

    function offerTicket() external;

    function addEvent(
        string memory _title,
        string memory _date,
        uint256 _eventId,
        uint256 _maxTickets,
        uint256 _price
    ) external;

    function purchaseTicket(uint256 _eventId, bytes32 _nullifier, uint256 _ticketId) external;
}
