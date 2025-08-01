/**
 * Performance Monitoring Module
 * Real-time performance metrics and monitoring
 */

class PerformanceTracker {
    constructor() {
        this.fpsCounter = $('#fps-counter');
        this.memoryUsage = $('#memory-usage');
        this.domNodes = $('#dom-nodes');
        
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.animationId = null;
        
        this.init();
    }
    
    /**
     * Initialize performance tracking
     */
    init() {
        this.startFPSCounter();
        this.startMemoryTracking();
        this.startDOMTracking();
        
        // Monitor for performance issues
        this.monitorPerformanceIssues();
    }
    
    /**
     * Start FPS counter with requestAnimationFrame
     */
    startFPSCounter() {
        const updateFPS = () => {
            this.frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - this.lastTime >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.updateFPSCounter();
                
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
            
            this.animationId = requestAnimationFrame(updateFPS);
        };
        
        this.animationId = requestAnimationFrame(updateFPS);
    }
    
    /**
     * Update FPS counter display
     */
    updateFPSCounter() {
        if (this.fpsCounter) {
            this.fpsCounter.textContent = `${this.fps} FPS`;
            
            // Color coding based on performance
            if (this.fps >= 55) {
                this.fpsCounter.style.color = '#28a745'; // Green for good performance
            } else if (this.fps >= 30) {
                this.fpsCounter.style.color = '#ffc107'; // Yellow for acceptable
            } else {
                this.fpsCounter.style.color = '#dc3545'; // Red for poor performance
            }
        }
    }
    
    /**
     * Start memory usage tracking
     */
    startMemoryTracking() {
        const updateMemory = () => {
            const memory = window.PerformanceUtils?.getMemoryUsage();
            
            if (memory && this.memoryUsage) {
                const usagePercent = Math.round((memory.used / memory.limit) * 100);
                this.memoryUsage.textContent = `${memory.used}MB / ${memory.limit}MB (${usagePercent}%)`;
                
                // Color coding based on memory usage
                if (usagePercent < 50) {
                    this.memoryUsage.style.color = '#28a745';
                } else if (usagePercent < 80) {
                    this.memoryUsage.style.color = '#ffc107';
                } else {
                    this.memoryUsage.style.color = '#dc3545';
                }
            } else if (this.memoryUsage) {
                this.memoryUsage.textContent = 'Not available';
                this.memoryUsage.style.color = '#6c757d';
            }
        };
        
        // Update immediately and then every 2 seconds
        updateMemory();
        setInterval(updateMemory, 2000);
    }
    
    /**
     * Start DOM node tracking
     */
    startDOMTracking() {
        const updateDOMNodes = () => {
            const nodeCount = window.PerformanceUtils?.countDOMNodes() || 0;
            
            if (this.domNodes) {
                this.domNodes.textContent = nodeCount.toLocaleString();
                
                // Color coding based on DOM size
                if (nodeCount < 1000) {
                    this.domNodes.style.color = '#28a745';
                } else if (nodeCount < 5000) {
                    this.domNodes.style.color = '#ffc107';
                } else {
                    this.domNodes.style.color = '#dc3545';
                }
            }
        };
        
        // Update immediately and then every 5 seconds
        updateDOMNodes();
        setInterval(updateDOMNodes, 5000);
    }
    
    /**
     * Monitor for performance issues
     */
    monitorPerformanceIssues() {
        // Monitor for long tasks
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            console.warn('Long task detected:', {
                                duration: entry.duration,
                                startTime: entry.startTime,
                                name: entry.name
                            });
                            
                            // Notify performance monitor
                            window.performanceMonitor.notify('longTask', entry.duration);
                        }
                    });
                });
                
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (error) {
                console.warn('Long task monitoring not supported:', error);
            }
        }
        
        // Monitor for layout thrashing
        let layoutCount = 0;
        let lastLayoutTime = 0;
        
        const originalGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = function(element, pseudoElement) {
            const now = performance.now();
            if (now - lastLayoutTime < 16) { // Multiple layouts in one frame
                layoutCount++;
                if (layoutCount > 5) {
                    console.warn('Potential layout thrashing detected');
                    window.performanceMonitor.notify('layoutThrashing', layoutCount);
                }
            } else {
                layoutCount = 1;
            }
            lastLayoutTime = now;
            return originalGetComputedStyle.call(this, element, pseudoElement);
        };
    }
    
    /**
     * Get current performance metrics
     * @returns {Object} Current performance metrics
     */
    getMetrics() {
        return {
            fps: this.fps,
            memory: window.PerformanceUtils?.getMemoryUsage(),
            domNodes: window.PerformanceUtils?.countDOMNodes() || 0,
            timestamp: performance.now()
        };
    }
    
    /**
     * Cleanup performance tracking
     */
    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

