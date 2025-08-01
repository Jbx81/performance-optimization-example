/**
 * DOM Optimization Module
 * Demonstrates efficient DOM manipulation techniques
 */

class DOMOptimizer {
    constructor() {
        this.addItemsButton = $('#add-items');
        this.addItemsOptimizedButton = $('#add-items-optimized');
        this.clearItemsButton = $('#clear-items');
        this.itemsContainer = $('#items-container');
        
        this.itemCount = 0;
        this.init();
    }
    
    /**
     * Initialize DOM optimization
     */
    init() {
        this.setupEventListeners();
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (this.addItemsButton) {
            this.addItemsButton.addEventListener('click', () => {
                this.addItemsSlow();
            }, { passive: true });
        }
        
        if (this.addItemsOptimizedButton) {
            this.addItemsOptimizedButton.addEventListener('click', () => {
                this.addItemsOptimized();
            }, { passive: true });
        }
        
        if (this.clearItemsButton) {
            this.clearItemsButton.addEventListener('click', () => {
                this.clearItems();
            }, { passive: true });
        }
    }
    
    /**
     * Add items using slow method (causes reflows)
     */
    addItemsSlow() {
        if (!this.itemsContainer) return;
        
        PerformanceUtils.measurePerformance('Slow DOM Manipulation', () => {
            for (let i = 0; i < 1000; i++) {
                const item = document.createElement('div');
                item.className = 'item';
                item.textContent = `Item ${this.itemCount + i + 1}`;
                
                // Each appendChild causes a reflow
                this.itemsContainer.appendChild(item);
            }
            
            this.itemCount += 1000;
            console.log('Added 1000 items (slow method)');
        });
    }
    
    /**
     * Add items using optimized method (batched updates)
     */
    addItemsOptimized() {
        if (!this.itemsContainer) return;
        
        PerformanceUtils.measurePerformance('Optimized DOM Manipulation', () => {
            // Use DocumentFragment to batch DOM updates
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < 1000; i++) {
                const item = document.createElement('div');
                item.className = 'item';
                item.textContent = `Item ${this.itemCount + i + 1}`;
                
                // Add to fragment instead of DOM
                fragment.appendChild(item);
            }
            
            // Single DOM update
            this.itemsContainer.appendChild(fragment);
            
            this.itemCount += 1000;
            console.log('Added 1000 items (optimized method)');
        });
    }
    
    /**
     * Clear all items efficiently
     */
    clearItems() {
        if (!this.itemsContainer) return;
        
        PerformanceUtils.measurePerformance('Clear Items', () => {
            // Use innerHTML for faster clearing
            this.itemsContainer.innerHTML = '';
            this.itemCount = 0;
            console.log('Cleared all items');
        });
    }
    
    /**
     * Create optimized list with virtual scrolling
     * @param {number} totalItems - Total number of items
     * @param {number} visibleItems - Number of visible items
     */
    createVirtualList(totalItems, visibleItems = 20) {
        if (!this.itemsContainer) return;
        
        this.itemsContainer.innerHTML = '';
        this.itemsContainer.style.height = `${visibleItems * 60}px`; // 60px per item
        
        // Create viewport container
        const viewport = document.createElement('div');
        viewport.style.height = `${totalItems * 60}px`;
        viewport.style.position = 'relative';
        
        // Create visible items
        this.renderVisibleItems(viewport, 0, visibleItems, totalItems);
        
        // Setup scroll listener
        this.itemsContainer.addEventListener('scroll', PerformanceUtils.throttle((e) => {
            const scrollTop = e.target.scrollTop;
            const startIndex = Math.floor(scrollTop / 60);
            const endIndex = Math.min(startIndex + visibleItems, totalItems);
            
            this.renderVisibleItems(viewport, startIndex, endIndex, totalItems);
        }, 16));
        
        this.itemsContainer.appendChild(viewport);
    }
    
    /**
     * Render visible items in virtual list
     * @param {Element} viewport - Viewport container
     * @param {number} startIndex - Start index
     * @param {number} endIndex - End index
     * @param {number} totalItems - Total number of items
     */
    renderVisibleItems(viewport, startIndex, endIndex, totalItems) {
        // Clear existing items
        viewport.innerHTML = '';
        
        // Create fragment for batch update
        const fragment = document.createDocumentFragment();
        
        for (let i = startIndex; i < endIndex; i++) {
            const item = document.createElement('div');
            item.className = 'virtual-item';
            item.style.position = 'absolute';
            item.style.top = `${i * 60}px`;
            item.style.left = '0';
            item.style.right = '0';
            item.style.height = '60px';
            item.innerHTML = `
                <span>Item ${i + 1}</span>
                <span>${i + 1} of ${totalItems}</span>
            `;
            
            fragment.appendChild(item);
        }
        
        viewport.appendChild(fragment);
    }
}

/**
 * DOM Mutation Observer
 * Monitors DOM changes for performance analysis
 */
class DOMMutationObserver {
    constructor() {
        this.observer = null;
        this.mutations = [];
        this.init();
    }
    
