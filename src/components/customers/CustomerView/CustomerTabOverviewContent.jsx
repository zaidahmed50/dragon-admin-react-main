
const CustomerTabOverviewContent = ({customerData}) => {
    // Determine if it's a business customer based on business-specific fields
    const isBusiness = customerData && (customerData.ntnScan || customerData.shortName || customerData.pocName);

    const informationData = customerData ? [
        {label: isBusiness ? 'Business Name' : 'Full Name', value: customerData.name || 'N/A'},
        {label: 'Customer Code', value: customerData.referenceNumber || 'N/A'},
        {label: 'Mobile Number 1', value: customerData.phone1 || 'N/A'},
        {label: 'Mobile Number 2', value: customerData.phone2 || 'N/A'},
        {label: 'Mobile Number 3', value: customerData.phone3 || 'N/A'},
        {label: 'Email Address', value: customerData.email || 'N/A'},
        // Conditional fields based on type
        ...(isBusiness ? [
            {label: 'POC Name', value: customerData.pocName || 'N/A'},
            {label: 'Short Name', value: customerData.shortName || 'N/A'},
            {label: 'NTN', value: 'Available (See Docs)'} // Assuming NTN number isn't directly in this response, but scan is
        ] : [
            {label: 'Guardian Name', value: customerData.sirName || 'N/A'},
            {label: 'CNIC', value: customerData.uuid || 'N/A'},
        ]),
        // {label: 'Address', value: customerData.address || 'N/A'},
        {label: 'Remarks', value: customerData.remarks || 'N/A'},
        {label: 'Status', value: customerData.userStatus || 'N/A'},
        {label: 'Customer ID', value: customerData.userId || 'N/A'},
    ] : [
        {label: 'Full Name', value: 'N/A'},
        {label: 'Mobile Number', value: 'N/A'},
        {label: 'Email Address', value: 'N/A'},
        {label: 'Location', value: 'N/A'},
    ];
    
    return (
        <div
            className="tab-pane fade p-4"
            id="overviewTab"
            role="tabpanel"
        >
            <div className="about-section mb-5">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Customer Profile:</h5>
                </div>
                {customerData ? (
                    <>
                        <p>
                            <strong>{customerData.name}</strong> is a valued {isBusiness ? 'business partner' : 'customer'} of our organization.
                            {customerData.referenceNumber && ` Customer Reference: ${customerData.referenceNumber}.`}
                        </p>
                        {customerData.remarks && (
                            <p>
                                Additional Notes: {customerData.remarks}
                            </p>
                        )}
                        <p>
                            {customerData.name} maintains {customerData.userStatus === 'Active' ? 'an active' : 'a'} status
                            with our organization.
                        </p>
                    </>
                ) : (
                    <p>No customer information available.</p>
                )}
            </div>

            <div className="profile-details mb-5">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Customer Details:</h5>
                </div>
                {informationData.map((item, index) => (
                    <div key={index} className={`row g-0 ${index === informationData.length - 1 ? 'mb-0' : 'mb-4'}`}>
                        <div className="col-sm-6 text-muted">{item.label}:</div>
                        <div className="col-sm-6 fw-semibold">{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CustomerTabOverviewContent
