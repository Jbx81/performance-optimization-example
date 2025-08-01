/**
 * Event Handling Optimization Module
 * Demonstrates debouncing, throttling, and efficient event management
 */

class EventOptimizer {
    constructor() {
        this.searchInput = $('#debounced-search');
        this.searchResults = $('#search-results');
        this.scrollContainer = $('#scroll-container');
        this.scrollIndicator = $('#scroll-indicator');
        
        this.searchData = this.generateSearchData();
        this.init();
    }
    
    /**
     * Initialize event optimizations
     */
    init() {
        this.setupDebouncedSearch();
        this.setupThrottledScroll();
        this.setupOptimizedEventListeners();
    }
    
    /**
     * Setup debounced search functionality
     */
    setupDebouncedSearch() {
        if (!this.searchInput) return;
        
        // Create debounced search function
        const debouncedSearch = PerformanceUtils.debounce((query) => {
            this.performSearch(query);
        }, 300); // 300ms delay
        
        // Add event listener with passive option for better performance
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length === 0) {
                this.clearSearchResults();
                return;
            }
            
            // Show loading state
            this.showSearchLoading();
            
            // Trigger debounced search
            debouncedSearch(query);
        }, { passive: true });
        
        // Add focus event for better UX
        this.searchInput.addEventListener('focus', () => {
            this.searchInput.style.borderColor = '#667eea';
        }, { passive: true });
        
        this.searchInput.addEventListener('blur', () => {
            this.searchInput.style.borderColor = '#e9ecef';
        }, { passive: true });
    }
    
    /**
     * Perform search with optimized filtering
     * @param {string} query - Search query
     */
    performSearch(query) {
        if (!this.searchResults) return;
        
        // Use performance measurement
        PerformanceUtils.measurePerformance('Search Operation', () => {
            const results = this.searchData.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 10); // Limit results for performance
            
            this.displaySearchResults(results, query);
        });
    }
    
    /**
     * Display search results efficiently
     * @param {Array} results - Search results
     * @param {string} query - Original query
     */
    displaySearchResults(results, query) {
        if (!this.searchResults) return;
        
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        if (results.length === 0) {
            const noResults = PerformanceUtils.createElement('div', {
                className: 'search-result-item',
                textContent: `No results found for "${query}"`
            });
            fragment.appendChild(noResults);
        } else {
            results.forEach(result => {
                const resultItem = PerformanceUtils.createElement('div', {
                    className: 'search-result-item'
                });
                
                const title = PerformanceUtils.createElement('h4', {
                    textContent: result.name
                });
                
                const description = PerformanceUtils.createElement('p', {
                    textContent: result.description
                });
                
                resultItem.appendChild(title);
                resultItem.appendChild(description);
                fragment.appendChild(resultItem);
            });
        }
        
        // Batch DOM update
        PerformanceUtils.batchDOMUpdates(() => {
            this.searchResults.innerHTML = '';
            this.searchResults.appendChild(fragment);
        });
    }
    
    /**
     * Show search loading state
     */
    showSearchLoading() {
        if (!this.searchResults) return;
        
        this.searchResults.innerHTML = '<div class="search-loading">Searching...</div>';
    }
    
    /**
     * Clear search results
     */
    clearSearchResults() {
        if (!this.searchResults) return;
        
        this.searchResults.innerHTML = '<div class="search-placeholder">Type to search...</div>';
    }
    
    /**
     * Setup throttled scroll handling
     */
    setupThrottledScroll() {
        if (!this.scrollContainer || !this.scrollIndicator) return;
        
        // Create throttled scroll handler
        const throttledScroll = PerformanceUtils.throttle((e) => {
            this.updateScrollIndicator(e.target.scrollTop);
        }, 16); // ~60fps throttling
        
        // Add scroll event listener with passive option
        this.scrollContainer.addEventListener('scroll', throttledScroll, { passive: true });
        
        // Initialize scroll indicator
        this.updateScrollIndicator(0);
    }
    
    /**
     * Update scroll indicator efficiently
     * @param {number} scrollTop - Current scroll position
     */
    updateScrollIndicator(scrollTop) {
        if (!this.scrollIndicator) return;
        
        // Use requestAnimationFrame for smooth updates
        PerformanceUtils.requestAnimationFramePolyfill(() => {
            this.scrollIndicator.textContent = `Scroll Position: ${Math.round(scrollTop)}px`;
            
            // Add visual feedback based on scroll position
            const maxScroll = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight;
            const scrollPercent = (scrollTop / maxScroll) * 100;
            
            // Update indicator color based on scroll position
            if (scrollPercent < 33) {
                this.scrollIndicator.style.background = '#28a745';
            } else if (scrollPercent < 66) {
                this.scrollIndicator.style.background = '#ffc107';
            } else {
                this.scrollIndicator.style.background = '#dc3545';
            }
        });
    }
    
    /**
     * Setup optimized event listeners
     */
    setupOptimizedEventListeners() {
        // Window resize with throttling
        const throttledResize = PerformanceUtils.throttle(() => {
            this.handleResize();
        }, 100);
        
        window.addEventListener('resize', throttledResize, { passive: true });
        
        // Visibility change for performance optimization
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        }, { passive: true });
        
        // Keyboard events with debouncing
        const debouncedKeyHandler = PerformanceUtils.debounce((e) => {
            this.handleKeyboardShortcuts(e);
        }, 50);
        
        document.addEventListener('keydown', debouncedKeyHandler, { passive: true });
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Update metrics display if needed
        if (window.performanceTracker) {
            const metrics = window.performanceTracker.getMetrics();
            console.log('Window resized, current metrics:', metrics);
        }
    }
    
    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause expensive operations when tab is not visible
            console.log('Page hidden, pausing expensive operations');
        } else {
            // Resume operations when tab becomes visible
            console.log('Page visible, resuming operations');
        }
    }
    
    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (this.searchInput) {
                this.searchInput.focus();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            if (this.searchInput) {
                this.searchInput.value = '';
                this.clearSearchResults();
            }
        }
    }
    
    /**
     * Generate sample search data
     * @returns {Array} Sample search data
     */
    generateSearchData() {
        return [
            { name: 'Performance Optimization', description: 'Techniques for optimizing web application performance' },
            { name: 'Debouncing', description: 'Limiting the rate at which a function can fire' },
            { name: 'Throttling', description: 'Controlling the frequency of function execution' },
            { name: 'Lazy Loading', description: 'Loading resources only when needed' },
            { name: 'Virtual Scrolling', description: 'Rendering only visible items in large lists' },
            { name: 'DOM Manipulation', description: 'Efficient ways to modify the DOM' },
            { name: 'CSS Optimization', description: 'Optimizing CSS for better performance' },
            { name: 'Memory Management', description: 'Managing memory usage in web applications' },
            { name: 'Event Handling', description: 'Efficient event listener management' },
            { name: 'Browser Rendering', description: 'Understanding the browser rendering pipeline' },
            { name: 'Request Animation Frame', description: 'Smooth animations using requestAnimationFrame' },
            { name: 'Intersection Observer', description: 'Efficiently detecting element visibility' },
            { name: 'Performance Monitoring', description: 'Real-time performance metrics tracking' },
            { name: 'Code Splitting', description: 'Dividing code into smaller chunks for better loading' },
            { name: 'Tree Shaking', description: 'Removing unused code from bundles' }
        ];
    }
}

