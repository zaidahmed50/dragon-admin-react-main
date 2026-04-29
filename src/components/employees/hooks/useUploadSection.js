import { useState, useEffect, useRef } from "react";
import {useLocation} from "react-router-dom";

const MAX_MB = 5;

export default function useEmployeeUpload() {
    const location = useLocation();
    const employeeDataFromState = location.state?.employeeData;
    const isEditMode = !!employeeDataFromState;
    
    const [files, setFiles] = useState({});
    const [progress, setProgress] = useState({});
    const [errors, setErrors] = useState({});
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isEditMode && employeeDataFromState && !isInitialized.current) {
            
            // Set existing files/documents in edit mode
            const existingFiles = {};
            const existingProgress = {};
            
            if (employeeDataFromState.cnicFront) {
                existingFiles.cnicFront = employeeDataFromState.cnicFront;
                existingProgress.cnicFront = 100;
                console.log('✓ CNIC Front added to files');
            }
            if (employeeDataFromState.cnicBack) {
                existingFiles.cnicBack = employeeDataFromState.cnicBack;
                existingProgress.cnicBack = 100;
                console.log('✓ CNIC Back added to files');
            }
            if (employeeDataFromState.profilePicture) {
                existingFiles.profilePicture = employeeDataFromState.profilePicture;
                existingProgress.profilePicture = 100;
                console.log('✓ Profile Picture added to files');
            }
            if (employeeDataFromState.educationProof) {
                existingFiles.educationProof = employeeDataFromState.educationProof;
                existingProgress.educationProof = 100;
                console.log('✓ Education Proof added to files');
            }
            if (employeeDataFromState.experienceLetter) {
                existingFiles.experienceLetter = employeeDataFromState.experienceLetter;
                existingProgress.experienceLetter = 100;
                console.log('✓ Experience Letter added to files');
            }
            
            console.log('Final files object:', existingFiles);
            console.log('Final progress object:', existingProgress);
            console.log('=== END LOADING DOCUMENTS ===');
            
            setFiles(existingFiles);
            setProgress(existingProgress);
            isInitialized.current = true;
        }
    }, [isEditMode, employeeDataFromState]);

    const uploadFile = (key, file) => {
        const sizeMB = file.size / (1024 * 1024);

        if (sizeMB > MAX_MB) {
            setErrors(prev => ({ ...prev, [key]: "File exceeds 5MB limit" }));
            setProgress(prev => ({ ...prev, [key]: 0 }));
            return;
        }

        setErrors(prev => ({ ...prev, [key]: null }));
        setProgress(prev => ({ ...prev, [key]: 0 }));

        let value = 0;
        const interval = setInterval(() => {
            value += 20;
            setProgress(prev => ({ ...prev, [key]: value }));

            if (value >= 100) {
                clearInterval(interval);
                setFiles(prev => ({ ...prev, [key]: file }));
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
    };

    return {
        files,
        progress,
        errors,
        uploadFile,
        removeFile
    };
}
