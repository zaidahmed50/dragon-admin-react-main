import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff } from 'lucide-react';
import { getLoginRedirectPath } from '../../utils/routeUtils';
const LoginForm = ({ registerPath, resetPath }) => {
    // const [email, setEmail] = useState('admin@wellnetwork.pk')
    const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('wellnetwork$321')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {login} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
        if (savedPassword) {
            setPassword(savedPassword);
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const from = location.state?.from?.pathname

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const result = await login(email, password)
            if (result.success) {
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                    localStorage.setItem('rememberedPassword', password);
                } else {
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                }
                
                // Get user data from localStorage (just saved by login)
                const user = JSON.parse(localStorage.getItem('user'));
                const userPermissions = user?.authorities || [];
                const isSuperAdmin = userPermissions.includes('ROLE_SUPER_ADMIN');
                
                // Determine best redirect path based on permissions
                const redirectPath = getLoginRedirectPath(userPermissions, isSuperAdmin, from);
                
                navigate(redirectPath, {replace: true})
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError('An error occurred during login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Login</h2>
            <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="username"
                        className="form-control"
                        placeholder="Email or Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 position-relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        autoComplete="current-password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ paddingRight: '40px' }} // Make room for the icon
                    />

                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6c757d'
                        }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <div className="custom-control custom-checkbox">
                            <input 
                                type="checkbox" 
                                className="custom-control-input" 
                                id="rememberMe" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="custom-control-label c-pointer" htmlFor="rememberMe">Remember Me</label>
                        </div>
                    </div>
                </div>
                <div className="mt-5">
                    <button 
                        type="submit" 
                        className="btn btn-lg btn-primary w-100" 
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
        </>
    )
}

export default LoginForm