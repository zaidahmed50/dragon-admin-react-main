import React from 'react'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { AiOutlineIdcard } from 'react-icons/ai'
import Dropdown from '@/components/shared/Dropdown.jsx'

const CustomerContactDetails = ({ customerData }) => {
    if (!customerData) {
        return (
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Contact Information</h5>
                </div>
                <div className="card-body">
                    <div className="text-center text-muted py-3">
                        <p>No customer data available</p>
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
                {customerData.phone1 && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <FiPhone size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <a href={`tel:${customerData.phone1}`} className="text-truncate-1-line">
                            <span className="text-muted">Phone 1:</span> {customerData.phone1}
                        </a>
                    </div>
                )}
                
                {customerData.phone2 && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <FiPhone size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <a href={`tel:${customerData.phone2}`} className="text-truncate-1-line">
                            <span className="text-muted">Phone 2:</span> {customerData.phone2}
                        </a>
                    </div>
                )}
                
                {customerData.phone3 && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <FiPhone size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <a href={`tel:${customerData.phone3}`} className="text-truncate-1-line">
                            <span className="text-muted">Mobile 3:</span> {customerData.phone3}
                        </a>
                    </div>
                )}
                
                {customerData.email && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <FiMail size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <a href={`mailto:${customerData.email}`} className="text-truncate-1-line">
                            <span className="text-muted">Email:</span> {customerData.email}
                        </a>
                    </div>
                )}
                
                {customerData.uuid && (
                    <div className="d-flex align-items-center mb-3">
                        <div className="avatar-text bg-gray-100">
                            <AiOutlineIdcard size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-truncate-1-line">
                            <span className="text-muted">CNIC:</span> {customerData.uuid}
                        </span>
                    </div>
                )}
                
                {customerData.address && (
                    <div className="d-flex align-items-center">
                        <div className="avatar-text bg-gray-100">
                            <FiMapPin size={16} />
                        </div>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="text-truncate-1-line">
                            <span className="text-muted">Address:</span> {customerData.address}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomerContactDetails
