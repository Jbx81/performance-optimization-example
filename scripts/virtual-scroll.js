/**
 * Virtual Scrolling Module
 * Efficiently renders large datasets by only rendering visible items
 */

class VirtualScroller {
    constructor() {
        this.container = document.getElementById('virtual-container');
        this.data = [];
        this.itemHeight = 60;
        this.visibleItems = 10;
        this.scrollTop = 0;
        this.startIndex = 0;
        this.endIndex = 0;
        
        this.init();
    }
    
    /**
     * Initialize virtual scroller
     */
    init() {
        try {
            this.generateData();
            this.setupContainer();
            this.render();
            this.setupEventListeners();
        } catch (error) {
            console.error('❌ Error initializing virtual scroller:', error);
        }
    }
    
    /**
     * Generate sample data
     */
    generateData() {
        this.data = Array.from({ length: 10000 }, (_, index) => ({
            id: index + 1,
            title: `Item ${index + 1}`,
            description: `This is item number ${index + 1} in the virtual list`,
            timestamp: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
            status: index % 3 === 0 ? 'active' : index % 3 === 1 ? 'pending' : 'completed'
        }));
    }
    
    /**
     * Setup container for virtual scrolling
     */
    setupContainer() {
        try {
            if (!this.container) {
                console.warn('⚠️ Virtual container not found');
                return;
            }
            
            // Set container height
            this.container.style.height = `${this.visibleItems * this.itemHeight}px`;
            this.container.style.overflow = 'auto';
            this.container.style.position = 'relative';
            
            // Create content wrapper
            this.contentWrapper = document.createElement('div');
            this.contentWrapper.style.height = `${this.data.length * this.itemHeight}px`;
            this.contentWrapper.style.position = 'relative';
            
            this.container.appendChild(this.contentWrapper);
        } catch (error) {
            console.error('❌ Error setting up virtual scroll container:', error);
        }
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (!this.container) return;
        
        // Throttled scroll handler
        const throttledScroll = window.PerformanceUtils?.throttle((e) => {
            this.handleScroll(e.target.scrollTop);
        }, 16) || ((e) => { this.handleScroll(e.target.scrollTop); }); // ~60fps
        
        this.container.addEventListener('scroll', throttledScroll, { passive: true });
        
        // Resize handler
        const throttledResize = window.PerformanceUtils?.throttle(() => {
            this.handleResize();
        }, 100) || (() => { this.handleResize(); });
        
        window.addEventListener('resize', throttledResize, { passive: true });
    }
    
    /**
     * Handle scroll events
     * @param {number} scrollTop - Current scroll position
     */
    handleScroll(scrollTop) {
        this.scrollTop = scrollTop;
        
        // Calculate visible range
        const newStartIndex = Math.floor(scrollTop / this.itemHeight);
        const newEndIndex = Math.min(
            newStartIndex + this.visibleItems + 2, // Add buffer
            this.data.length
        );
        
        // Only re-render if visible range changed
        if (newStartIndex !== this.startIndex || newEndIndex !== this.endIndex) {
            this.startIndex = newStartIndex;
            this.endIndex = newEndIndex;
            this.render();
        }
    }
    
    /**
     * Handle container resize
     */
    handleResize() {
        if (!this.container) return;
        
        // Recalculate visible items based on container height
        const containerHeight = this.container.clientHeight;
        this.visibleItems = Math.ceil(containerHeight / this.itemHeight);
        
        // Re-render with new visible count
        this.render();
    }
    
    /**
     * Render visible items
     */
    render() {
        if (!this.contentWrapper) return;
        
        const measurePerformance = window.PerformanceUtils?.measurePerformance || ((name, fn) => fn());
        const batchDOMUpdates = window.PerformanceUtils?.batchDOMUpdates || ((fn) => fn());
        
        measurePerformance('Virtual Scroll Render', () => {
            // Clear existing items
            this.contentWrapper.innerHTML = '';
            
            // Create fragment for batch update
            const fragment = document.createDocumentFragment();
            
            // Render only visible items
            for (let i = this.startIndex; i < this.endIndex; i++) {
                const item = this.createItem(this.data[i], i);
                fragment.appendChild(item);
            }
            
            // Batch DOM update
            batchDOMUpdates(() => {
                this.contentWrapper.appendChild(fragment);
            });
        });
    }
    
