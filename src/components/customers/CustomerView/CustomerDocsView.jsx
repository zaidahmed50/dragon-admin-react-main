import { useState } from "react";
import { FiEye, FiDownload } from "react-icons/fi";
import { ApiUrls } from "../../../services/index.js";
import { useFileDownload } from "@/hooks/useFileDownload.js";
import ImageViewerModal from "../../shared/ImageViewerModal.jsx";

const CustomerDocsView = ({ customerData }) => {
    const { handleDownload } = useFileDownload();
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const isBusiness = customerData && (customerData.ntnScan);
    const DOCUMENTS_CONFIG = isBusiness
        ? [
            { key: "ntnScan", title: "NTN Scan", description: "National Tax Number Certificate" },
            { key: "profilePicture", title: "Profile Picture", description: "Business Logo / Profile Image" },
        ]
        : [
            { key: "cnicFront", title: "CNIC Front", description: "Front side of CNIC" },
            { key: "cnicBack", title: "CNIC Back", description: "Back side of CNIC" },
            { key: "passportScan", title: "Passport Scan", description: "Scanned copy of Passport" },
            { key: "profilePicture", title: "Profile Picture", description: "Customer Profile Image" },
        ];

    if (!customerData) {
        return <div className="text-center text-muted py-4">No documents available</div>;
    }

    const handleView = (url) => {
        setCurrentImageUrl(url);
        setViewerOpen(true);
    };

    const handleCloseViewer = () => {
        setViewerOpen(false);
        setCurrentImageUrl(null);
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h6 className="card-title mb-4">Customer Documents</h6>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>Document Type</th>
                            <th className="text-end">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {DOCUMENTS_CONFIG.map((doc) => {
                            const filePath = customerData[doc.key];
                            const hasFile = Boolean(filePath);
                            const fileUrl = hasFile ? `${ApiUrls.imageUrl}${filePath}` : null;

                            return (
                                <tr key={doc.key}>
                                    <td>
                                        <div className="fw-bold text-dark">{doc.title}</div>
                                        <div className="text-muted small">{doc.description}</div>
                                    </td>
                                    <td className="text-end">
                                        {hasFile ? (
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    onClick={() => handleView(fileUrl)}
                                                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center"
                                                >
                                                    <FiEye className="me-1" /> View
                                                </button>
                                                <button
                                                    onClick={(e) => handleDownload(e, fileUrl)}
                                                    className="btn btn-sm btn-primary d-inline-flex align-items-center"
                                                >
                                                    <FiDownload className="me-1" /> Download
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="badge bg-light text-danger border">
                                                Not Uploaded
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
            <ImageViewerModal
                open={viewerOpen}
                onClose={handleCloseViewer}
                imageUrl={currentImageUrl}
            />
        </div>
    );
};

export default CustomerDocsView;
