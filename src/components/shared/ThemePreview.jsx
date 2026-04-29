import React from 'react';
import { useAppTheme } from '../../theme/useAppTheme';
import { colorPalette } from '../../theme/colors';

const ThemePreview = () => {
    const { colors, isDark, mode } = useAppTheme();

    const ColorSwatch = ({ color, name, description }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: 'var(--bg-paper)',
            borderRadius: '4px',
            border: '1px solid var(--border-main)',
        }}>
            <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: color,
                borderRadius: '4px',
                marginRight: '15px',
                border: '1px solid var(--border-main)',
            }}></div>
            <div>
                <div style={{ 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    marginBottom: '4px'
                }}>
                    {name}
                </div>
                <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--text-secondary)',
                    fontFamily: 'monospace'
                }}>
                    {color}
                </div>
                {description && (
                    <div style={{ 
                        fontSize: '0.7rem', 
                        color: 'var(--text-disabled)',
                        marginTop: '4px'
                    }}>
                        {description}
                    </div>
                )}
            </div>
        </div>
    );

    const Section = ({ title, children }) => (
        <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
                color: 'var(--text-primary)',
                borderBottom: '2px solid var(--color-primary)',
                paddingBottom: '8px',
                marginBottom: '15px'
            }}>
                {title}
            </h3>
            {children}
        </div>
    );

    return (
        <div style={{
            padding: '40px',
            backgroundColor: 'var(--bg-default)',
            minHeight: '100vh',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
            }}>
                <div style={{
                    backgroundColor: 'var(--bg-paper)',
                    padding: '30px',
                    borderRadius: '8px',
                    marginBottom: '30px',
                    border: '1px solid var(--border-main)',
                }}>
                    <h1 style={{ 
                        color: 'var(--text-primary)',
                        marginBottom: '10px'
                    }}>
                        🎨 Theme Color Preview
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Current Mode: <strong style={{ color: 'var(--color-primary)' }}>{mode.toUpperCase()}</strong>
                    </p>
                    <p style={{ 
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem'
                    }}>
                        Use the Theme Customizer (settings icon) to switch between light and dark modes
                        and see how all colors adapt automatically.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '30px',
                }}>
                    {/* Column 1 */}
                    <div>
                        <Section title="Primary Colors">
                            <ColorSwatch 
                                color={colorPalette.primary.main} 
                                name="Primary" 
                                description="Main brand color - var(--color-primary)"
                            />
                            <ColorSwatch 
                                color={colorPalette.primary.light} 
                                name="Primary Light" 
                                description="var(--color-primary-light)"
                            />
                            <ColorSwatch 
                                color={colorPalette.primary.dark} 
                                name="Primary Dark" 
                                description="var(--color-primary-dark)"
                            />
                        </Section>

                        <Section title="Status Colors">
                            <ColorSwatch 
                                color={colorPalette.success.main} 
                                name="Success" 
                                description="var(--color-success)"
                            />
                            <ColorSwatch 
                                color={colorPalette.danger.main} 
                                name="Danger" 
                                description="var(--color-danger)"
                            />
                            <ColorSwatch 
                                color={colorPalette.warning.main} 
                                name="Warning" 
                                description="var(--color-warning)"
                            />
                            <ColorSwatch 
                                color={colorPalette.info.main} 
                                name="Info" 
                                description="var(--color-info)"
                            />
                        </Section>

                        <Section title="Units Colors">
                            <ColorSwatch 
                                color={colorPalette.brand.teal} 
                                name="Teal" 
                                description="var(--color-teal)"
                            />
                            <ColorSwatch 
                                color={colorPalette.brand.cyan} 
                                name="Cyan" 
                                description="var(--color-cyan)"
                            />
                            <ColorSwatch 
                                color={colorPalette.brand.indigo} 
                                name="Indigo" 
                                description="var(--color-indigo)"
                            />
                            <ColorSwatch 
                                color={colorPalette.brand.purple} 
                                name="Purple" 
                                description="var(--color-purple)"
                            />
                        </Section>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <Section title="Background Colors (Theme-Aware)">
                            <ColorSwatch 
                                color={colors.background.default} 
                                name="Background Default" 
                                description="Page background - var(--bg-default)"
                            />
                            <ColorSwatch 
                                color={colors.background.paper} 
                                name="Background Paper" 
                                description="Cards, modals - var(--bg-paper)"
                            />
                        </Section>

                        <Section title="Text Colors (Theme-Aware)">
                            <ColorSwatch 
                                color={colors.text.primary} 
                                name="Text Primary" 
                                description="Main text - var(--text-primary)"
                            />
                            <ColorSwatch 
                                color={colors.text.secondary} 
                                name="Text Secondary" 
                                description="Secondary text - var(--text-secondary)"
                            />
                            <ColorSwatch 
                                color={colors.text.disabled} 
                                name="Text Disabled" 
                                description="Disabled text - var(--text-disabled)"
                            />
                        </Section>

                        <Section title="Border Colors (Theme-Aware)">
                            <ColorSwatch 
                                color={colors.border.main} 
                                name="Border Main" 
                                description="Default borders - var(--border-main)"
                            />
                            <ColorSwatch 
                                color={colors.border.light} 
                                name="Border Light" 
                                description="Light borders - var(--border-light)"
                            />
                            <ColorSwatch 
                                color={colors.border.medium} 
                                name="Border Medium" 
                                description="Medium borders - var(--border-medium)"
                            />
                        </Section>

                        <Section title="Navigation (Theme-Aware)">
                            <ColorSwatch 
                                color={colors.navigation.background} 
                                name="Nav Background" 
                                description="var(--nav-bg)"
                            />
                            <ColorSwatch 
                                color={colors.navigation.hoverColor} 
                                name="Nav Hover" 
                                description="var(--nav-hover-color)"
                            />
                        </Section>
                    </div>
                </div>

                {/* Soft Colors Demo */}
                <div style={{
                    marginTop: '40px',
                    backgroundColor: 'var(--bg-paper)',
                    padding: '30px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-main)',
                }}>
                    <h3 style={{ 
                        color: 'var(--text-primary)',
                        marginBottom: '20px'
                    }}>
                        Soft/Transparent Background Colors
                    </h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {[
                            { bg: 'var(--bg-soft-primary)', color: 'var(--color-primary)', name: 'Primary' },
                            { bg: 'var(--bg-soft-success)', color: 'var(--color-success)', name: 'Success' },
                            { bg: 'var(--bg-soft-danger)', color: 'var(--color-danger)', name: 'Danger' },
                            { bg: 'var(--bg-soft-warning)', color: 'var(--color-warning)', name: 'Warning' },
                            { bg: 'var(--bg-soft-info)', color: 'var(--color-info)', name: 'Info' },
                        ].map(({ bg, color, name }) => (
                            <div key={name} style={{
                                backgroundColor: bg,
                                color: color,
                                padding: '10px 20px',
                                borderRadius: '4px',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                            }}>
                                {name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Component Examples */}
                <div style={{
                    marginTop: '40px',
                    backgroundColor: 'var(--bg-paper)',
                    padding: '30px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-main)',
                }}>
                    <h3 style={{ 
                        color: 'var(--text-primary)',
                        marginBottom: '20px'
                    }}>
                        Component Examples
                    </h3>
                    
                    {/* Buttons */}
                    <div style={{ marginBottom: '30px' }}>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>Buttons</h4>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 500,
                            }}>
                                Primary Button
                            </button>
                            <button style={{
                                backgroundColor: 'var(--color-success)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 500,
                            }}>
                                Success Button
                            </button>
                            <button style={{
                                backgroundColor: 'transparent',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-main)',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 500,
                            }}>
                                Outline Button
                            </button>
                        </div>
                    </div>

                    {/* Cards */}
                    <div>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>Cards</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            {['Primary', 'Success', 'Danger'].map((status) => (
                                <div key={status} style={{
                                    backgroundColor: `var(--bg-soft-${status.toLowerCase()})`,
                                    padding: '20px',
                                    borderRadius: '4px',
                                    border: `1px solid var(--color-${status.toLowerCase()})`,
                                }}>
                                    <h5 style={{ 
                                        color: `var(--color-${status.toLowerCase()})`,
                                        marginBottom: '8px'
                                    }}>
                                        {status} Card
                                    </h5>
                                    <p style={{ 
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.85rem',
                                        margin: 0
                                    }}>
                                        Example card with {status.toLowerCase()} styling
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Usage Note */}
                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    backgroundColor: 'var(--bg-soft-info)',
                    borderLeft: '4px solid var(--color-info)',
                    borderRadius: '4px',
                }}>
                    <strong style={{ color: 'var(--color-info-dark)' }}>💡 Tip:</strong>
                    <span style={{ color: 'var(--text-primary)', marginLeft: '8px' }}>
                        All colors shown here automatically adapt when you switch between light and dark themes.
                        Try it using the Theme Customizer!
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ThemePreview;