    /**
     * Create individual item
     * @param {Object} itemData - Item data
     * @param {number} index - Item index
     * @returns {Element} Item element
     */
    createItem(itemData, index) {
        const item = document.createElement('div');
        item.className = `virtual-item virtual-item-${itemData.status}`;
        item.style.position = 'absolute';
        item.style.top = `${index * this.itemHeight}px`;
        item.style.left = '0';
        item.style.right = '0';
        item.style.height = `${this.itemHeight}px`;
        item.style.padding = '1rem';
        item.style.borderBottom = '1px solid #e9ecef';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        item.style.backgroundColor = 'white';
        item.style.transition = 'background-color 0.2s ease';
        
        // Add hover effect
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f8f9fa';
        }, { passive: true });
        
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'white';
        }, { passive: true });
        
        // Create item content
        const content = document.createElement('div');
        content.style.flex = '1';
        
        const title = document.createElement('div');
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '0.25rem';
        title.textContent = itemData.title;
        
        const description = document.createElement('div');
        description.style.fontSize = '0.875rem';
        description.style.color = '#6c757d';
        description.textContent = itemData.description;
        
        const meta = document.createElement('div');
        meta.style.textAlign = 'right';
        meta.style.fontSize = '0.75rem';
        meta.style.color = '#6c757d';
        
        const timestamp = document.createElement('div');
        timestamp.textContent = new Date(itemData.timestamp).toLocaleDateString();
        
        const status = document.createElement('div');
        status.textContent = itemData.status;
        status.style.textTransform = 'capitalize';
        status.style.color = this.getStatusColor(itemData.status);
        
        content.appendChild(title);
        content.appendChild(description);
        meta.appendChild(timestamp);
        meta.appendChild(status);
        
        item.appendChild(content);
        item.appendChild(meta);
        
        return item;
    }
    
    /**
     * Get status color
     * @param {string} status - Item status
     * @returns {string} Color value
     */
    getStatusColor(status) {
        switch (status) {
            case 'active':
                return '#28a745';
            case 'pending':
                return '#ffc107';
            case 'completed':
                return '#6c757d';
            default:
                return '#6c757d';
        }
    }
    
    /**
     * Scroll to specific item
     * @param {number} index - Item index
     */
    scrollToItem(index) {
        if (!this.container || index < 0 || index >= this.data.length) return;
        
        const scrollTop = index * this.itemHeight;
        this.container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    }
    
    /**
     * Search and highlight items
     * @param {string} query - Search query
     */
    searchItems(query) {
        if (!query.trim()) {
            this.render();
            return;
        }
        
        const filteredData = this.data.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
        
        // Update data temporarily for search results
        const originalData = this.data;
        this.data = filteredData;
        
        // Re-render with filtered data
        this.render();
        
        // Restore original data after a delay
        setTimeout(() => {
            this.data = originalData;
        }, 5000);
    }
    
    /**
     * Get scroll statistics
     * @returns {Object} Scroll statistics
     */
    getScrollStats() {
        return {
            totalItems: this.data.length,
            visibleItems: this.endIndex - this.startIndex,
            scrollTop: this.scrollTop,
            startIndex: this.startIndex,
            endIndex: this.endIndex,
            scrollPercentage: (this.scrollTop / (this.data.length * this.itemHeight)) * 100
        };
    }
    
    /**
     * Update item data
     * @param {number} index - Item index
     * @param {Object} newData - New item data
     */
    updateItem(index, newData) {
        if (index >= 0 && index < this.data.length) {
            this.data[index] = { ...this.data[index], ...newData };
            
            // Re-render if item is currently visible
            if (index >= this.startIndex && index < this.endIndex) {
                this.render();
            }
        }
    }
    
    /**
     * Add new item
     * @param {Object} itemData - New item data
     */
    addItem(itemData) {
        const newItem = {
            id: this.data.length + 1,
            ...itemData
        };
        
        this.data.push(newItem);
        
        // Update content wrapper height
        if (this.contentWrapper) {
            this.contentWrapper.style.height = `${this.data.length * this.itemHeight}px`;
        }
        
        // Re-render if new item would be visible
        if (this.data.length - 1 >= this.startIndex && this.data.length - 1 < this.endIndex) {
            this.render();
        }
    }
    
    /**
     * Remove item
     * @param {number} index - Item index to remove
     */
    removeItem(index) {
        if (index >= 0 && index < this.data.length) {
            this.data.splice(index, 1);
            
            // Update content wrapper height
            if (this.contentWrapper) {
                this.contentWrapper.style.height = `${this.data.length * this.itemHeight}px`;
            }
            
            // Re-render
            this.render();
        }
    }
    
    /**
     * Cleanup virtual scroller
     */
    cleanup() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

