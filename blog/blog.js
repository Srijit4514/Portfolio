// Blog System JavaScript
// Handles loading and displaying blog posts from posts.json

class BlogSystem {
    constructor(topic = null) {
        this.topic = topic;
        this.posts = [];
        this.postsContainer = document.getElementById('blog-posts');
        this.init();
    }

    async init() {
        await this.loadPosts();
        this.renderPosts();
        this.initAOS();
    }

    async loadPosts() {
        try {
            const response = await fetch('posts.json');
            if (!response.ok) {
                throw new Error('Failed to load posts');
            }
            const allPosts = await response.json();
            
            // Filter posts by topic if specified
            if (this.topic) {
                this.posts = allPosts.filter(post => post.topic === this.topic);
            } else {
                this.posts = allPosts;
            }
            
            // Sort posts by date (newest first)
            this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showError();
        }
    }

    renderPosts() {
        if (!this.postsContainer) return;

        if (this.posts.length === 0) {
            this.postsContainer.innerHTML = `
                <div class="no-posts">
                    <i class="fas fa-inbox"></i>
                    <p>No posts available yet. Check back soon!</p>
                </div>
            `;
            return;
        }

        this.postsContainer.innerHTML = this.posts.map((post, index) => `
            <article class="blog-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="blog-card-header">
                    <div class="blog-meta">
                        <span class="blog-date">
                            <i class="far fa-calendar"></i>
                            ${this.formatDate(post.date)}
                        </span>
                        <span class="blog-read-time">
                            <i class="far fa-clock"></i>
                            ${post.readTime}
                        </span>
                    </div>
                </div>
                <div class="blog-card-content">
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-summary">${post.summary}</p>
                </div>
                <div class="blog-card-footer">
                    <a href="${post.url}" class="blog-read-more">
                        Read Article
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `).join('');
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    showError() {
        if (!this.postsContainer) return;
        
        this.postsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Unable to load blog posts. Please try again later.</p>
            </div>
        `;
    }

    initAOS() {
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get topic from data attribute if it exists
    const blogContainer = document.getElementById('blog-posts');
    if (blogContainer) {
        const topic = blogContainer.getAttribute('data-topic');
        new BlogSystem(topic);
    }
});
