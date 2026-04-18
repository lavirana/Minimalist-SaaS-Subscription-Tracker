import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface RegisterForm {
    name:                  string
    email:                 string
    password:              string
    password_confirmation: string
}

export default function Register() {
    const navigate          = useNavigate()
    const { register }      = useAuth()

    const [form, setForm]   = useState<RegisterForm>({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
    })
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState<string | null>(null)
    const [errors,  setErrors]  = useState<Record<string, string[]>>({})

    const set = (key: keyof RegisterForm, value: string) =>
        setForm(prev => ({ ...prev, [key]: value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setErrors({})

        // Client side check
        if (form.password !== form.password_confirmation) {
            setError('Passwords do not match')
            return
        }

        if (form.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setLoading(true)

        try {
            await register(form.name, form.email, form.password)
            toast.success('Account created! Welcome!')
            navigate('/')
        } catch (err: unknown) {
            const { message, fieldErrors } = getErrors(err)
            setError(message)
            setErrors(fieldErrors)
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
                    <p>Create your free account</p>
                </div>

                {/* Error */}
                {error != null && (
                    <div className="auth-error">
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Name */}
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => set('name', e.target.value)}
                            placeholder="Ashish Rana"
                            required
                            autoFocus
                        />
                        {errors.name != null && (
                            <span className="field-error">
                                {errors.name[0]}
                            </span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => set('email', e.target.value)}
                            placeholder="ashish@example.com"
                            required
                        />
                        {errors.email != null && (
                            <span className="field-error">
                                {errors.email[0]}
                            </span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={e => set('password', e.target.value)}
                            placeholder="Min 8 characters"
                            required
                        />
                        {errors.password != null && (
                            <span className="field-error">
                                {errors.password[0]}
                            </span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={form.password_confirmation}
                            onChange={e => set('password_confirmation', e.target.value)}
                            placeholder="Repeat your password"
                            required
                        />
                    </div>

                    {/* Password strength indicator */}
                    {form.password.length > 0 && (
                        <PasswordStrength password={form.password} />
                    )}

                    <button
                        type="submit"
                        className="btn-primary btn-full"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Footer */}
                <p className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

// ─── Password Strength Component ─────────────────────────
function PasswordStrength({ password }: { password: string }) {
    const strength = getStrength(password)

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']

    return (
        <div className="password-strength">
            <div className="strength-bars">
                {[1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        className="strength-bar"
                        style={{
                            background: i <= strength
                                ? colors[strength]
                                : '#334155'
                        }}
                    />
                ))}
            </div>
            <span
                className="strength-label"
                style={{ color: colors[strength] }}
            >
                {labels[strength]}
            </span>
        </div>
    )
}

function getStrength(password: string): number {
    let score = 0
    if (password.length >= 8)                    score++
    if (/[A-Z]/.test(password))                  score++
    if (/[0-9]/.test(password))                  score++
    if (/[^A-Za-z0-9]/.test(password))           score++
    return score
}

// ─── Error Helper ─────────────────────────────────────────
function getErrors(err: unknown): {
    message:     string
    fieldErrors: Record<string, string[]>
} {
    if (
        err != null &&
        typeof err === 'object' &&
        'response' in err
    ) {
        const resp = (err as {
            response: {
                data: {
                    message: string
                    errors?: Record<string, string[]>
                }
            }
        }).response

        return {
            message:     resp?.data?.message ?? 'Registration failed',
            fieldErrors: resp?.data?.errors  ?? {},
        }
    }
    return { message: 'Something went wrong', fieldErrors: {} }
}