// UNUSED - Commented out as per menu cleanup
// import React from 'react'
// import { BsPatchCheckFill } from 'react-icons/bs'
// import { FiEdit, FiMail, FiPhone, FiTrash2 } from 'react-icons/fi'
// import { AiOutlineIdcard } from 'react-icons/ai'
// import { FaWhatsapp } from 'react-icons/fa'
// import { useNavigate } from 'react-router-dom'
// import {ApiUrls} from "../../services/index.js";
// 
// const Profile = ({ employeeData }) => {
//     const navigate = useNavigate();
//     const defaultAvatar = "/images/avatar/1.png";
//     
//     const handleEditEmployee = () => {
//         if (employeeData) {
//             // Navigate with employeeData in state, no URL parameter needed
//             navigate('/employee/create', { state: { employeeData } });
//         }
//     };
// 
//     const handleDeleteEmployee = () => {
//         // TODO: Implement delete functionality
//         console.log('Delete employee:', employeeData?.id);
//     };
// 
//     if (!employeeData) {
//         return (
//             <div className="card">
//                 <div className="card-body">
//                     <div className="text-center text-muted py-5">
//                         <p>No employee data available</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// 
//     return (
//         <div className="card">
//             <div className="card-body">
//                 <div className="mb-4 text-center">
//                     <div className="wd-150 ht-150 mx-auto mb-3 position-relative">
//                         <div className="avatar-image wd-150 ht-150 border border-5 border-gray-3">
//                             <img
//                                 src={`${ApiUrls.imageUrl}${employeeData.profilePicture}` || defaultAvatar}
//                                 alt={employeeData.name || "Employee"}
//                                 className="img-fluid"
//                                 onError={(e) => {
//                                     e.target.src = defaultAvatar;
//                                 }}
//                             />
//                         </div>
//                         <div className={`wd-10 ht-10 rounded-circle position-absolute translate-middle ${
//                             employeeData.userStatus === 'Active' ? 'text-success' : 'text-danger'
//                         }`} style={{ top: "76%", right: "10px" }}>
//                             <BsPatchCheckFill size={16} />
//                         </div>
//                     </div>
//                     <div className="mb-4">
//                         <a href="#" className="fs-14 fw-bold d-block">{employeeData.name || 'N/A'}</a>
//                         <a href="#" className="fs-12 fw-normal text-muted d-block">{employeeData.email || 'N/A'}</a>
//                         {employeeData.employeeCode && (
//                             <span className="badge bg-soft-primary text-primary mt-2">
//                                 {employeeData.employeeCode}
//                             </span>
//                         )}
//                     </div>
//                     <div className="fs-12 fw-normal text-muted text-center d-flex flex-wrap gap-3 mb-4">
//                         <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
//                             <h6 className="fs-15 fw-bolder">{employeeData.designation || 'N/A'}</h6>
//                             <p className="fs-12 text-muted mb-0">Designation</p>
//                         </div>
//                         <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
//                             <h6 className="fs-15 fw-bolder">{employeeData.userStatus || 'N/A'}</h6>
//                             <p className="fs-12 text-muted mb-0">Status</p>
//                         </div>
//                         <div className="flex-fill py-3 px-4 rounded-1 d-none d-sm-block border border-dashed border-gray-5">
//                             <h6 className="fs-15 fw-bolder">{employeeData.bloodGroup || 'N/A'}</h6>
//                             <p className="fs-12 text-muted mb-0">Blood Group</p>
//                         </div>
//                     </div>
//                 </div>
//                 <ul className="list-unstyled mb-4">
//                     {employeeData.uuid && (
//                         <li className="hstack justify-content-between mb-4">
//                             <span className="text-muted fw-medium hstack gap-3">
//                                 <AiOutlineIdcard size={16} />CNIC
//                             </span>
//                             <span className="float-end">{employeeData.uuid}</span>
//                         </li>
//                     )}
//                     {employeeData.phone1 && (
//                         <li className="hstack justify-content-between mb-4">
//                             <span className="text-muted fw-medium hstack gap-3">
//                                 <FiPhone size={16} />Phone 1
//                             </span>
//                             <a href={`tel:${employeeData.phone1}`} className="float-end">
//                                 {employeeData.phone1}
//                             </a>
//                         </li>
//                     )}
//                     {employeeData.phone2 && (
//                         <li className="hstack justify-content-between mb-4">
//                             <span className="text-muted fw-medium hstack gap-3">
//                                 <FiPhone size={16} />Phone 2
//                             </span>
//                             <a href={`tel:${employeeData.phone2}`} className="float-end">
//                                 {employeeData.phone2}
//                             </a>
//                         </li>
//                     )}
//                     {employeeData.whatsApp && (
//                         <li className="hstack justify-content-between mb-4">
//                             <span className="text-muted fw-medium hstack gap-3">
//                                 <FaWhatsapp size={16} className="text-success" />WhatsApp
//                             </span>
//                             <a
//                                 href={`https://wa.me/${employeeData.whatsApp.replace(/\D/g, '')}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="float-end text-success"
//                             >
//                                 {employeeData.whatsApp}
//                             </a>
//                         </li>
//                     )}
//                     {employeeData.email && (
//                         <li className="hstack justify-content-between mb-0">
//                             <span className="text-muted fw-medium hstack gap-3">
//                                 <FiMail size={16} />Email
//                             </span>
//                             <a href={`mailto:${employeeData.email}`} className="float-end">
//                                 {employeeData.email}
//                             </a>
//                         </li>
//                     )}
//                 </ul>
//                 <div className="d-flex gap-2 text-center pt-4">
//                     <button 
//                         onClick={handleDeleteEmployee}
//                         className="w-50 btn btn-light-brand"
//                     >
// 
//                         <FiTrash2 size={16} className='me-2' />
//                         <span>Delete Employee</span>
//                     </button>
//                     <button 
//                         onClick={handleEditEmployee}
//                         className="w-50 btn btn-primary"
//                     >
//                         <FiEdit size={16} className='me-2' />
//                         <span>Edit Employee</span>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }
// 
// export default Profile
// 

export default null;