/**
 * Virtual Scrolling Performance Monitor
 * Monitors virtual scrolling performance
 */
class VirtualScrollPerformanceMonitor {
    constructor(virtualScroller) {
        this.virtualScroller = virtualScroller;
        this.metrics = {
            renderCount: 0,
            averageRenderTime: 0,
            totalRenderTime: 0,
            scrollEvents: 0,
            lastScrollTime: 0
        };
        this.init();
    }
    
    /**
     * Initialize performance monitoring
     */
    init() {
        // Monitor render performance
        const originalRender = this.virtualScroller.render.bind(this.virtualScroller);
        this.virtualScroller.render = () => {
            const startTime = performance.now();
            originalRender();
            const endTime = performance.now();
            
            this.recordRender(endTime - startTime);
        };
        
        // Monitor scroll performance
        const originalHandleScroll = this.virtualScroller.handleScroll.bind(this.virtualScroller);
        this.virtualScroller.handleScroll = (scrollTop) => {
            this.metrics.scrollEvents++;
            this.metrics.lastScrollTime = performance.now();
            originalHandleScroll(scrollTop);
        };
    }
    
    /**
     * Record render performance
     * @param {number} renderTime - Render time in milliseconds
     */
    recordRender(renderTime) {
        this.metrics.renderCount++;
        this.metrics.totalRenderTime += renderTime;
        this.metrics.averageRenderTime = this.metrics.totalRenderTime / this.metrics.renderCount;
        
        if (renderTime > 16) { // Longer than one frame
            console.warn('Slow virtual scroll render:', renderTime.toFixed(2) + 'ms');
        }
    }
    
    /**
     * Get performance metrics
     * @returns {Object} Performance metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            scrollStats: this.virtualScroller.getScrollStats()
        };
    }
    
    /**
     * Get performance recommendations
     * @returns {Array} Performance recommendations
     */
    getRecommendations() {
        const recommendations = [];
        
        if (this.metrics.averageRenderTime > 16) {
            recommendations.push('Consider reducing item complexity or increasing buffer size');
        }
        
        if (this.metrics.scrollEvents > 100) {
            recommendations.push('Consider increasing scroll throttling');
        }
        
        return recommendations;
    }
}

// Initialize virtual scrolling when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if the container exists before initializing
        const container = document.getElementById('virtual-container');
        if (container) {
            window.virtualScroller = new VirtualScroller();
            window.virtualScrollPerformanceMonitor = new VirtualScrollPerformanceMonitor(window.virtualScroller);
            console.log('✅ Virtual scrolling initialized successfully');
        } else {
            console.warn('⚠️ Virtual container not found, skipping virtual scroll initialization');
        }
    } catch (error) {
        console.error('❌ Error initializing virtual scrolling:', error);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    try {
        if (window.virtualScroller) {
            window.virtualScroller.cleanup();
        }
    } catch (error) {
        console.error('❌ Error cleaning up virtual scrolling:', error);
    }
}); 