/**
 * Lazy Loading Module
 * Demonstrates efficient image lazy loading with Intersection Observer
 */

class LazyLoader {
    constructor() {
        this.imageGrid = $('#image-grid');
        this.loadMoreButton = $('#load-more-images');
        this.images = [];
        this.currentIndex = 0;
        this.observers = new Set();
        
        this.init();
    }
    
    /**
     * Initialize lazy loading
     */
    init() {
        this.generateImageData();
        this.setupLoadMoreButton();
        this.loadInitialImages();
    }
    
    /**
     * Generate sample image data
     */
    generateImageData() {
        const imageUrls = [
            'https://picsum.photos/300/300?random=1',
            'https://picsum.photos/300/300?random=2',
            'https://picsum.photos/300/300?random=3',
            'https://picsum.photos/300/300?random=4',
            'https://picsum.photos/300/300?random=5',
            'https://picsum.photos/300/300?random=6',
            'https://picsum.photos/300/300?random=7',
            'https://picsum.photos/300/300?random=8',
            'https://picsum.photos/300/300?random=9',
            'https://picsum.photos/300/300?random=10',
            'https://picsum.photos/300/300?random=11',
            'https://picsum.photos/300/300?random=12',
            'https://picsum.photos/300/300?random=13',
            'https://picsum.photos/300/300?random=14',
            'https://picsum.photos/300/300?random=15',
            'https://picsum.photos/300/300?random=16',
            'https://picsum.photos/300/300?random=17',
            'https://picsum.photos/300/300?random=18',
            'https://picsum.photos/300/300?random=19',
            'https://picsum.photos/300/300?random=20'
        ];
        
        this.images = imageUrls.map((url, index) => ({
            id: index + 1,
            url,
            alt: `Sample Image ${index + 1}`,
            loaded: false
        }));
    }
    
    /**
     * Setup load more button
     */
    setupLoadMoreButton() {
        if (!this.loadMoreButton) return;
        
        this.loadMoreButton.addEventListener('click', () => {
            this.loadMoreImages();
        }, { passive: true });
    }
    
    /**
     * Load initial images
     */
    loadInitialImages() {
        this.addImagesToGrid(6); // Load first 6 images
    }
    
    /**
     * Load more images
     */
    loadMoreImages() {
        if (this.currentIndex >= this.images.length) {
            this.loadMoreButton.textContent = 'All Images Loaded';
            this.loadMoreButton.disabled = true;
            return;
        }
        
        // Show loading state
        this.loadMoreButton.textContent = 'Loading...';
        this.loadMoreButton.disabled = true;
        
        // Simulate loading delay for demo
        setTimeout(() => {
            this.addImagesToGrid(6);
            this.loadMoreButton.textContent = 'Load More Images';
            this.loadMoreButton.disabled = false;
        }, 500);
    }
    
    /**
     * Add images to grid with lazy loading
     * @param {number} count - Number of images to add
     */
    addImagesToGrid(count) {
        if (!this.imageGrid) return;
        
        const fragment = document.createDocumentFragment();
        const endIndex = Math.min(this.currentIndex + count, this.images.length);
        
        for (let i = this.currentIndex; i < endIndex; i++) {
            const imageData = this.images[i];
            const imageItem = this.createImageItem(imageData);
            fragment.appendChild(imageItem);
        }
        
        // Batch DOM update
        PerformanceUtils.batchDOMUpdates(() => {
            this.imageGrid.appendChild(fragment);
        });
        
        this.currentIndex = endIndex;
        
        // Update button state
        if (this.currentIndex >= this.images.length) {
            this.loadMoreButton.textContent = 'All Images Loaded';
            this.loadMoreButton.disabled = true;
        }
    }
    
    /**
     * Create image item with lazy loading
     * @param {Object} imageData - Image data object
     * @returns {Element} Image item element
     */
    createImageItem(imageData) {
        const imageItem = PerformanceUtils.createElement('div', {
            className: 'image-item'
        });
        
        // Create placeholder
        const placeholder = PerformanceUtils.createElement('div', {
            className: 'image-placeholder',
            textContent: 'Loading...'
        });
        
        // Create image element
        const img = PerformanceUtils.createElement('img', {
            alt: imageData.alt,
            loading: 'lazy', // Native lazy loading
            'data-src': imageData.url // Use data-src for custom lazy loading
        });
        
        imageItem.appendChild(placeholder);
        imageItem.appendChild(img);
        
        // Setup intersection observer for custom lazy loading
        this.setupImageObserver(imageItem, img, placeholder);
        
        return imageItem;
    }
    
