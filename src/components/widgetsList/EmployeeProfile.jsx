import { BsPatchCheckFill } from 'react-icons/bs'
import { FiEdit, FiMail, FiPhone, FiTrash2 } from 'react-icons/fi'
import { AiOutlineIdcard } from 'react-icons/ai'
import { FaWhatsapp } from 'react-icons/fa'
import {Navigate, useNavigate} from 'react-router-dom'
import {ApiUrls, EmployeeService} from "../../services/index.js";
import AppButton from "../../common/AppButton.jsx";

const EmployeeProfile = ({ employeeData }) => {
    const navigate = useNavigate();
    const defaultAvatar = "/images/avatar/1.png";

    const handleEditEmployee = () => {
        if (employeeData) {
            navigate('/employee/create', { state: { employeeData } });
        }
    };

    if (!employeeData) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="text-center text-muted py-5">
                        <p>No employee data available</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-body">
                <div className="mb-4 text-center">
                    <div className="wd-150 ht-150 mx-auto mb-3 position-relative">
                        <div className="avatar-image wd-150 ht-150 border border-5 border-gray-3">
                            <img
                                src={`${ApiUrls.imageUrl}${employeeData.profilePicture}` || defaultAvatar}
                                alt={employeeData.name || "Employee"}
                                className="img-fluid"
                                onError={(e) => {
                                    e.target.src = defaultAvatar;
                                }}
                            />
                        </div>
                        <div className={`wd-10 ht-10 rounded-circle position-absolute translate-middle ${
                            employeeData.userStatus === 'Active' ? 'text-success' : 'text-danger'
                        }`} style={{ top: "76%", right: "10px" }}>
                            <BsPatchCheckFill size={16} />
                        </div>
                    </div>
                    <div className="mb-4">
                        <span href="#" className="fs-30 fw-bold d-block">{employeeData.name || 'N/A'}</span>
                        {employeeData.employeeCode && (
                            <span className="badge bg-soft-primary text-primary mt-xxl-2">
                                {employeeData.employeeCode}
                            </span>
                        )}
                    </div>
                    <div className="fs-12 fw-normal text-muted text-center d-flex flex-wrap gap-3 mb-4">
                        <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
                            <h6 className="fs-15 fw-bolder">
                                {Array.isArray(employeeData.designation) && employeeData.designation.length > 0
                                    ? employeeData.designation.map(d => d.name).filter(Boolean).join(', ')
                                    : employeeData.designation?.name || 'N/A'}
                            </h6>
                            <p className="fs-12 text-muted mb-0">Designation</p>
                        </div>
                        <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
                            <h6 className="fs-15 fw-bolder">{employeeData.userStatus || 'N/A'}</h6>
                            <p className="fs-12 text-muted mb-0">Status</p>
                        </div>
                        <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
                            <h6 className="fs-15 fw-bolder">{employeeData.bloodGroup || 'N/A'}</h6>
                            <p className="fs-12 text-muted mb-0">Blood Group</p>
                        </div>
                    </div>
                </div>
                <ul className="list-unstyled mb-4">
                    {employeeData.uuid && (
                        <li className="hstack justify-content-between mb-4">
                            <span className="text-muted fw-medium hstack gap-3">
                                <AiOutlineIdcard size={16} />CNIC
                            </span>
                            <span className="float-end">{employeeData.uuid}</span>
                        </li>
                    )}
                    {employeeData.division && (
                        <li className="hstack justify-content-between mb-4">
                            <span className="text-muted fw-medium hstack gap-3">
                                <AiOutlineIdcard size={16} />Division
                            </span>
                            <span className="float-end">{employeeData.division}</span>
                        </li>
                    )}

                </ul>
                <div className="d-flex gap-2 text-center pt-4">
                    <AppButton
                        label={"Edit Employee"}
                        onClick={handleEditEmployee}
                        className="w-50 btn btn-primary"
                        startIcon={<FiEdit size={16} className='me-2' />}
                    >

                        <span>Edit Employee</span>
                    </AppButton>
                </div>
            </div>
        </div>
    )
}

export default EmployeeProfile