/**
 * Event Delegation Manager
 * Efficiently handles events for dynamically created elements
 */
class EventDelegationManager {
    constructor() {
        this.delegatedEvents = new Map();
        this.init();
    }
    
    /**
     * Initialize event delegation
     */
    init() {
        // Delegate click events for dynamically created elements
        this.delegateEvent('click', '.btn', (e) => {
            this.handleButtonClick(e);
        });
        
        // Delegate hover events
        this.delegateEvent('mouseenter', '.demo-card', (e) => {
            this.handleCardHover(e, 'enter');
        });
        
        this.delegateEvent('mouseleave', '.demo-card', (e) => {
            this.handleCardHover(e, 'leave');
        });
    }
    
    /**
     * Delegate event to parent element
     * @param {string} eventType - Type of event
     * @param {string} selector - CSS selector for target elements
     * @param {Function} handler - Event handler function
     */
    delegateEvent(eventType, selector, handler) {
        const key = `${eventType}:${selector}`;
        
        if (this.delegatedEvents.has(key)) {
            return; // Already delegated
        }
        
        const delegatedHandler = (e) => {
            const target = e.target.closest(selector);
            if (target) {
                handler.call(target, e);
            }
        };
        
        // Add event listener to document
        document.addEventListener(eventType, delegatedHandler, { passive: true });
        
        // Store for cleanup
        this.delegatedEvents.set(key, {
            handler: delegatedHandler,
            eventType,
            selector
        });
    }
    
    /**
     * Handle button clicks
     * @param {Event} e - Click event
     */
    handleButtonClick(e) {
        const button = e.currentTarget;
        const buttonText = button.textContent;
        
        // Add click feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        console.log('Button clicked:', buttonText);
    }
    
    /**
     * Handle card hover effects
     * @param {Event} e - Mouse event
     * @param {string} type - Hover type (enter/leave)
     */
    handleCardHover(e, type) {
        const card = e.currentTarget;
        
        if (type === 'enter') {
            card.style.transform = 'translateY(-2px)';
        } else {
            card.style.transform = '';
        }
    }
    
    /**
     * Cleanup delegated events
     */
    cleanup() {
        this.delegatedEvents.forEach(({ handler, eventType }) => {
            document.removeEventListener(eventType, handler);
        });
        this.delegatedEvents.clear();
    }
}

// Initialize event optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.eventOptimizer = new EventOptimizer();
    window.eventDelegationManager = new EventDelegationManager();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.eventDelegationManager) {
        window.eventDelegationManager.cleanup();
    }
}); 