    /**
     * Setup intersection observer for image lazy loading
     * @param {Element} imageItem - Image container element
     * @param {Element} img - Image element
     * @param {Element} placeholder - Placeholder element
     */
    setupImageObserver(imageItem, img, placeholder) {
        const observer = PerformanceUtils.createIntersectionObserver(imageItem, (target) => {
            this.loadImage(img, placeholder);
        }, {
            rootMargin: '50px', // Start loading 50px before image is visible
            threshold: 0.1
        });
        
        this.observers.add(observer);
    }
    
    /**
     * Load image with error handling
     * @param {Element} img - Image element
     * @param {Element} placeholder - Placeholder element
     */
    loadImage(img, placeholder) {
        const imageUrl = img.getAttribute('data-src');
        
        if (!imageUrl) return;
        
        // Create new image for preloading
        const tempImg = new Image();
        
        tempImg.onload = () => {
            // Use requestAnimationFrame for smooth transition
            PerformanceUtils.requestAnimationFramePolyfill(() => {
                img.src = imageUrl;
                img.classList.add('loaded');
                
                // Remove placeholder with fade out
                if (placeholder) {
                    placeholder.style.opacity = '0';
                    setTimeout(() => {
                        if (placeholder.parentNode) {
                            placeholder.parentNode.removeChild(placeholder);
                        }
                    }, 300);
                }
            });
        };
        
        tempImg.onerror = () => {
            // Handle loading error
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
            img.classList.add('loaded');
            
            if (placeholder) {
                placeholder.textContent = 'Error loading image';
                placeholder.style.color = '#dc3545';
            }
        };
        
        // Start loading
        tempImg.src = imageUrl;
    }
    
    /**
     * Preload critical images
     * @param {Array} urls - Array of image URLs to preload
     */
    preloadImages(urls) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
        });
    }
    
    /**
     * Cleanup observers
     */
    cleanup() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
    }
}

/**
 * Progressive Image Loading
 * Loads low-quality placeholder first, then high-quality image
 */
class ProgressiveImageLoader {
    constructor() {
        this.placeholderQuality = 10; // Low quality for placeholder
        this.finalQuality = 90; // High quality for final image
    }
    
    /**
     * Load image progressively
     * @param {Element} img - Image element
     * @param {string} url - Image URL
     */
    loadProgressiveImage(img, url) {
        // First load low-quality placeholder
        const placeholderUrl = `${url}&quality=${this.placeholderQuality}`;
        const finalUrl = `${url}&quality=${this.finalQuality}`;
        
        const tempImg = new Image();
        
        tempImg.onload = () => {
            // Show placeholder immediately
            img.src = placeholderUrl;
            img.style.filter = 'blur(5px)';
            
            // Load high-quality image
            const finalImg = new Image();
            finalImg.onload = () => {
                img.src = finalUrl;
                img.style.filter = 'none';
                img.style.transition = 'filter 0.3s ease';
            };
            finalImg.src = finalUrl;
        };
        
        tempImg.src = placeholderUrl;
    }
}

/**
 * Image Optimization Manager
 * Handles image optimization and compression
 */
class ImageOptimizationManager {
    constructor() {
        this.supportedFormats = ['webp', 'avif', 'jpeg', 'png'];
        this.init();
    }
    
    /**
     * Initialize image optimization
     */
    init() {
        this.detectSupportedFormats();
    }
    
    /**
     * Detect supported image formats
     */
    detectSupportedFormats() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Test WebP support
        canvas.width = 1;
        canvas.height = 1;
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 1, 1);
        
        const webpDataURL = canvas.toDataURL('image/webp');
        this.webpSupported = webpDataURL.indexOf('data:image/webp') === 0;
        
        // Test AVIF support (basic check)
        this.avifSupported = 'avif' in HTMLImageElement.prototype;
        
        console.log('Supported formats:', {
            webp: this.webpSupported,
            avif: this.avifSupported,
            jpeg: true,
            png: true
        });
    }
    
    /**
     * Get optimal image format
     * @param {string} originalUrl - Original image URL
     * @returns {string} Optimized image URL
     */
    getOptimalFormat(originalUrl) {
        if (this.avifSupported) {
            return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.avif');
        } else if (this.webpSupported) {
            return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        return originalUrl;
    }
    
    /**
     * Optimize image dimensions
     * @param {string} url - Image URL
     * @param {number} width - Desired width
     * @param {number} height - Desired height
     * @returns {string} Optimized URL
     */
    optimizeDimensions(url, width, height) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('w', width);
        urlObj.searchParams.set('h', height);
        return urlObj.toString();
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyLoader();
    window.progressiveImageLoader = new ProgressiveImageLoader();
    window.imageOptimizationManager = new ImageOptimizationManager();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.lazyLoader) {
        window.lazyLoader.cleanup();
    }
}); 