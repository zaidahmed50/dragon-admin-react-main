import React from 'react';
import { Button, Card, CardContent, Chip, TextField, Alert } from '@mui/material';
import { useAppTheme } from '../../theme/useAppTheme';

/**
 * ColorShowcase Component
 * Demonstrates dynamic theme colors in action
 * 
 * Usage: Add to any route to see theme colors working
 */
const ColorShowcase = () => {
    const { colors, isDark, mode } = useAppTheme();

    return (
        <div style={{
            padding: '40px',
            backgroundColor: 'var(--bg-default)',
            minHeight: '100vh',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <Card style={{ marginBottom: '30px' }}>
                    <CardContent>
                        <h1 style={{ 
                            color: 'var(--color-primary)',
                            marginBottom: '10px'
                        }}>
                            🎨 Dynamic Theme Showcase
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                            Current Mode: <strong>{mode.toUpperCase()}</strong> | 
                            All colors update automatically when you change the primary color or theme!
                        </p>
                    </CardContent>
                </Card>

                {/* Buttons Section */}
                <Card style={{ marginBottom: '30px' }}>
                    <CardContent>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
                            Material-UI Buttons (Auto-Themed)
                        </h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Button variant="contained" color="primary">
                                Primary Button
                            </Button>
                            <Button variant="outlined" color="primary">
                                Outlined Button
                            </Button>
                            <Button variant="text" color="primary">
                                Text Button
                            </Button>
                            <Button variant="contained" color="success">
                                Success
                            </Button>
                            <Button variant="contained" color="error">
                                Error
                            </Button>
                            <Button variant="contained" color="warning">
                                Warning
                            </Button>
                            <Button variant="contained" color="info">
                                Info
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* CSS Variables Section */}
                <Card style={{ marginBottom: '30px' }}>
                    <CardContent>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
                            CSS Variables in Action
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            {/* Primary */}
                            <div style={{
                                padding: '20px',
                                background: 'var(--color-primary)',
                                color: 'white',
                                borderRadius: '8px',
                                textAlign: 'center',
                                fontWeight: 600,
                            }}>
                                Primary Color
                            </div>
                            
                            {/* Success */}
                            <div style={{
                                padding: '20px',
                                background: 'var(--color-success)',
                                color: 'white',
                                borderRadius: '8px',
                                textAlign: 'center',
                                fontWeight: 600,
                            }}>
                                Success Color
                            </div>
                            
                            {/* Danger */}
                            <div style={{
                                padding: '20px',
                                background: 'var(--color-danger)',
                                color: 'white',
                                borderRadius: '8px',
                                textAlign: 'center',
                                fontWeight: 600,
                            }}>
                                Danger Color
                            </div>
                            
                            {/* Warning */}
                            <div style={{
                                padding: '20px',
                                background: 'var(--color-warning)',
                                color: 'white',
                                borderRadius: '8px',
                                textAlign: 'center',
                                fontWeight: 600,
                            }}>
                                Warning Color
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Chips */}
                <Card style={{ marginBottom: '30px' }}>
                    <CardContent>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
                            Status Chips
                        </h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Chip label="Primary" color="primary" />
                            <Chip label="Success" color="success" />
                            <Chip label="Error" color="error" />
                            <Chip label="Warning" color="warning" />
                            <Chip label="Info" color="info" />
                            <Chip label="Default" />
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts */}
                <Card style={{ marginBottom: '30px' }}>
                    <CardContent>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
                            Alerts
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <Alert severity="success">
                                This is a success alert — check it out!
                            </Alert>
                            <Alert severity="info">
                                This is an info alert — informative!
                            </Alert>
                            <Alert severity="warning">
                                This is a warning alert — be careful!
                            </Alert>
                            <Alert severity="error">
                                This is an error alert — something went wrong!
                            </Alert>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Elements */}
                <Card style={{ marginBottom: '30px' }}>
                    <CardContent>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
                            Form Elements
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <TextField 
                                label="Primary Color Input" 
                                variant="outlined" 
                                color="primary"
                                fullWidth
                            />
                            <TextField 
                                label="Success Color Input" 
                                variant="outlined" 
                                color="success"
                                fullWidth
                            />
                            <TextField 
                                label="Error Color Input" 
                                variant="outlined" 
                                color="error"
                                fullWidth
                                helperText="This is using the error color"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Soft Backgrounds */}
                <Card style={{ marginBottom: '30px' }}>
                    <CardContent>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
                            Soft Background Colors
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            <div style={{
                                padding: '20px',
                                background: 'var(--bg-soft-primary)',
                                color: 'var(--color-primary)',
                                borderRadius: '8px',
                                border: '1px solid var(--color-primary)',
                                textAlign: 'center',
                                fontWeight: 600,
                            }}>
                                Primary Soft
                            </div>
                            
                            <div style={{
                                padding: '20px',
                                background: 'var(--bg-soft-success)',
                                color: 'var(--color-success)',
                                borderRadius: '8px',
                                border: '1px solid var(--color-success)',
                                textAlign: 'center',
                                fontWeight: 600,
                            }}>
                                Success Soft
                            </div>
                            
                            <div style={{
                                padding: '20px',
                                background: 'var(--bg-soft-danger)',
                                color: 'var(--color-danger)',
                                borderRadius: '8px',
                                border: '1px solid var(--color-danger)',
                                textAlign: 'center',
                                fontWeight: 600,
                            }}>
                                Danger Soft
                            </div>
                            
                            <div style={{
                                padding: '20px',
                                background: 'var(--bg-soft-warning)',
                                color: 'var(--color-warning)',
                                borderRadius: '8px',
                                border: '1px solid var(--color-warning)',
                                textAlign: 'center',
                                fontWeight: 600,
                            }}>
                                Warning Soft
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* React Hook Example */}
                <Card>
                    <CardContent>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
                            Using useAppTheme() Hook
                        </h3>
                        <div style={{
                            padding: '20px',
                            background: colors.background.paper,
                            border: `1px solid ${colors.border.main}`,
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                        }}>
                            <div style={{ color: colors.text.primary, marginBottom: '10px' }}>
                                <strong>Mode:</strong> {mode}
                            </div>
                            <div style={{ color: colors.text.primary, marginBottom: '10px' }}>
                                <strong>Is Dark:</strong> {isDark ? 'Yes' : 'No'}
                            </div>
                            <div style={{ color: colors.text.primary, marginBottom: '10px' }}>
                                <strong>Background Default:</strong> {colors.background.default}
                            </div>
                            <div style={{ color: colors.text.primary, marginBottom: '10px' }}>
                                <strong>Text Primary:</strong> {colors.text.primary}
                            </div>
                            <div style={{ color: colors.text.primary }}>
                                <strong>Border Main:</strong> {colors.border.main}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions */}
                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: 'var(--bg-soft-info)',
                    borderLeft: '4px solid var(--color-info)',
                    borderRadius: '4px',
                }}>
                    <h4 style={{ color: 'var(--color-info-dark)', marginTop: 0 }}>
                        💡 Try It Out!
                    </h4>
                    <p style={{ color: 'var(--text-primary)', margin: '10px 0' }}>
                        1. Click the settings icon (⚙️) to open the Theme Customizer
                    </p>
                    <p style={{ color: 'var(--text-primary)', margin: '10px 0' }}>
                        2. Change the primary color and watch everything update!
                    </p>
                    <p style={{ color: 'var(--text-primary)', margin: '10px 0' }}>
                        3. Toggle between Light and Dark modes
                    </p>
                    <p style={{ color: 'var(--text-primary)', margin: '10px 0' }}>
                        4. Try different font families
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ColorShowcase;
