pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description; // Describes why the request is being created.
        uint value; // Amount of $ the manager wants to send to vendor.
        address recipient; // Address the money will be sent to.
        bool complete; // true if request has already been processed.
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    event ContributionMade(uint bal, uint amt, address addr);

    modifier restricted {
        require(msg.sender == manager, "Only manager can access this function.");
        _;
    }

    constructor(uint minContrib, address creator) public {
        manager = creator;
        minimumContribution = minContrib;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Contribution needs to be greater than minimum.");
        approvers[msg.sender] = true;
        approversCount++;
        emit ContributionMade(address(this).balance, msg.value, msg.sender);
    }

    function createRequest(string desc, uint val, address addr) public restricted {
        Request memory newReq = Request({
            description: desc,
            value: val,
            recipient: addr,
            complete: false,
            approvalCount: 0
        });
        requests.push(newReq);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], "Only approvers can approve a request.");
        require(!request.approvals[msg.sender], "Can only approve requests once.");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        request.complete = true;
        request.recipient.transfer(request.value);
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

//    function getAllRequests() public view returns (Request[]) {
//        return requests;
//    }

}
