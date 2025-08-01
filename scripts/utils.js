/**
 * Performance Optimization Utilities
 * Senior Frontend Developer Skills Demo
 */

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - Whether to execute on the leading edge
 * @returns {Function} The debounced function
 */
function debounce(func, wait, immediate = false) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        
        const callNow = immediate && !timeout;
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(this, args);
    };
}

/**
 * Throttle function to limit the rate at which a function can fire
 * @param {Function} func - The function to throttle
 * @param {number} limit - The number of milliseconds to throttle
 * @returns {Function} The throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Request Animation Frame wrapper for smooth animations
 * @param {Function} callback - The function to execute
 * @returns {number} The request ID
 */
function requestAnimationFramePolyfill(callback) {
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        return window.requestAnimationFrame(callback);
    }
    
    // Fallback for older browsers
    return setTimeout(callback, 1000 / 60);
}

/**
 * Cancel Animation Frame wrapper
 * @param {number} id - The request ID to cancel
 */
function cancelAnimationFramePolyfill(id) {
    if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(id);
    } else {
        clearTimeout(id);
    }
}

/**
 * Performance measurement utility
 * @param {string} name - The name of the measurement
 * @param {Function} fn - The function to measure
 * @returns {any} The result of the function
 */
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
}

/**
 * Memory usage utility (if available)
 * @returns {Object|null} Memory usage information
 */
function getMemoryUsage() {
    if (performance.memory) {
        return {
            used: Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100,
            total: Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100,
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576 * 100) / 100
        };
    }
    return null;
}

/**
 * DOM node counter utility
 * @returns {number} The number of DOM nodes
 */
function countDOMNodes() {
    return document.querySelectorAll('*').length;
}

/**
 * Efficient DOM query selector with caching
 * @param {string} selector - The CSS selector
 * @returns {Element|null} The element or null
 */
function $(selector) {
    // Simple caching mechanism
    if (!this._cache) {
        this._cache = new Map();
    }
    
    if (this._cache.has(selector)) {
        const cached = this._cache.get(selector);
        if (document.contains(cached)) {
            return cached;
        } else {
            this._cache.delete(selector);
        }
    }
    
    const element = document.querySelector(selector);
    if (element) {
        this._cache.set(selector, element);
    }
    return element;
}

/**
 * Efficient DOM query selector all with caching
 * @param {string} selector - The CSS selector
 * @returns {NodeList} The elements
 */
function $$(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Create element with optimized attributes
 * @param {string} tag - The HTML tag name
 * @param {Object} attributes - The attributes to set
 * @param {string} textContent - The text content
 * @returns {Element} The created element
 */
function createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    
    // Set attributes efficiently
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'textContent') {
            element.textContent = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    if (textContent) {
        element.textContent = textContent;
    }
    
    return element;
}

/**
 * Batch DOM updates to minimize reflows
 * @param {Function} updateFunction - The function containing DOM updates
 */
function batchDOMUpdates(updateFunction) {
    // Use requestAnimationFrame to batch updates
    requestAnimationFramePolyfill(() => {
        // Temporarily disable layout thrashing
        const style = document.body.style;
        const originalDisplay = style.display;
        style.display = 'none';
        
        updateFunction();
        
        // Re-enable layout
        requestAnimationFramePolyfill(() => {
            style.display = originalDisplay;
        });
    });
}

/**
 * Efficient event listener with automatic cleanup
 * @param {Element} element - The element to attach the listener to
 * @param {string} event - The event type
 * @param {Function} handler - The event handler
 * @param {Object} options - Event listener options
 * @returns {Function} Cleanup function
 */
function addEventListenerWithCleanup(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    
    // Return cleanup function
    return () => {
        element.removeEventListener(event, handler, options);
    };
}

/**
 * Intersection Observer utility for lazy loading
 * @param {Element} element - The element to observe
 * @param {Function} callback - The callback when element is visible
 * @param {Object} options - Observer options
 * @returns {IntersectionObserver} The observer instance
 */
function createIntersectionObserver(element, callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
        ...options
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, defaultOptions);
    
    observer.observe(element);
    return observer;
}

/**
 * Efficient array chunking for large datasets
 * @param {Array} array - The array to chunk
 * @param {number} size - The chunk size
 * @returns {Array} Array of chunks
 */
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

/**
 * Deep clone utility with performance optimization
 * @param {any} obj - The object to clone
 * @returns {any} The cloned object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    
    return obj;
}

/**
 * Efficient string template utility
 * @param {string} template - The template string
 * @param {Object} data - The data to interpolate
 * @returns {string} The interpolated string
 */
function interpolate(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}

/**
 * Performance monitoring utility
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = [];
    }
    
    /**
     * Start measuring performance
     * @param {string} name - The metric name
     */
    start(name) {
        this.metrics.set(name, performance.now());
    }
    
    /**
     * End measuring performance
     * @param {string} name - The metric name
     * @returns {number} The duration in milliseconds
     */
    end(name) {
        const startTime = this.metrics.get(name);
        if (startTime) {
            const duration = performance.now() - startTime;
            this.metrics.delete(name);
            return duration;
        }
        return 0;
    }
    
    /**
     * Add performance observer
     * @param {Function} callback - The callback function
     */
    addObserver(callback) {
        this.observers.push(callback);
    }
    
    /**
     * Notify observers
     * @param {string} metric - The metric name
     * @param {number} value - The metric value
     */
    notify(metric, value) {
        this.observers.forEach(observer => observer(metric, value));
    }
}

// Create global performance monitor instance
window.performanceMonitor = new PerformanceMonitor();

// Export utilities for use in other modules
window.PerformanceUtils = {
    debounce,
    throttle,
    requestAnimationFramePolyfill,
    cancelAnimationFramePolyfill,
    measurePerformance,
    getMemoryUsage,
    countDOMNodes,
    $,
    $$,
    createElement,
    batchDOMUpdates,
    addEventListenerWithCleanup,
    createIntersectionObserver,
    chunkArray,
    deepClone,
    interpolate
}; 