import permit, { LoginMethod } from '@permitio/permit-js';

export class App {
    private permit: typeof permit;
    private initialized: boolean = false;

    constructor() {
        console.log('App constructor called');
        this.permit = permit;
    }

    /**
     * Initialize the application
     * @param permitConfig - Configuration for Permit.io SDK
     */
    public async init(permitConfig?: any): Promise<void> {
        if (this.initialized) {
            console.warn('App already initialized');
            return;
        }

        console.log('Initializing application...');

        if (permitConfig) {
            await this.initPermit(permitConfig);
        }

        this.setupEventListeners();
        this.initialized = true;

        console.log('Application initialized successfully');
    }

    /**
     * Setup message handler for Permit.io iframe responses
     */
    // private setupPermitResponseHandler(): Promise<void> {
    //     return new Promise((resolve, reject) => {
    //         const handleMessage = (event: MessageEvent) => {
    //             console.log('📬 Raw message received:', event.data, 'Type:', typeof event.data);
                
    //             // Try to parse if it's a string
    //             let data = event.data;
    //             if (typeof event.data === 'string') {
    //                 try {
    //                     data = JSON.parse(event.data);
    //                     console.log('📬 Parsed message:', data);
    //                 } catch (e) {
    //                     console.log('Could not parse message as JSON:', event.data);
    //                     return;
    //                 }
    //             }
                
    //             // Check if this is a Permit response
    //             if (data && typeof data === 'object') {
    //                 if (data.success === true) {
    //                     console.log('✅ Permit login successful, user:', data.me);
    //                     window.removeEventListener('message', handleMessage);
    //                     resolve();
    //                 } else if (data.success === false) {
    //                     console.error('❌ Permit login failed:', data.error);
    //                     window.removeEventListener('message', handleMessage);
    //                     reject(new Error(data.error || 'Permit login failed'));
    //                 }
    //             }
    //         };
            
    //         window.addEventListener('message', handleMessage);
            
    //         // Timeout after 30 seconds
    //         setTimeout(() => {
    //             window.removeEventListener('message', handleMessage);
    //             reject(new Error('Permit login timeout - no response from iframe'));
    //         }, 30000);
    //     });
    // }

    /**
     * Initialize Permit.io SDK
     */
    private async initPermit(config: any): Promise<void> {
        console.log('Initializing Permit.io...');

        try {
            // Set up response handler BEFORE calling login
            // const responseHandler = this.setupPermitResponseHandler();
            
            // Call login with correct parameters
            console.log('Calling permit.elements.login with config:', {
                loginUrl: config.loginUrl,
                elementIframeUrl: config.elementIframeUrl,
                tenant:  config.tenant,
                loginMethod: LoginMethod.supportsPrivateBrowser,
            });
            
            await this.permit.elements.login({
                loginUrl: config.loginUrl,
                loginMethod: LoginMethod.supportsPrivateBrowser,
                elementIframeUrl: config.elementIframeUrl,
                tenant: config.tenant,
            });
            
            // Wait for the iframe response
            // await responseHandler;
            
            console.log('Permit.io initialized successfully');
        } catch (error) {
            console.error('Permit.io initialization error:', error);
            throw error;
        }
    }

    /**
     * Setup message monitoring for postMessage communication with iframes
     */
    private setupMessageMonitoring(): void {
        window.addEventListener('message', (event) => {
            // Log all postMessage events
            console.group('📨 PostMessage Event');
            console.log('Origin:', event.origin);
            console.log('Data:', event.data);
            console.log('Source:', event.source === window ? 'window' : 'iframe');
            console.log('Timestamp:', new Date().toISOString());
            console.groupEnd();
        });
    }

