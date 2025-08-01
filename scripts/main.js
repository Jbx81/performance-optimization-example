/**
 * Main Application Module
 * Initializes all performance optimization components
 */

class PerformanceOptimizationApp {
    constructor() {
        this.components = new Map();
        this.isInitialized = false;
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing Performance Optimization Demo');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('📋 DOM Content Loaded - Starting setup');
                this.setupApplication();
            });
        } else {
            console.log('📋 DOM already ready - Starting setup');
            this.setupApplication();
        }
    }
    
    /**
     * Setup the application
     */
    setupApplication() {
        try {
            console.log('🔧 Step 1: Initializing components...');
            this.initializeComponents();
            console.log('🔧 Step 2: Setting up global event listeners...');
            this.setupGlobalEventListeners();
            console.log('🔧 Step 3: Starting performance monitoring...');
            this.startPerformanceMonitoring();
            console.log('🔧 Step 4: Creating application interface...');
            this.createApplicationInterface();
            
            this.isInitialized = true;
            console.log('✅ Performance Optimization Demo initialized successfully');
        } catch (error) {
            console.error('❌ Error during application setup:', error);
            // Don't let errors crash the page
        }
    }
    
    /**
     * Initialize all components
     */
    initializeComponents() {
        try {
            // Initialize performance tracking
            if (window.performanceTracker) {
                this.components.set('performanceTracker', window.performanceTracker);
            }
            
            // Initialize event optimization
            if (window.eventOptimizer) {
                this.components.set('eventOptimizer', window.eventOptimizer);
            }
            
            // Initialize lazy loading
            if (window.lazyLoader) {
                this.components.set('lazyLoader', window.lazyLoader);
            }
            
            // Initialize DOM optimization
            if (window.domOptimizer) {
                this.components.set('domOptimizer', window.domOptimizer);
            }
            
            // Initialize virtual scrolling
            if (window.virtualScroller) {
                this.components.set('virtualScroller', window.virtualScroller);
            }
            
            console.log(`📦 Initialized ${this.components.size} components`);
        } catch (error) {
            console.error('❌ Error initializing components:', error);
        }
    }
    
    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        try {
            // Handle page visibility changes
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseExpensiveOperations();
                } else {
                    this.resumeExpensiveOperations();
                }
            }, { passive: true });
            
            // Handle window focus/blur
            window.addEventListener('focus', () => {
                this.onWindowFocus();
            }, { passive: true });
            
            window.addEventListener('blur', () => {
                this.onWindowBlur();
            }, { passive: true });
            
            // Handle online/offline status
            window.addEventListener('online', () => {
                this.onOnline();
            }, { passive: true });
            
            window.addEventListener('offline', () => {
                this.onOffline();
            }, { passive: true });
        } catch (error) {
            console.error('❌ Error setting up global event listeners:', error);
        }
    }
    
    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        try {
            // Monitor for performance issues
            setInterval(() => {
                try {
                    this.checkPerformanceHealth();
                } catch (error) {
                    console.error('❌ Error in performance health check:', error);
                }
            }, 5000); // Every 5 seconds
            
            // Monitor for memory leaks
            setInterval(() => {
                try {
                    this.checkMemoryUsage();
                } catch (error) {
                    console.error('❌ Error in memory usage check:', error);
                }
            }, 10000); // Every 10 seconds
        } catch (error) {
            console.error('❌ Error starting performance monitoring:', error);
        }
    }
    
    /**
     * Create application interface
     */
    createApplicationInterface() {
        try {
            console.log('🔧 Creating performance panel...');
            // Temporarily disable panel creation to test if panels are causing the issue
            // this.createPerformancePanel();
            console.log('🔧 Creating controls panel...');
            // this.createControlsPanel();
            console.log('🔧 Creating info panel...');
            // this.createInfoPanel();
            console.log('✅ All panels created successfully (disabled for testing)');
        } catch (error) {
            console.error('❌ Error creating application interface:', error);
        }
    }
    
    /**
     * Create performance monitoring panel
     */
    createPerformancePanel() {
        try {
            const panel = document.createElement('div');
            panel.className = 'performance-panel';
            panel.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                z-index: 1000;
                min-width: 200px;
            `;
            
            panel.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: bold;">Performance Monitor</div>
                <div id="performance-stats"></div>
            `;
            
            document.body.appendChild(panel);
            
            // Update stats every second
            setInterval(() => {
                try {
                    this.updatePerformanceStats();
                } catch (error) {
                    console.error('Error updating performance stats:', error);
                }
            }, 1000);
        } catch (error) {
            console.error('❌ Error creating performance panel:', error);
        }
    }
    
    /**
     * Create controls panel
     */
    createControlsPanel() {
        try {
            const panel = document.createElement('div');
            panel.className = 'controls-panel';
            panel.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 8px;
                z-index: 1000;
            `;
            
            panel.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: bold;">Controls</div>
                <button id="export-data" style="margin: 5px; padding: 5px 10px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Export Data</button>
                <button id="clear-cache" style="margin: 5px; padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Clear Cache</button>
                <button id="performance-report" style="margin: 5px; padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Performance Report</button>
            `;
            
            document.body.appendChild(panel);
            
            // Add event listeners
            document.getElementById('export-data')?.addEventListener('click', () => {
                this.exportPerformanceData();
            });
            
            document.getElementById('clear-cache')?.addEventListener('click', () => {
                this.clearAllCaches();
            });
            
            document.getElementById('performance-report')?.addEventListener('click', () => {
                this.generatePerformanceReport();
            });
        } catch (error) {
            console.error('❌ Error creating controls panel:', error);
        }
    }
    
    /**
     * Create info panel
     */
    createInfoPanel() {
        try {
            const panel = document.createElement('div');
            panel.className = 'info-panel';
            panel.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 8px;
                max-width: 300px;
                z-index: 1000;
            `;
            
            panel.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: bold;">Performance Optimization Demo</div>
                <div style="font-size: 12px; line-height: 1.4;">
                    This demo showcases senior frontend development skills including:
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Debouncing & Throttling</li>
                        <li>Lazy Loading</li>
                        <li>Virtual Scrolling</li>
                        <li>DOM Optimization</li>
                        <li>Performance Monitoring</li>
                    </ul>
                    <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">
                        Check the browser console for detailed performance metrics.
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
        } catch (error) {
            console.error('❌ Error creating info panel:', error);
        }
    }
    
    /**
     * Update performance statistics
     */
    updatePerformanceStats() {
        const statsElement = document.getElementById('performance-stats');
        if (!statsElement) return;
        
        const metrics = window.performanceTracker?.getMetrics() || {};
        const memory = window.PerformanceUtils?.getMemoryUsage();
        
        statsElement.innerHTML = `
            <div>FPS: ${metrics.fps || 0}</div>
            <div>Memory: ${memory ? `${memory.used}MB` : 'N/A'}</div>
            <div>DOM Nodes: ${metrics.domNodes || 0}</div>
            <div>Time: ${new Date().toLocaleTimeString()}</div>
        `;
    }
    
    /**
     * Export performance data
     */
    exportPerformanceData() {
        if (window.performanceReporter) {
            const data = window.performanceReporter.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `performance-data-${new Date().toISOString().slice(0, 19)}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
        }
    }
    
    /**
     * Clear all caches
     */
    clearAllCaches() {
        // Clear DOM query cache
        if (window.domQueryCache) {
            window.domQueryCache.clearCache();
        }
        
        // Clear performance monitor cache
        if (window.performanceMonitor) {
            window.performanceMonitor.metrics.clear();
        }
        
        console.log('🧹 All caches cleared');
        alert('All caches have been cleared');
    }
    
    /**
     * Generate performance report
     */
    generatePerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            performance: window.performanceTracker?.getMetrics(),
            memory: window.PerformanceUtils?.getMemoryUsage(),
            recommendations: this.getPerformanceRecommendations()
        };
        
        console.log('📊 Performance Report:', report);
        
        // Create downloadable report
        const data = JSON.stringify(report, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${new Date().toISOString().slice(0, 19)}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    /**
     * Get performance recommendations
     * @returns {Array} Performance recommendations
     */
    getPerformanceRecommendations() {
        const recommendations = [];
        
        // Check FPS
        const metrics = window.performanceTracker?.getMetrics();
        if (metrics && metrics.fps < 30) {
            recommendations.push('Low FPS detected. Consider optimizing animations and reducing DOM updates.');
        }
        
        // Check memory usage
        const memory = window.PerformanceUtils?.getMemoryUsage();
        if (memory && memory.used > 50) {
            recommendations.push('High memory usage detected. Consider implementing memory cleanup.');
        }
        
        // Check DOM size
        if (metrics && metrics.domNodes > 2000) {
            recommendations.push('Large DOM detected. Consider virtual scrolling for large lists.');
        }
        
        return recommendations;
    }
    
    /**
     * Check performance health
     */
    checkPerformanceHealth() {
        const metrics = window.performanceTracker?.getMetrics();
        
        if (metrics) {
            // Check for performance issues
            if (metrics.fps < 30) {
                console.warn('⚠️ Low FPS detected:', metrics.fps);
            }
            
            if (metrics.domNodes > 5000) {
                console.warn('⚠️ Large DOM detected:', metrics.domNodes, 'nodes');
            }
        }
        
        const memory = window.PerformanceUtils?.getMemoryUsage();
        if (memory && memory.used > 100) {
            console.warn('⚠️ High memory usage:', memory.used, 'MB');
        }
    }
    
    /**
     * Check memory usage
     */
    checkMemoryUsage() {
        const memory = window.PerformanceUtils?.getMemoryUsage();
        if (memory) {
            const usagePercent = (memory.used / memory.limit) * 100;
            
            if (usagePercent > 80) {
                console.warn('🚨 Critical memory usage:', usagePercent.toFixed(1) + '%');
            } else if (usagePercent > 60) {
                console.warn('⚠️ High memory usage:', usagePercent.toFixed(1) + '%');
            }
        }
    }
    
    /**
     * Pause expensive operations
     */
    pauseExpensiveOperations() {
        console.log('⏸️ Pausing expensive operations (page hidden)');
        
        // Pause performance monitoring
        if (window.performanceTracker) {
            window.performanceTracker.cleanup();
        }
    }
    
    /**
     * Resume expensive operations
     */
    resumeExpensiveOperations() {
        console.log('▶️ Resuming operations (page visible)');
        
        // Resume performance monitoring
        if (window.performanceTracker) {
            window.performanceTracker.init();
        }
    }
    
    /**
     * Handle window focus
     */
    onWindowFocus() {
        console.log('🎯 Window focused');
    }
    
    /**
     * Handle window blur
     */
    onWindowBlur() {
        console.log('👁️ Window blurred');
    }
    
    /**
     * Handle online status
     */
    onOnline() {
        console.log('🌐 Back online');
    }
    
    /**
     * Handle offline status
     */
    onOffline() {
        console.log('📴 Gone offline');
    }
    
    /**
     * Get application status
     * @returns {Object} Application status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            components: Array.from(this.components.keys()),
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Cleanup application
     */
    cleanup() {
        console.log('🧹 Cleaning up Performance Optimization Demo');
        
        // Cleanup all components
        this.components.forEach((component, name) => {
            if (component.cleanup) {
                component.cleanup();
            }
        });
        
        // Remove UI panels
        document.querySelectorAll('.performance-panel, .controls-panel, .info-panel').forEach(panel => {
            panel.remove();
        });
        
        this.components.clear();
        this.isInitialized = false;
    }
}

// Initialize application
const app = new PerformanceOptimizationApp();

// Make app globally accessible
window.PerformanceOptimizationApp = app;

// Handle page unload
window.addEventListener('beforeunload', () => {
    app.cleanup();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('📄 Page hidden');
    } else {
        console.log('📄 Page visible');
    }
});

// Log application startup
console.log(`
🎉 Performance Optimization Demo Loaded!

This application demonstrates senior frontend development skills including:

📊 Performance Monitoring
⚡ Event Optimization (Debouncing/Throttling)
🖼️ Lazy Loading
📜 Virtual Scrolling
🔧 DOM Optimization
🎨 CSS Performance
📈 Real-time Metrics

Check the browser console for detailed performance information.
`);

// Export useful functions to global scope for debugging
window.debug = {
    getPerformanceMetrics: () => window.performanceTracker?.getMetrics(),
    getMemoryUsage: () => window.PerformanceUtils?.getMemoryUsage(),
    getDOMNodes: () => window.PerformanceUtils?.countDOMNodes(),
    exportData: () => window.performanceReporter?.exportData(),
    getAppStatus: () => app.getStatus()
}; 