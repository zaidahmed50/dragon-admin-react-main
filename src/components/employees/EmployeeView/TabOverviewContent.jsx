import React from 'react'
import {formatDate} from "../../../helper/helper.jsx";

// Helper to get designations array safely
const getDesignations = (employeeData) => {
    if (Array.isArray(employeeData?.designation) && employeeData.designation.length > 0) {
        return employeeData.designation;
    }
    return [];
};

// Helper to get unique department names from designations
const getDepartmentNames = (employeeData) => {
    const desigs = getDesignations(employeeData);
    if (desigs.length > 0) {
        return [...new Set(desigs.map(d => d.department?.name).filter(Boolean))];
    }
    return employeeData?.department?.name ? [employeeData.department.name] : [];
};

const TabOverviewContent = ({employeeData}) => {
    const designations = getDesignations(employeeData);
    const departmentNames = getDepartmentNames(employeeData);

    const informationData = employeeData ? [
        {label: 'Name', value: employeeData.name || 'N/A'},
        {label: 'Guardian Name', value: employeeData.sirName || 'N/A'},
        {label: 'Employee Code', value: employeeData.employeeCode || 'N/A'},
        {
            label: 'Department(s)',
            render: departmentNames.length > 0
                ? () => (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {departmentNames.map((name, i) => (
                            <span key={i} style={{
                                display: 'inline-block',
                                padding: '2px 10px',
                                borderRadius: '12px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                background: '#e8f0fe',
                                color: '#1a56db',
                                border: '1px solid #c7d9f8',
                            }}>{name}</span>
                        ))}
                    </div>
                )
                : null,
            value: departmentNames.length === 0 ? 'N/A' : null,
        },
        {
            label: 'Designation(s)',
            render: designations.length > 0
                ? () => (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {designations.map((d, i) => (
                            <span key={i} style={{
                                display: 'inline-block',
                                padding: '2px 10px',
                                borderRadius: '12px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                background: '#fef3c7',
                                color: '#92400e',
                                border: '1px solid #fde68a',
                            }}>
                                {d.name}
                                {d.department?.name && (
                                    <span style={{ fontWeight: 400, color: '#b45309', marginLeft: 4 }}>
                                        · {d.department.name}
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                )
                : null,
            value: designations.length === 0
                ? (employeeData.designation?.name || 'N/A')
                : null,
        },
        {label: 'Office Location', value: employeeData.officesLocations?.officeName || 'N/A'},
        {label: 'Division', value: employeeData.division || 'N/A'},
        {label: 'Date of Birth', value: formatDate(employeeData.dob) || 'N/A'},
        {label: 'Mobile Number 1', value: employeeData.phone1 || 'N/A'},
        {label: 'Mobile Number 2', value: employeeData.phone2 || 'N/A'},
        {label: 'Mobile Number 3', value: employeeData.phone3 || 'N/A'},
        {label: 'Emergency Contact Person', value: employeeData.emergencyContactName || 'N/A'},
        {label: 'Emergency Contact ', value: employeeData.emergencyContactNo || 'N/A'},
        {label: 'Email Address', value: employeeData.email || 'N/A'},
        {label: 'Referred By', value: employeeData.referredBy || 'N/A'},
        {label: 'CNIC', value: employeeData.uuid || 'N/A'},
        {label: 'Permanent Address', value: employeeData.permanentAddress || 'N/A'},
        {label: 'Temporary Address', value: employeeData.temporaryAddress || 'N/A'},
        {label: 'Basic Salary Per Month', value: employeeData.basicSalaryPerMonth || 'N/A'},
        {label: 'Blood Group', value: employeeData.bloodGroup || 'N/A'},
        {label: 'Education', value: employeeData.education || 'N/A'},
        {label: 'Joining Date', value: employeeData.joiningDate || 'N/A'},
        {label: 'Duty Start Time', value: employeeData.dutyStartTime || 'N/A'},
        {label: 'Duty End Time', value: employeeData.dutyEndTime || 'N/A'},
        {label: 'Status', value: employeeData.userStatus || 'N/A'},
        {label: 'User ID', value: employeeData.userId || 'N/A'},
    ] : [
        {label: 'Full Name', value: 'Alexandra Della'},
        {label: 'Surname', value: 'Della'},
        {label: 'Company', value: 'Theme Ocean'},
        {label: 'Date of Birth', value: '26 May, 2000'},
        {label: 'Mobile Number', value: '+01 (375) 5896 3214'},
        {label: 'Email Address', value: 'alex.della@outlook.com'},
        {label: 'Location', value: 'California, United States'},
        {label: 'Joining Date', value: '20 Dec, 2023'},
        {label: 'Country', value: 'United States'},
        {label: 'Communication', value: 'Email, Phone'},
        {label: 'Allow Changes', value: 'YES'},
        {label: 'Website', value: 'https://themeforest.net/user/theme_ocean'},
    ];

    return (
        <div
            className="tab-pane fade show active p-4"
            id="overviewTab"
            role="tabpanel"
        >
            <div className="about-section mb-5">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Employee Profile:</h5>
                </div>
                <>
                    <p>
                        <strong>{employeeData.name}</strong> is an employee at our organization
                        {designations.length > 0 && (
                            <> working as <strong>{designations.map(d => d.name).filter(Boolean).join(', ')}</strong></>
                        )}
                        {departmentNames.length > 0 && (
                            <> in <strong>{departmentNames.join(', ')}</strong></>
                        )}.
                        {employeeData.joiningDate && ` They joined the company on ${employeeData.joiningDate}.`}
                        {employeeData.officesLocations?.officeName && ` They are currently working at ${employeeData.officesLocations.officeName}.`}
                    </p>
                    {employeeData.education && (
                        <p>
                            Educational Background: {employeeData.education}
                        </p>
                    )}
                    <p>
                        {employeeData.name} is dedicated to their role and contributes significantly
                        to the team's success. They
                        maintain {employeeData.userStatus === 'Active' ? 'an active' : 'a'} status
                        within the organization.
                    </p>
                </>
            </div>

            <div className="profile-details mb-5">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Employee Details:</h5>
                </div>
                {informationData.map((item, index) => (
                    <div key={index} className={`row g-0 ${index === informationData.length - 1 ? 'mb-0' : 'mb-4'}`}>
                        <div className="col-sm-6 text-muted">{item.label}:</div>
                        <div className="col-sm-6 fw-semibold">
                            {item.render ? item.render() : item.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TabOverviewContent
