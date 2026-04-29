import {useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';

export const useLogout = () => {
    const navigate = useNavigate();
    const { logout: contextLogout } = useAuth();

    return () => {
        contextLogout();
        sessionStorage.clear();
        navigate('/login', {replace: true});
    };
};