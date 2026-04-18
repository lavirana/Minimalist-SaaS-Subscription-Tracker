import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
    const navigate        = useNavigate()
    const { login }       = useAuth()

    const [form, setForm] = useState({
        email:    '',
        password: '',
    })
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState<string | null>(null)

    const set = (key: string, value: string) =>
        setForm(prev => ({ ...prev, [key]: value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            await login(form.email, form.password)
            toast.success('Welcome back!')
            navigate('/')
        } catch (err: unknown) {
            const message = getErrorMessage(err)
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <div className="auth-logo">💳</div>
                    <h1>SubTracker</h1>
                    <p>Sign in to your account</p>
                </div>

                {/* Error */}
                {error != null && (
                    <div className="auth-error">
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => set('email', e.target.value)}
                            placeholder="ashish@example.com"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={e => set('password', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary btn-full"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer */}
                <p className="auth-footer">
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-link">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}

// Helper to extract error message
function getErrorMessage(err: unknown): string {
    if (
        err != null &&
        typeof err === 'object' &&
        'response' in err
    ) {
        const resp = (err as { response: { data: { message: string } } }).response
        return resp?.data?.message ?? 'Login failed'
    }
    return 'Something went wrong'
}