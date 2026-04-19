import { useState } from 'react' //This lets the component "remember" data (like what the user types).
import { X } from 'lucide-react' //This brings in a specific "X" icon to act as a close button.
import { categoryApi } from '../services/api' //This connects this file to your backend server logic.
import type { Category } from '../types' 
import toast from 'react-hot-toast' //This is used to show a small success notification when the user saves the data.

interface Props {
    onClose:  () => void
    onSaved:  (category: Category) => void
    initial?: Partial<Category>
    isEdit?:  boolean
}

//PRESET_COLORS and PRESET_ICONS: These are simple arrays containing lists of colors and emojis. They are used later to generate buttons automatically so the user can easily click and select them, instead of typing them manually.

// Preset colors to choose from
const PRESET_COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#EAB308', // Yellow
    '#22C55E', // Green
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#94A3B8', // Slate
]

// Preset icons to choose from
const PRESET_ICONS = [
    '🎬', '🎵', '🎮', '📺', '🎭',  // Entertainment
    '💼', '📝', '🎨', '🐙', '💬',  // Work
    '🤖', '🧠', '⚡', '🔬', '💻',  // AI & Tech
    '☁️', '🚀', '🌐', '🔧', '⚙️',  // Cloud
    '📚', '🎓', '✏️', '🏫', '📖',  // Education
    '🏥', '💊', '🏋️', '🧘', '❤️',  // Health
    '📱', '📞', '📧', '💬', '🔔',  // Communication
    '🔒', '🛡️', '🔑', '🔐', '👁️',  // Security
    '💰', '💳', '📊', '💵', '🏦',  // Finance
    '📦', '🛒', '🏠', '✈️', '🌍',  // Other
]


//Props: These are the "instructions" passed from the parent page to this modal.
//onClose: Function to close the modal.
//onSaved: Function to tell the parent page "Data was saved successfully, refresh the table."
//initial & isEdit: This tells the modal if it should be empty (New) or filled with existing data (Edit).
export default function AddCategoryModal({
    onClose,
    onSaved,
    initial,
    isEdit = false,
}: Props) {
    //This section creates the "memory" for the form.
    //The ?? '' syntax means: "If initial.name exists, use it. If it doesn't exist (is null), use an empty string." saving and error keep track of whether the data is currently being sent to the server, and if there was an error while doing so.
    const [name,    setName]    = useState(initial?.name  ?? '')
    const [color,   setColor]   = useState(initial?.color ?? '#6366F1')
    const [icon,    setIcon]    = useState(initial?.icon  ?? '📦')
    const [saving,  setSaving]  = useState(false)
    const [error,   setError]   = useState<string | null>(null)


    //The Logic (handleSubmit) - When the user clicks "Save," this function runs:
//e.preventDefault(): Stops the page from refreshing (the default browser behavior for forms).
//if (name.trim().length === 0): Checks if the user actually typed a name. If not, it stops.
//setSaving(true): Disables the buttons so the user can't click "Save" twice.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (name.trim().length === 0) {
            setError('Category name is required')
            return
        }

        setSaving(true)

        //Success/Failure: If the server says "OK," it calls onSaved() and closes the modal. If the server fails, the catch block captures the error and displays it.
        try {
            let saved: Category

            //The "If" Block: If isEdit is true: It calls categoryApi.update (to change an existing category).
            if (isEdit && initial?.id != null) {
                // Update existing
                saved = await categoryApi.update(initial.id, {
                    name:  name.trim(),
                    color: color,
                    icon:  icon,
                })
                toast.success('Category updated!')
            } else {
                // Create new - Else: It calls categoryApi.create (to make a new one).
                saved = await categoryApi.create({
                    name:  name.trim(),
                    color: color,
                    icon:  icon,
                })
                toast.success('Category created!')
            }

            onSaved(saved)
            onClose()

        } catch (err: unknown) {
            const message = getErrorMessage(err)
            setError(message)
        } finally {
            setSaving(false)
        }
    }


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal"
                style={{ maxWidth: '460px' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="modal-header">
                    <h2>
                        {isEdit ? 'Edit Category' : 'Add Category'}
                    </h2>
                    <button className="btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Error */}
                {error != null && (
                    <div className="auth-error" style={{ marginBottom: '16px' }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modal-form">

                    {/* Preview */}
                    <div className="category-preview">
                        <div
                            className="preview-badge"
                            style={{
                                background: color + '20',
                                border:     `2px solid ${color}`,
                                color:      color,
                            }}
                        >
                            <span className="preview-icon">{icon}</span>
                            <span className="preview-name">
                                {name.length > 0 ? name : 'Category Name'}
                            </span>
                        </div>
                        <p className="preview-label">Preview</p>
                    </div>

                    {/* Name */}
                    <div className="form-group">
                        <label>Category Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Entertainment, Work, Health..."
                            maxLength={50}
                            required
                            autoFocus
                        />
                        <span className="char-count">
                            {name.length}/50
                        </span>
                    </div>

                    {/* Icon Picker */}
                    <div className="form-group">
                        <label>Choose Icon</label>
                        <div className="icon-grid">
                    {/*The code uses PRESET_ICONS.map(...) and PRESET_COLORS.map(...). This is a powerful React trick: instead of writing 20 buttons for icons manually, it loops through the list and creates a button for every emoji automatically.*/}
                            {PRESET_ICONS.map((emoji, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`icon-btn ${icon === emoji ? 'icon-btn-active' : ''}`}
                                    style={icon === emoji
                                        ? { borderColor: color, background: color + '20' }
                                        : {}
                                    }
                                    onClick={() => setIcon(emoji)}
                                    title={emoji}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="form-group">
                        <label>Choose Color</label>

                        {/* Preset colors */}
                        <div className="color-grid">
                            {PRESET_COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`color-btn ${color === c ? 'color-btn-active' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => setColor(c)}
                                    title={c}
                                >
                                    {color === c && (
                                        <span className="color-check">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Custom color input */}
                        <div className="custom-color-row">
                            <input
                                type="color"
                                value={color}
                                onChange={e => setColor(e.target.value)}
                                className="color-picker"
                                title="Custom color"
                            />
                            <span className="color-hex">{color}</span>
                            <span className="color-hint">
                                Or pick custom color →
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    {/*Buttons: The Save button changes its text based on the state (saving) and whether we are in "Edit" mode or "Create" mode.*/}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={saving || name.trim().length === 0}
                        >
                            {saving
                                ? (isEdit ? 'Saving...' : 'Creating...')
                                : (isEdit ? 'Save Changes' : 'Create Category')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Error message helper
//Helper Function (getErrorMessage) - This is a small utility at the very bottom. Servers often send back very messy error messages. This function looks through that mess and extracts a simple, human-readable sentence so you can show it to the user.
function getErrorMessage(err: unknown): string {
    if (
        err != null &&
        typeof err === 'object' &&
        'response' in err
    ) {
        const resp = (err as {
            response: { data: { message: string } }
        }).response
        return resp?.data?.message ?? 'Something went wrong'
    }
    return 'Something went wrong'
}