// import { forwardRef } from "react";
// import { Box, Typography, Avatar, Grid } from "@mui/material";
// import useUploadSection from "./hooks/useUploadSection";
// import UploadField from "./components/UploadField";
// import FilePreview from "./components/FilePreview";
// import UploadButton from "./components/UploadButton";
//
// const EmployeeUploadSection = forwardRef((props, ref) => {
//     const {
//         files,
//         existingFiles,
//         setters,
//         handleFileChange,
//         handleRemoveFile,
//         getProfileImageSource,
//         show,
//     } = useUploadSection(ref, props);
//
//     return (
//         <Box>
//             <Typography variant="h5" gutterBottom>
//                 Upload
//             </Typography>
//
//             {show.showProfilePicture && (
//                 <Box sx={{ mb: 3 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                             Profile Picture
//                         </Typography>
//                         <Typography component="span" sx={{ color: 'red', fontSize: 14 }}>*</Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                         <Avatar
//                             src={getProfileImageSource()}
//                             sx={{ width: 50, height: 50 }}
//                         />
//                         <Box sx={{ flex: 1 }}>
//                             {!(files.profilePic || existingFiles.profilePic) ? (
//                                 <UploadButton
//                                     id="profile-upload"
//                                     accept="image/jpeg,image/png,image/jpg"
//                                     onChange={handleFileChange(setters.setProfilePic)}
//                                     label="Profile Picture"
//                                 />
//                             ) : (
//                                 <FilePreview
//                                     file={files.profilePic}
//                                     existingFile={existingFiles.profilePic}
//                                     onRemove={handleRemoveFile(setters.setProfilePic, 'profilePic')}
//                                 />
//                             )}
//                         </Box>
//                     </Box>
//                 </Box>
//             )}
//
//             {show.showCNIC && (
//                 <Box sx={{ mb: 3 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14 }}>
//                             CNIC
//                         </Typography>
//                         <Typography component="span" sx={{ color: 'red', fontSize: 14 }}>*</Typography>
//                     </Box>
//                     <Grid container spacing={2.5}>
//                         <Grid item xs={6}>
//                             <UploadField
//                                 title="Front"
//                                 file={files.cnicFront}
//                                 existingFile={existingFiles.cnicFront}
//                                 onFileChange={handleFileChange(setters.setCnicFront)}
//                                 onRemove={handleRemoveFile(setters.setCnicFront, 'cnicFront')}
//                                 accept="image/jpeg,image/png,image/jpg"
//                                 id="cnic-front"
//                                 show={true}
//                             />
//                         </Grid>
//                         <Grid item xs={6}>
//                             <UploadField
//                                 title="Back"
//                                 file={files.cnicBack}
//                                 existingFile={existingFiles.cnicBack}
//                                 onFileChange={handleFileChange(setters.setCnicBack)}
//                                 onRemove={handleRemoveFile(setters.setCnicBack, 'cnicBack')}
//                                 accept="image/jpeg,image/png,image/jpg"
//                                 id="cnic-back"
//                                 show={true}
//                             />
//                         </Grid>
//                     </Grid>
//                 </Box>
//             )}
//
//             <UploadField
//                 title="Educational Documents"
//                 file={files.eduDocs}
//                 existingFile={existingFiles.eduDocs}
//                 onFileChange={handleFileChange(setters.setEduDocs)}
//                 onRemove={handleRemoveFile(setters.setEduDocs, 'eduDocs')}
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 id="edu-docs"
//                 show={show.showEducation}
//             />
//
//             <UploadField
//                 title="Experience Letter"
//                 file={files.expLetter}
//                 existingFile={existingFiles.expLetter}
//                 onFileChange={handleFileChange(setters.setExpLetter)}
//                 onRemove={handleRemoveFile(setters.setExpLetter, 'expLetter')}
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 id="exp-letter"
//                 show={show.showExperience}
//             />
//
//             <Box sx={{ mt: 2, p: 1, bgcolor: "#f0f7ff", borderRadius: 1 }}>
//                 <Typography variant="caption" color="text.secondary">
//                     <strong>Note:</strong> Accepted formats: JPG, JPEG, PNG for images; PDF for documents.
//                     Maximum file size: 5MB per file.
//                     {props.isEditMode && (
//                         <>
//                             <br />
//                             <strong>Edit Mode:</strong> Files with green background are already uploaded.
//                             Upload new files only if you want to replace them.
//                         </>
//                     )}
//                 </Typography>
//             </Box>
//         </Box>
//     );
// });
//
// EmployeeUploadSection.displayName = "UploadSection";
//
// export default EmployeeUploadSection;