    /**
     * Setup event listeners for the application
     */
    private setupEventListeners(): void {
        console.log('Setting up event listeners...');

        // Setup message monitoring first
        // this.setupMessageMonitoring();

        // Example: Listen for document ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMReady();
            });
        } else {
            this.onDOMReady();
        }
    }

    /**
     * Called when DOM is ready
     */
    private onDOMReady(): void {
        console.log('DOM is ready');
    }

    /**
     * Get the Permit instance
     */
    public getPermit(): typeof permit {
        return this.permit;
    }

    /**
     * Check if app is initialized
     */
    public isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Display a message bar at the top of the screen
     * @param message - Message to display
     * @param type - Message type: 'success' (green), 'error' (red), 'info' (blue), 'warning' (yellow)
     * @param position - Position of the message bar: 'top' or 'bottom'
     * @param duration - Duration in milliseconds before auto-hiding (default: 10000)
     */
    public showMessageBar(
        message: string,
        type: 'success' | 'error' | 'info' | 'warning' = 'success',
        position: 'top' | 'bottom' = 'top',
        duration: number = 10000
    ): void {
        // Create message bar element
        const messageBar = document.createElement('div');
        messageBar.className = 'message-bar';
        messageBar.textContent = message;
        
        // Set colors based on type
        const colors: Record<string, { bg: string, text: string }> = {
            success: { bg: '#28a745', text: '#ffffff' },
            error: { bg: '#dc3545', text: '#ffffff' },
            info: { bg: '#17a2b8', text: '#ffffff' },
            warning: { bg: '#ffc107', text: '#000000' }
        };
        
        const colorScheme = colors[type] || colors.success;
        
        // Apply styles
        Object.assign(messageBar.style, {
            position: 'fixed',
            [position]: '0',
            left: '0',
            width: '100%',
            padding: '16px 20px',
            backgroundColor: colorScheme.bg,
            color: colorScheme.text,
            fontSize: '16px',
            fontWeight: '500',
            textAlign: 'center',
            zIndex: '9999',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            opacity: '0',
            transition: 'opacity 0.3s ease-in-out',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
        });
        
        // Add to document
        document.body.appendChild(messageBar);
        
        // Trigger fade-in animation
        setTimeout(() => {
            messageBar.style.opacity = '1';
        }, 10);
        
        // Auto-hide after duration
        setTimeout(() => {
            // Fade out
            messageBar.style.opacity = '0';
            
            // Remove from DOM after fade-out completes
            setTimeout(() => {
                if (messageBar.parentNode) {
                    document.body.removeChild(messageBar);
                }
            }, 300);
        }, duration);
    }

    /**
     * Example method to show a greeting
     */
    public showHello(): void {
        console.log('Hello from the app!');
        this.showMessageBar('Hello from the SPA!', 'success');
    }

    /**
     * Setup countdown timer for token expiry
     * @param initialSeconds - Initial seconds before expiry
     * @param elementId - ID of the element to update with countdown
     */
    public setupCountdown(initialSeconds: number, elementId: string = 'expireinfo'): void {
        let secondsLeft = initialSeconds;

        const updateCountdown = () => {
            const element = document.getElementById(elementId);
            if (!element) {
                console.warn(`Element with ID '${elementId}' not found`);
                return;
            }

            if (secondsLeft > 0) {
                const min = Math.floor(secondsLeft / 60);
                const sec = secondsLeft % 60;
                element.textContent = `${min} min ${sec} sec left`;
                secondsLeft--;
            } else {
                element.textContent = 'expired';
            }
        };

        // Update immediately and then every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    /**
     * Setup Permit login button with dynamic iframe loading
     * @param config - Configuration object
     */
    public setupPermitLoginButton(config: {
        buttonId: string;
        containerBodyId: string;
        iframeUrl: string;
        loginUrl: string;
        tenant?: string;
        panelId?: string;
    }): void {
        const loginBtn = document.getElementById(config.buttonId) as HTMLButtonElement;
        const permitAccessBody = document.getElementById(config.containerBodyId);

        if (!loginBtn || !permitAccessBody) {
            console.error('Required elements not found for Permit login setup');
            return;
        }

        let permitLoggedIn = false;

        loginBtn.addEventListener('click', async () => {
            if (permitLoggedIn) {
                console.log('Already logged in to Permit');
                return;
            }

            console.log('🔐 Login to Permit button clicked');

            // Disable button and show loading state
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';

            try {
                // Clear the placeholder message
                permitAccessBody.innerHTML = '';

                // Create iframe in DOM FIRST (before login call)
                const iframe = document.createElement('iframe');
                iframe.src = config.iframeUrl;
                iframe.title = 'Permit Element workspace-access-management';
                iframe.width = '100%';
                iframe.height = '400';
                iframe.style.border = '1px solid #ccc';
                iframe.style.borderRadius = '8px';
                permitAccessBody.appendChild(iframe);

                // Call initPermit which handles the entire login flow
                await this.initPermit({
                    loginUrl: config.loginUrl,
                    elementIframeUrl: config.iframeUrl
                });

                console.log('✅ Permit.io login successful');
                permitLoggedIn = true;
                

                // Expand the panel if collapsed and panelId provided
                if (config.panelId) {
                    const manageAccessPanel = document.getElementById(config.panelId);
                    if (manageAccessPanel && !manageAccessPanel.classList.contains('show')) {
                        // Check if bootstrap is available
                        if (typeof (window as any).bootstrap !== 'undefined') {
                            new (window as any).bootstrap.Collapse(manageAccessPanel, {
                                toggle: true
                            });
                        }
                    }
                }

                // Update button state
                loginBtn.textContent = 'Logged in ✓';
                loginBtn.classList.remove('btn-light');
                loginBtn.classList.add('btn-success');
                // Show success message bar
                this.showMessageBar('Successfully logged in to Permit.io', 'success');
            } catch (error: any) {
                console.error('❌ Permit.io login error:', error);

                // Clear the iframe on error
                permitAccessBody.innerHTML = '<p class="text-muted">Click "Login to Permit" to load the access management interface.</p>';

                // Re-enable button on error
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login to Permit';

                this.showMessageBar('Error logging in to Permit.io: ' + error.message, 'error');
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Initializing App');
    
    const app = new App();
    
    // Make app available globally
    (window as any).app = app;
    
    console.log('✅ App initialized and available as window.app');
});
