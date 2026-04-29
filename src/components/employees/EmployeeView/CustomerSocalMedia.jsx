import { FiPhone, FiMail, FiCalendar, FiClock, FiBriefcase } from 'react-icons/fi'
import {handleWhatsAppClick} from "../../../helper/whatsAppLauncher.js";

const CustomerSocalMedia = ({ employeeData }) => {
    if (!employeeData) {
        return (
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Contact Information</h5>
                </div>
                <div className="card-body">
                    <div className="text-center text-muted py-3">
                        <p>No employee data available</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title">Contact Information</h5>
            </div>
            <div className="card-body">
                {employeeData.phone1 && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <FiPhone size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault(); // prevent default anchor navigation
                                handleWhatsAppClick(employeeData.phone1); // open WhatsApp
                            }}
                            className="text-truncate-1-line"
                            style={{ cursor: 'pointer', color: '#25D366' }} // WhatsApp green
                        >
                            <span className="text-muted">Phone 1:</span> {employeeData.phone1}
                        </a>
                    </div>
                )}


                {employeeData.phone2 && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <FiPhone size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault(); // prevent default anchor navigation
                                handleWhatsAppClick(employeeData.phone2); // open WhatsApp
                            }}
                            className="text-truncate-1-line"
                            style={{ cursor: 'pointer', color: '#25D366' }} // WhatsApp green
                        >
                            <span className="text-muted">Phone 2:</span> {employeeData.phone2}
                        </a>
                    </div>
                )}


                {employeeData.phone3 && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <FiPhone size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault(); // prevent default anchor navigation
                                handleWhatsAppClick(employeeData.phone3); // open WhatsApp
                            }}
                            className="text-truncate-1-line"
                            style={{ cursor: 'pointer', color: '#25D366' }} // WhatsApp green
                        >
                            <span className="text-muted">Phone 3:</span> {employeeData.phone3}
                        </a>
                    </div>
                )}

                

                
                {employeeData.email && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <FiMail size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <a href={`mailto:${employeeData.email}`} className="text-truncate-1-line">
                            <span className="text-muted">Email:</span> {employeeData.email}
                        </a>
                    </div>
                )}

                
                {employeeData.department?.name && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <FiBriefcase size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-truncate-1-line">
                            <span className="text-muted">Department:</span> {employeeData.department.name}
                        </span>
                    </div>
                )}  {employeeData.designation?.name && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <FiBriefcase size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-truncate-1-line">
                            <span className="text-muted">Designation:</span> {employeeData.designation.name}
                        </span>
                    </div>
                )}
                
                {employeeData.joiningDate && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <FiCalendar size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-truncate-1-line">
                            <span className="text-muted">Joined:</span> {employeeData.joiningDate}
                        </span>
                    </div>
                )}
                
                {(employeeData.dutyStartTime || employeeData.dutyEndTime) && (
                    <div className="d-flex align-items-center">
                        <div className="avatar-text bg-gray-100">
                            <FiClock size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-truncate-1-line">
                            <span className="text-muted">Duty Hours:</span> {employeeData.dutyStartTime || 'N/A'} - {employeeData.dutyEndTime || 'N/A'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomerSocalMedia
