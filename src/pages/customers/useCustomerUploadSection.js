import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const MAX_MB = 5;

export default function useCustomerUpload() {
    const location = useLocation();
    const customerDataFromState = location.state?.customerData;
    const isEditMode = !!customerDataFromState;

    const [files, setFiles] = useState({});
    const [progress, setProgress] = useState({});
    const [errors, setErrors] = useState({});
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isEditMode && customerDataFromState && !isInitialized.current) {
            const existingFiles = {
                profilePic: customerDataFromState.profilePicture || null,
                cnicFront: customerDataFromState.cnicFront || null,
                cnicBack: customerDataFromState.cnicBack || null,
                passportScan: customerDataFromState.passportScan || null,
                ntnScan: customerDataFromState.ntnScan || null,
            };

            const existingProgress = Object.keys(existingFiles).reduce((acc, key) => {
                if (existingFiles[key]) {
                    acc[key] = 100;
                }
                return acc;
            }, {});

            setFiles(existingFiles);
            setProgress(existingProgress);
            isInitialized.current = true;
        }
    }, [isEditMode, customerDataFromState]);

    const uploadFile = (key, file) => {
        const sizeMB = file?.size / (1024 * 1024);

        if (sizeMB > MAX_MB) {
            setErrors(prev => ({ ...prev, [key]: "File exceeds 5MB limit" }));
            setProgress(prev => ({ ...prev, [key]: 0 }));
            return;
        }

        setErrors(prev => ({ ...prev, [key]: null }));
        setFiles(prev => ({ ...prev, [key]: file }));
        setProgress(prev => ({ ...prev, [key]: 0 }));

        let value = 0;
        const interval = setInterval(() => {
            value += 20;
            setProgress(prev => ({ ...prev, [key]: value }));

            if (value >= 100) {
                clearInterval(interval);
            }
        }, 300);
    };

    const removeFile = (key) => {
        setFiles(prev => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
        });
        setProgress(prev => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
        });
        setErrors(prev => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
        });
    };

    return {
        files,
        progress,
        errors,
        uploadFile,
        removeFile
    };
}