    /**
     * Initialize mutation observer
     */
    init() {
        if ('MutationObserver' in window) {
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    this.recordMutation(mutation);
                });
            });
            
            // Observe document body
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeOldValue: true
            });
        }
    }
    
    /**
     * Record DOM mutation
     * @param {MutationRecord} mutation - Mutation record
     */
    recordMutation(mutation) {
        this.mutations.push({
            type: mutation.type,
            target: mutation.target.nodeName,
            addedNodes: mutation.addedNodes.length,
            removedNodes: mutation.removedNodes.length,
            timestamp: performance.now()
        });
        
        // Keep only last 100 mutations
        if (this.mutations.length > 100) {
            this.mutations.shift();
        }
    }
    
    /**
     * Get mutation statistics
     * @returns {Object} Mutation statistics
     */
    getMutationStats() {
        const stats = {
            total: this.mutations.length,
            byType: {},
            byTarget: {},
            averageTime: 0
        };
        
        this.mutations.forEach(mutation => {
            // Count by type
            stats.byType[mutation.type] = (stats.byType[mutation.type] || 0) + 1;
            
            // Count by target
            stats.byTarget[mutation.target] = (stats.byTarget[mutation.target] || 0) + 1;
        });
        
        return stats;
    }
    
    /**
     * Cleanup observer
     */
    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/**
 * DOM Performance Analyzer
 * Analyzes DOM performance and provides recommendations
 */
class DOMPerformanceAnalyzer {
    constructor() {
        this.metrics = {
            nodeCount: 0,
            depth: 0,
            reflows: 0,
            repaints: 0
        };
        this.init();
    }
    
    /**
     * Initialize analyzer
     */
    init() {
        this.analyzeDOM();
        this.monitorPerformance();
    }
    
    /**
     * Analyze current DOM structure
     */
    analyzeDOM() {
        const allNodes = document.querySelectorAll('*');
        this.metrics.nodeCount = allNodes.length;
        
        // Calculate max depth
        let maxDepth = 0;
        allNodes.forEach(node => {
            let depth = 0;
            let parent = node.parentElement;
            while (parent) {
                depth++;
                parent = parent.parentElement;
            }
            maxDepth = Math.max(maxDepth, depth);
        });
        
        this.metrics.depth = maxDepth;
        
        console.log('DOM Analysis:', this.metrics);
    }
    
    /**
     * Monitor DOM performance
     */
    monitorPerformance() {
        // Monitor reflows
        let reflowCount = 0;
        const originalGetComputedStyle = window.getComputedStyle;
        
        window.getComputedStyle = function(element, pseudoElement) {
            reflowCount++;
            return originalGetComputedStyle.call(this, element, pseudoElement);
        };
        
        // Reset counter every second
        setInterval(() => {
            this.metrics.reflows = reflowCount;
            reflowCount = 0;
            
            if (this.metrics.reflows > 100) {
                console.warn('High reflow count detected:', this.metrics.reflows);
            }
        }, 1000);
    }
    
    /**
     * Get performance recommendations
     * @returns {Array} Array of recommendations
     */
    getRecommendations() {
        const recommendations = [];
        
        if (this.metrics.nodeCount > 2000) {
            recommendations.push('Consider virtual scrolling for large lists');
        }
        
        if (this.metrics.depth > 15) {
            recommendations.push('Reduce DOM nesting depth for better performance');
        }
        
        if (this.metrics.reflows > 50) {
            recommendations.push('Batch DOM updates to reduce reflows');
        }
        
        return recommendations;
    }
}

/**
 * Efficient DOM Query Cache
 * Caches DOM queries for better performance
 */
class DOMQueryCache {
    constructor() {
        this.cache = new Map();
        this.cacheSize = 100;
        this.init();
    }
    
    /**
     * Initialize cache
     */
    init() {
        // Clear cache periodically
        setInterval(() => {
            this.clearCache();
        }, 30000); // Every 30 seconds
    }
    
    /**
     * Get cached element or query DOM
     * @param {string} selector - CSS selector
     * @returns {Element|null} Cached element or null
     */
    get(selector) {
        if (this.cache.has(selector)) {
            const cached = this.cache.get(selector);
            if (document.contains(cached.element)) {
                return cached.element;
            } else {
                this.cache.delete(selector);
            }
        }
        
        const element = document.querySelector(selector);
        if (element) {
            this.set(selector, element);
        }
        
        return element;
    }
    
    /**
     * Set element in cache
     * @param {string} selector - CSS selector
     * @param {Element} element - DOM element
     */
    set(selector, element) {
        // Implement LRU cache
        if (this.cache.size >= this.cacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(selector, {
            element,
            timestamp: performance.now()
        });
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
    
    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.cacheSize,
            hitRate: this.calculateHitRate()
        };
    }
    
    /**
     * Calculate cache hit rate
     * @returns {number} Hit rate percentage
     */
    calculateHitRate() {
        // This would need to be implemented with hit/miss tracking
        return 0;
    }
}

// Initialize DOM optimization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.domOptimizer = new DOMOptimizer();
    window.domMutationObserver = new DOMMutationObserver();
    window.domPerformanceAnalyzer = new DOMPerformanceAnalyzer();
    window.domQueryCache = new DOMQueryCache();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.domMutationObserver) {
        window.domMutationObserver.cleanup();
    }
}); 