import {BsPatchCheckFill} from 'react-icons/bs'
import {FiEdit, FiInbox, FiMail, FiPhone} from 'react-icons/fi'
import {AiOutlineIdcard} from 'react-icons/ai'
import {FaBuilding} from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'
import {ApiUrls} from "../../services/index.js";
import AppButton from "../../common/AppButton.jsx";
import {Box} from "@mui/material";

const CustomerProfile = ({customerData}) => {
    const navigate = useNavigate();
    const defaultAvatar = "/images/avatar/1.png";

    // Determine if it's a business customer
    const isBusiness = customerData && (customerData.ntnScan);

    const handleEditCustomer = () => {
        if (customerData && customerData.userId) {
            navigate(`/Customers/create`, {state: {customerData, isEditMode: true}});
        }
    };

    if (!customerData) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="text-center text-muted py-5">
                        <p>No customer data available</p>
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
                                src={`${ApiUrls.imageUrl}${customerData.profilePicture}` || defaultAvatar}
                                alt={customerData.name || "Customer"}
                                className="img-fluid"
                                onError={(e) => {
                                    e.target.src = defaultAvatar;
                                }}
                            />
                        </div>
                        <div className={`wd-10 ht-10 rounded-circle position-absolute translate-middle ${
                            customerData.userStatus === 'Active' ? 'text-success' : 'text-danger'
                        }`} style={{top: "76%", right: "10px"}}>
                            <BsPatchCheckFill size={16}/>
                        </div>
                    </div>
                    <div className="mb-4">
                        <a href="#" className="fs-14 fw-bold d-block">{customerData.name || 'N/A'}</a>
                        <a href="#" className="fs-12 fw-normal text-muted d-block">{customerData.email || 'N/A'}</a>
                        {customerData.referenceNumber && (
                            <span className="badge bg-soft-primary text-primary mt-2">
                                {customerData.referenceNumber}
                            </span>
                        )}
                    </div>

                </div>
                <ul className="list-unstyled mb-4">
                    {/* Conditional rendering for CNIC or Business Info */}
                    {!isBusiness && customerData.uuid && (
                        <li className="hstack justify-content-between mb-4">
                            <span className="text-muted fw-medium hstack gap-3">
                                <AiOutlineIdcard size={16}/>CNIC
                            </span>
                            <span className="float-end">{customerData.uuid}</span>
                        </li>
                    )}
                    {isBusiness && customerData.pocName && (
                        <li className="hstack justify-content-between mb-4">
                            <span className="text-muted fw-medium hstack gap-3">
                                <FaBuilding size={16}/>POC Name
                            </span>
                            <span className="float-end">{customerData.pocName}</span>
                        </li>
                    )}

                    {customerData.phone1 && (
                        <li className="hstack justify-content-between mb-4">
                            <span className="text-muted fw-medium hstack gap-3">
                                <FiPhone size={16}/>Phone 1
                            </span>
                            <a href={`tel:${customerData.phone1}`} className="float-end">
                                {customerData.phone1}
                            </a>
                        </li>
                    )}
                    {customerData.phone2 && (
                        <li className="hstack justify-content-between mb-4">
                            <span className="text-muted fw-medium hstack gap-3">
                                <FiPhone size={16}/>Phone 2
                            </span>
                            <a href={`tel:${customerData.phone2}`} className="float-end">
                                {customerData.phone2}
                            </a>
                        </li>
                    )}
                    {(
                        <li className="hstack justify-content-between mb-4">
                            <span className="text-muted fw-medium hstack gap-3">
                                <FiPhone size={16}/>Phone 3
                            </span>
                            <a href={`tel:${customerData.phone3}`} className="float-end">
                                {customerData.phone3 ?? "N/A"}
                            </a>
                        </li>
                    )}
                    {customerData.email && (
                        <li className="hstack justify-content-between mb-0">
                            <span className="text-muted fw-medium hstack gap-3">
                                <FiMail size={16}/>Email
                            </span>
                            <a href={`mailto:${customerData.email}`} className="float-end">
                                {customerData.email}
                            </a>
                        </li>
                    )}
                </ul>
                <Box flex={1}
                     display="flex"
                     justifyContent="center"

                     gap={2}>
                    <AppButton
                        fullWidth={true}
                        onClick={handleEditCustomer}
                        label={"Edit Customer"}
                        startIcon={<FiEdit size={16} className='me-2'/>}

                    >
                    </AppButton>

                    <AppButton
                        fullWidth={true}
                        onClick={
                            () => navigate('/SaleId/create', {state: customerData})

                        }
                        label={"Create Sales ID"}
                        startIcon={<FiInbox size={16} className='me-2'/>}
                    >
                    </AppButton>
                </Box>
            </div>
        </div>
    )
}

export default CustomerProfile
