document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // Admin Authentication System
    // ======================
    const AdminAuth = {
        // Configuration - CHANGE THIS TO YOUR SECURE PASSWORD
        config: {
            adminPassword: "YourSecurePassword123!", // Change this to your own strong password
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            sessionKey: 'portfolioAdminSession'
        },

        // State
        state: {
            isAuthenticated: false,
            sessionTimer: null
        },

        // DOM Elements
        elements: {
            loginModal: document.getElementById('admin-login-modal'),
            loginForm: document.getElementById('admin-login-form'),
            passwordInput: document.getElementById('admin-password'),
            loginBtn: document.getElementById('login-btn'),
            logoutBtn: document.getElementById('logout-btn'),
            closeModal: document.querySelector('.close-modal'),
            adminControls: document.querySelectorAll('.admin-control'),
            adminAccessBtn: document.getElementById('admin-access-btn')
        },

        // Initialize
        init() {
            this.checkSession();
            this.setupEventListeners();
            this.toggleAdminControls();
        },

        // Check for existing session
        checkSession() {
            const session = localStorage.getItem(this.config.sessionKey);
            if (session && session === this.config.adminPassword) {
                this.authenticate();
                this.startSessionTimer();
            }
        },

        // Setup event listeners
        setupEventListeners() {
            // Login form submission
            if (this.elements.loginForm) {
                this.elements.loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleLogin();
                });
            }

            // Logout button
            if (this.elements.logoutBtn) {
                this.elements.logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
            }

            // Close modal button
            if (this.elements.closeModal) {
                this.elements.closeModal.addEventListener('click', () => {
                    this.closeModal();
                });
            }

            // Admin access button
            if (this.elements.adminAccessBtn) {
                this.elements.adminAccessBtn.addEventListener('click', () => {
                    this.showModal();
                });
            }

            // Close modal when clicking outside
            document.addEventListener('click', (e) => {
                if (e.target === this.elements.loginModal) {
                    this.closeModal();
                }
            });

            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.elements.loginModal.style.display === 'block') {
                    this.closeModal();
                }
            });
        },

        // Handle login
        handleLogin() {
            const enteredPassword = this.elements.passwordInput.value.trim();
            
            if (enteredPassword === this.config.adminPassword) {
                this.authenticate();
                localStorage.setItem(this.config.sessionKey, this.config.adminPassword);
                this.startSessionTimer();
                this.closeModal();
                this.showToast('Admin access granted!', 'success');
            } else {
                this.showToast('Incorrect password!', 'error');
                this.elements.passwordInput.value = '';
                this.elements.passwordInput.focus();
            }
        },

        // Handle logout
        handleLogout() {
            this.state.isAuthenticated = false;
            localStorage.removeItem(this.config.sessionKey);
            clearTimeout(this.state.sessionTimer);
            this.toggleAdminControls();
            this.showToast('Logged out successfully', 'success');
        },

        // Authenticate user
        authenticate() {
            this.state.isAuthenticated = true;
            this.toggleAdminControls();
        },

        // Start session timer
        startSessionTimer() {
            clearTimeout(this.state.sessionTimer);
            this.state.sessionTimer = setTimeout(() => {
                this.handleLogout();
                this.showToast('Session expired. Please login again.', 'info');
            }, this.config.sessionTimeout);
        },

        // Toggle admin controls visibility
        toggleAdminControls() {
            this.elements.adminControls.forEach(control => {
                control.style.display = this.state.isAuthenticated ? 'block' : 'none';
            });

            if (this.elements.adminAccessBtn) {
                this.elements.adminAccessBtn.style.display = this.state.isAuthenticated ? 'none' : 'block';
            }
        },

        // Show modal
        showModal() {
            if (this.elements.loginModal) {
                this.elements.loginModal.style.display = 'block';
                this.elements.passwordInput.focus();
                document.body.style.overflow = 'hidden';
            }
        },

        // Close modal
        closeModal() {
            if (this.elements.loginModal) {
                this.elements.loginModal.style.display = 'none';
                this.elements.passwordInput.value = '';
                document.body.style.overflow = '';
            }
        },

        // Show toast notification
        showToast(message, type = 'success') {
            // Remove existing toasts
            const existingToasts = document.querySelectorAll('.toast');
            existingToasts.forEach(toast => toast.remove());

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            // Add show class after a small delay
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }
    };

    // Initialize Admin Authentication
    AdminAuth.init();

    // ======================
    // General Site Functions
    // ======================

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 100);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip for admin access and logout buttons
            if (this.id === 'admin-access-btn' || this.parentElement.id === 'logout-btn') {
                return;
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (hamburger && navLinks) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
      // ======================
    // Posts Management System
    // ======================
    const PostsManager = {
        // DOM Elements
        elements: {
            postsContainer: document.getElementById('posts-container'),
            addPostForm: document.getElementById('add-post-form'),
            toggleFormBtn: document.getElementById('toggle-form-btn'),
            saveDraftBtn: document.getElementById('save-draft-btn'),
            publishPostBtn: document.getElementById('publish-post-btn'),
            cancelPostBtn: document.getElementById('cancel-post-btn'),
            filterPosts: document.getElementById('filter-posts'),
            loadMoreBtn: document.getElementById('load-more-btn'),
            postTitle: document.getElementById('post-title'),
            postContent: document.getElementById('post-content'),
            postImage: document.getElementById('post-image'),
            postTags: document.getElementById('post-tags'),
            postPublished: document.getElementById('post-published'),
            contentPreview: document.getElementById('content-preview')
        },

        // State
        state: {
            posts: [],
            currentPage: 1,
            postsPerPage: 6,
            filter: 'all',
            editingPostId: null,
            isLoading: false
        },

        // Initialize
        init() {
            this.loadPosts();
            this.setupEventListeners();
            this.renderPosts();
        },

        // Load posts from localStorage
        loadPosts() {
            const savedPosts = localStorage.getItem('portfolioPosts');
            this.state.posts = savedPosts ? JSON.parse(savedPosts) : this.getDefaultPosts();
        },

        // Default sample posts
        getDefaultPosts() {
            return [
                {
                    id: '1',
                    title: "The Intersection of Chemistry and Cloud Computing",
                    date: new Date().toISOString(),
                    content: "Exploring how cloud technologies are revolutionizing chemical research and data analysis in modern laboratories.\n\n## Key Benefits\n- **Scalability** for large datasets\n- *Collaboration* across research teams\n- Cost-effective solutions",
                    excerpt: "Exploring how cloud technologies are revolutionizing chemical research and data analysis.",
                    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    tags: ["chemistry", "cloud computing"],
                    published: true
                },
                {
                    id: '2',
                    title: "My Journey from Chemistry to Tech",
                    date: new Date().toISOString(),
                    content: "Sharing my personal experience transitioning from a chemistry background to the world of cloud computing.\n\n## Challenges Faced\n1. Learning new technical skills\n2. Adapting to different workflows\n3. Building a professional network",
                    excerpt: "Sharing my personal experience transitioning from chemistry to cloud computing.",
                    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    tags: ["career", "transition"],
                    published: true
                }
            ];
        },

        // Set up event listeners
        setupEventListeners() {
            // Form toggling
            if (this.elements.toggleFormBtn) {
                this.elements.toggleFormBtn.addEventListener('click', () => {
                    if (!AdminAuth.state.isAuthenticated) {
                        AdminAuth.showModal();
                        return;
                    }
                    this.togglePostForm();
                });
            }

            // Cancel button
            if (this.elements.cancelPostBtn) {
                this.elements.cancelPostBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.cancelEditing();
                });
            }

            // Form submission
            if (this.elements.saveDraftBtn) {
                this.elements.saveDraftBtn.addEventListener('click', (e) => this.savePost(e, false));
            }

            if (this.elements.publishPostBtn) {
                this.elements.publishPostBtn.addEventListener('click', (e) => this.savePost(e, true));
            }

            // Filtering
            if (this.elements.filterPosts) {
                this.elements.filterPosts.addEventListener('change', (e) => {
                    this.state.filter = e.target.value;
                    this.state.currentPage = 1;
                    this.renderPosts();
                });
            }

            // Load more
            if (this.elements.loadMoreBtn) {
                this.elements.loadMoreBtn.addEventListener('click', () => {
                    this.state.currentPage++;
                    this.renderPosts();
                });
            }

            // Content preview
            if (this.elements.postContent) {
                this.elements.postContent.addEventListener('input', () => this.updateContentPreview());
            }
        },

        // Toggle post form visibility
        togglePostForm() {
            if (!AdminAuth.state.isAuthenticated) {
                AdminAuth.showModal();
                return;
            }

            this.elements.addPostForm.classList.toggle('active');
            
            if (this.elements.toggleFormBtn) {
                this.elements.toggleFormBtn.innerHTML = this.elements.addPostForm.classList.contains('active') 
                    ? '<i class="fas fa-times"></i> Cancel' 
                    : '<i class="fas fa-plus"></i> Create New Post';
            }
            
            if (!this.elements.addPostForm.classList.contains('active')) {
                this.cancelEditing();
            } else {
                this.elements.postTitle.focus();
            }
        },

        // Save post (draft or published)
        async savePost(e, publish) {
            e.preventDefault();
            
            if (!AdminAuth.state.isAuthenticated) {
                AdminAuth.showModal();
                return;
            }

            const title = this.elements.postTitle.value.trim();
            const content = this.elements.postContent.value.trim();
            
            if (!title || !content) {
                AdminAuth.showToast('Title and content are required!', 'error');
                return;
            }
            
            // Create excerpt from first 150 characters
            const excerpt = content.substring(0, 150) + (content.length > 150 ? '...' : '');
            
            const newPost = {
                id: this.state.editingPostId || Date.now().toString(),
                title,
                content,
                excerpt,
                image: this.elements.postImage.value.trim() || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
                tags: this.elements.postTags.value.split(',').map(tag => tag.trim()).filter(tag => tag),
                published: publish,
                date: new Date().toISOString()
            };
            
            // Show loading state
            this.state.isLoading = true;
            if (this.elements.publishPostBtn) {
                this.elements.publishPostBtn.disabled = true;
                this.elements.publishPostBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
            }
            if (this.elements.saveDraftBtn) {
                this.elements.saveDraftBtn.disabled = true;
                this.elements.saveDraftBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            }
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (this.state.editingPostId) {
                // Update existing post
                const index = this.state.posts.findIndex(p => p.id === this.state.editingPostId);
                if (index !== -1) {
                    this.state.posts[index] = newPost;
                }
            } else {
                // Add new post at beginning
                this.state.posts.unshift(newPost);
            }
            
            this.saveToLocalStorage();
            this.renderPosts();
            this.resetForm();
            this.togglePostForm();
            
            AdminAuth.showToast(`Post ${publish ? 'published' : 'saved as draft'} successfully!`, 'success');
            
            // Reset loading state
            this.state.isLoading = false;
            if (this.elements.publishPostBtn) {
                this.elements.publishPostBtn.disabled = false;
                this.elements.publishPostBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish';
            }
            if (this.elements.saveDraftBtn) {
                this.elements.saveDraftBtn.disabled = false;
                this.elements.saveDraftBtn.innerHTML = '<i class="fas fa-save"></i> Save Draft';
            }
        },

        // Cancel editing and reset form
        cancelEditing() {
            this.resetForm();
            this.state.editingPostId = null;
            if (this.elements.addPostForm.classList.contains('active')) {
                this.togglePostForm();
            }
        },

        // Reset form fields
        resetForm() {
            if (this.elements.postTitle) this.elements.postTitle.value = '';
            if (this.elements.postContent) this.elements.postContent.value = '';
            if (this.elements.postImage) this.elements.postImage.value = '';
            if (this.elements.postTags) this.elements.postTags.value = '';
            if (this.elements.postPublished) this.elements.postPublished.checked = false;
            if (this.elements.contentPreview) this.elements.contentPreview.innerHTML = '';
        },

        // Render posts based on current filter and page
        renderPosts() {
            if (!this.elements.postsContainer) return;
            
            const filteredPosts = this.getFilteredPosts();
            const postsToShow = filteredPosts.slice(0, this.state.currentPage * this.state.postsPerPage);
            
            this.elements.postsContainer.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');
            
            // Add event listeners to action buttons
            document.querySelectorAll('.edit-post').forEach(btn => {
                btn.addEventListener('click', () => this.editPost(btn.dataset.id));
            });
            
            document.querySelectorAll('.delete-post').forEach(btn => {
                btn.addEventListener('click', () => this.deletePost(btn.dataset.id));
            });
            
            // Show/hide load more button
            if (this.elements.loadMoreBtn) {
                this.elements.loadMoreBtn.style.display = 
                    filteredPosts.length > this.state.currentPage * this.state.postsPerPage ? 'block' : 'none';
            }
        },

        // Create HTML for a post card
        createPostCard(post) {
            const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return `
                <div class="post-card">
                    <span class="post-status ${post.published ? 'published' : 'draft'}">
                        ${post.published ? 'Published' : 'Draft'}
                    </span>
                    <div class="post-image">
                        <img src="${post.image}" alt="${post.title}" loading="lazy">
                    </div>
                    <div class="post-content">
                        <h3 class="post-title">${post.title}</h3>
                        <span class="post-date">${formattedDate}</span>
                        <p class="post-excerpt">${post.excerpt}</p>
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                        </div>
                        <div class="post-actions">
                            <button class="btn btn-outline edit-post" data-id="${post.id}" title="Edit">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-outline delete-post" data-id="${post.id}" title="Delete">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },

        // Filter posts based on current filter
        getFilteredPosts() {
            switch(this.state.filter) {
                case 'published': 
                    return this.state.posts.filter(post => post.published);
                case 'drafts':
                    return this.state.posts.filter(post => !post.published);
                default:
                    return [...this.state.posts];
            }
        },

        // Edit post
        editPost(postId) {
            if (!AdminAuth.state.isAuthenticated) {
                AdminAuth.showModal();
                return;
            }

            const post = this.state.posts.find(p => p.id === postId);
            if (!post) return;
            
            this.state.editingPostId = postId;
            if (this.elements.postTitle) this.elements.postTitle.value = post.title;
            if (this.elements.postContent) this.elements.postContent.value = post.content;
            if (this.elements.postImage) this.elements.postImage.value = post.image;
            if (this.elements.postTags) this.elements.postTags.value = post.tags.join(', ');
            if (this.elements.postPublished) this.elements.postPublished.checked = post.published;
            
            this.updateContentPreview();
            
            if (!this.elements.addPostForm.classList.contains('active')) {
                this.togglePostForm();
            }
            
            // Scroll to form
            this.elements.addPostForm.scrollIntoView({ behavior: 'smooth' });
            if (this.elements.postTitle) this.elements.postTitle.focus();
        },

        // Delete post
        async deletePost(postId) {
            if (!AdminAuth.state.isAuthenticated) {
                AdminAuth.showModal();
                return;
            }

            if (!confirm('Are you sure you want to delete this post?')) {
                return;
            }

            // Show loading state
            const deleteBtn = document.querySelector(`.delete-post[data-id="${postId}