/**
 * Performance Budget Manager
 * Helps maintain performance budgets
 */
class PerformanceBudget {
    constructor() {
        this.budgets = {
            fps: { min: 30, target: 60 },
            memory: { max: 50 }, // MB
            domNodes: { max: 2000 },
            loadTime: { max: 3000 }, // ms
            interactionDelay: { max: 100 } // ms
        };
        
        this.violations = [];
    }
    
    /**
     * Check if performance is within budget
     * @param {Object} metrics - Current performance metrics
     * @returns {Object} Budget check results
     */
    checkBudget(metrics) {
        const results = {
            fps: metrics.fps >= this.budgets.fps.min,
            memory: !metrics.memory || metrics.memory.used <= this.budgets.memory.max,
            domNodes: metrics.domNodes <= this.budgets.domNodes.max,
            overall: true
        };
        
        results.overall = Object.values(results).every(result => result);
        
        return results;
    }
    
    /**
     * Record performance violation
     * @param {string} metric - The metric that violated the budget
     * @param {number} value - The actual value
     * @param {number} limit - The budget limit
     */
    recordViolation(metric, value, limit) {
        this.violations.push({
            metric,
            value,
            limit,
            timestamp: performance.now()
        });
        
        console.warn(`Performance budget violated: ${metric} = ${value} (limit: ${limit})`);
    }
    
    /**
     * Get violation summary
     * @returns {Object} Violation summary
     */
    getViolationSummary() {
        const summary = {};
        
        this.violations.forEach(violation => {
            if (!summary[violation.metric]) {
                summary[violation.metric] = 0;
            }
            summary[violation.metric]++;
        });
        
        return summary;
    }
}

/**
 * Performance Reporter
 * Generates performance reports
 */
class PerformanceReporter {
    constructor() {
        this.reports = [];
    }
    
    /**
     * Generate performance report
     * @param {Object} metrics - Performance metrics
     * @param {Object} budget - Budget check results
     * @returns {Object} Performance report
     */
    generateReport(metrics, budget) {
        const report = {
            timestamp: new Date().toISOString(),
            metrics,
            budget,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            devicePixelRatio: window.devicePixelRatio || 1
        };
        
        this.reports.push(report);
        return report;
    }
    
    /**
     * Export performance data
     * @returns {string} JSON string of performance data
     */
    exportData() {
        return JSON.stringify({
            reports: this.reports,
            summary: this.generateSummary()
        }, null, 2);
    }
    
    /**
     * Generate summary of performance data
     * @returns {Object} Performance summary
     */
    generateSummary() {
        if (this.reports.length === 0) {
            return {};
        }
        
        const fpsValues = this.reports.map(r => r.metrics.fps).filter(fps => fps > 0);
        const memoryValues = this.reports
            .map(r => r.metrics.memory?.used)
            .filter(memory => memory !== undefined);
        const domNodeValues = this.reports.map(r => r.metrics.domNodes);
        
        return {
            totalReports: this.reports.length,
            averageFPS: fpsValues.length > 0 ? 
                Math.round(fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length) : 0,
            averageMemory: memoryValues.length > 0 ? 
                Math.round(memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length * 100) / 100 : 0,
            averageDOMNodes: domNodeValues.length > 0 ? 
                Math.round(domNodeValues.reduce((a, b) => a + b, 0) / domNodeValues.length) : 0,
            budgetViolations: this.reports.filter(r => !r.budget.overall).length
        };
    }
}

// Initialize performance tracking when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.performanceTracker = new PerformanceTracker();
    window.performanceBudget = new PerformanceBudget();
    window.performanceReporter = new PerformanceReporter();
    
    // Generate periodic reports
    setInterval(() => {
        const metrics = window.performanceTracker.getMetrics();
        const budget = window.performanceBudget.checkBudget(metrics);
        window.performanceReporter.generateReport(metrics, budget);
    }, 10000); // Every 10 seconds
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.performanceTracker) {
        window.performanceTracker.cleanup();
    }
}); 