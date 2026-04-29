import { FiEye, FiDownload } from "react-icons/fi";
import { ApiUrls } from "../../../services/index.js";
import ImageViewerModal from "@/components/shared/ImageViewerModal.jsx";
import {useState} from "react";

/* -------------------- STATIC DOCUMENT CONFIG -------------------- */
const DOCUMENTS_CONFIG = [
    { key: "cnicFront", title: "CNIC Front", description: "Front side of CNIC" },
    { key: "cnicBack", title: "CNIC Back", description: "Back side of CNIC" },
    { key: "educationProof", title: "Education Proof", description: "Degree/Certificate" },
    { key: "experienceLetter", title: "Experience Letter", description: "Job experience letter" },
];

const DocumentsView = ({ employeeData }) => {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState(null)
    // Helper to truncate long filenames
    const getSafeFileName = (url) => {
        const name = url.split('/').pop() || "download";
        return name.length > 50 ? `${name.substring(0, 40)}...${name.slice(-7)}` : name;
    };

    const handleView = (url) => {
        setCurrentImageUrl(url);
        setViewerOpen(true);

    };

    const handleCloseViewer = () => {
        setViewerOpen(false);
        setCurrentImageUrl(null);
    };
    const handleDownload = async (e, imageUrl) => {
        e.preventDefault();
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = getSafeFileName(imageUrl);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading the image:', error);
            window.open(imageUrl, '_blank');
        }
    };

    if (!employeeData) {
        return <div className="text-center text-muted py-4">No documents available</div>;
    }

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h6 className="card-title mb-4">Employee Documents</h6>
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
                            const filePath = employeeData[doc.key];
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
                                                <a
                                                    onClick={() => handleView(fileUrl)}
                                                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center"

                                                >
                                                    <FiEye className="me-1" /> View
                                                </a>
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

export default DocumentsView;