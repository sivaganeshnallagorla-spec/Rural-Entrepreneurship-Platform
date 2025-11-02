import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const headerRef = useRef(null)
  const sectionsRef = useRef({})

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = sectionsRef.current[sectionId]
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      setMobileMenuOpen(false)
    }
  }

  // Update active navigation on scroll
  useEffect(() => {
    const updateActiveNav = () => {
      const scrollY = window.pageYOffset

      Object.keys(sectionsRef.current).forEach((sectionId) => {
        const section = sectionsRef.current[sectionId]
        if (section) {
          const sectionHeight = section.offsetHeight
          const sectionTop = section.offsetTop - 100

          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            setActiveSection(sectionId)
          }
        }
      })

      // Special case for hero section
      if (scrollY < 100) {
        setActiveSection('home')
      }
    }

    window.addEventListener('scroll', updateActiveNav)
    return () => window.removeEventListener('scroll', updateActiveNav)
  }, [])

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset
      if (headerRef.current) {
        if (currentScroll > 100) {
          headerRef.current.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)'
        } else {
          headerRef.current.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
        }
      })
    }, observerOptions)

    const animatedElements = document.querySelectorAll('.feature-card, .workflow-step, .team-member')
    animatedElements.forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      observer.observe(el)
    })

    return () => {
      animatedElements.forEach(el => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="landing-page">
      {/* Header / Navigation Bar */}
      <header className="header" id="header" ref={headerRef}>
        <nav className="navbar">
          <div className="container">
            <div className="nav-wrapper">
              <div className="logo">
                <span className="logo-icon">🌾</span>
                <span className="logo-text">Rural Entrepreneurship Platform</span>
              </div>
              <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`} id="navMenu">
                <li>
                  <a
                    href="#home"
                    className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection('home')
                    }}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection('about')
                    }}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection('features')
                    }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection('how-it-works')
                    }}
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection('contact')
                    }}
                  >
                    Contact
                  </a>
                </li>
              </ul>
              <div className="nav-buttons">
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </div>
              <button
                className="mobile-menu-toggle"
                id="mobileMenuToggle"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <span style={{
                  transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                  transition: 'transform 0.3s ease'
                }}></span>
                <span style={{
                  opacity: mobileMenuOpen ? 0 : 1,
                  transition: 'opacity 0.3s ease'
                }}></span>
                <span style={{
                  transform: mobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none',
                  transition: 'transform 0.3s ease'
                }}></span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home" ref={(el) => { if (el) sectionsRef.current.home = el }}>
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Empowering Farmers, Connecting the World</h1>
            <p className="hero-subtitle">A digital bridge helping farmers turn crops into high-value products and reach global markets.</p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn btn-primary btn-large">Join as a Farmer</Link>
              <button
                className="btn btn-secondary btn-large"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('features')
                }}
              >
                Explore Products
              </button>
            </div>
          </div>
        </div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about" ref={(el) => { if (el) sectionsRef.current.about = el }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About the Platform</h2>
            <div className="section-divider"></div>
          </div>
          <div className="about-content">
            <p className="about-description">
              Developed under project ID <strong>24SDCS01-S121-SDP-01</strong>, the Rural Entrepreneurship Platform promotes sustainable agriculture and entrepreneurship by connecting farmers and buyers worldwide.
            </p>
            <div className="team-section">
              <h3 className="team-title">Team Members</h3>
              <div className="team-grid">
                <div className="team-member">
                  <div className="team-member-icon">👨‍💼</div>
                  <h4>Nallagorla Siva Ganesh</h4>
                  <p>2400090093</p>
                </div>
                <div className="team-member">
                  <div className="team-member-icon">👨‍💼</div>
                  <h4>Kamineni Bala Koteswara Rao</h4>
                  <p>2400090121</p>
                </div>
                <div className="team-member">
                  <div className="team-member-icon">👨‍💼</div>
                  <h4>Gunja Nagendra Vara Prasad</h4>
                  <p>2400090161</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features" ref={(el) => { if (el) sectionsRef.current.features = el }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Platform Features</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Discover how our platform empowers different user roles</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍🌾</div>
              <h3 className="feature-title">Farmer</h3>
              <ul className="feature-list">
                <li>✓ List and manage products</li>
                <li>✓ Monitor sales and analytics</li>
                <li>✓ Connect with global buyers</li>
                <li>✓ Track order status</li>
                <li>✓ Manage inventory</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛍️</div>
              <h3 className="feature-title">Buyer</h3>
              <ul className="feature-list">
                <li>✓ Discover quality rural products</li>
                <li>✓ Browse by category</li>
                <li>✓ Secure payment options</li>
                <li>✓ Leave reviews and feedback</li>
                <li>✓ Track deliveries</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3 className="feature-title">Admin</h3>
              <ul className="feature-list">
                <li>✓ Manage users and permissions</li>
                <li>✓ Oversee transactions</li>
                <li>✓ Maintain system integrity</li>
                <li>✓ Monitor platform analytics</li>
                <li>✓ Moderate content</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works" ref={(el) => { if (el) sectionsRef.current['how-it-works'] = el }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <div className="section-divider"></div>
          </div>
          <div className="workflow">
            <div className="workflow-step">
              <div className="step-number">1️⃣</div>
              <div className="step-content">
                <h3>Farmer Lists Products</h3>
                <p>Farmers add their value-added products with details, images, and pricing</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">2️⃣</div>
              <div className="step-content">
                <h3>Buyer Explores & Orders</h3>
                <p>Buyers browse the marketplace and place orders for desired products</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">3️⃣</div>
              <div className="step-content">
                <h3>Admin Verifies & Processes</h3>
                <p>Administrators verify transactions and ensure platform security</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">4️⃣</div>
              <div className="step-content">
                <h3>Secure Transaction & Delivery</h3>
                <p>Safe payment processing and reliable delivery to buyers</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">5️⃣</div>
              <div className="step-content">
                <h3>Feedback & Improvement</h3>
                <p>Continuous feedback loop for platform enhancement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta" id="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Be part of the Rural Entrepreneurship Revolution!</h2>
            <p className="cta-subtitle">Join thousands of farmers and buyers creating sustainable rural economies</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-large">Register Now</Link>
              <button
                className="btn btn-secondary btn-large"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('about')
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact" ref={(el) => { if (el) sectionsRef.current.contact = el }}>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">🌾 Rural Entrepreneurship Platform</h3>
              <p>Connecting farmers with global markets for sustainable rural development.</p>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Project Information</h4>
              <p><strong>Project ID:</strong> 24SDCS01-S121-SDP-01</p>
              <p><strong>Problem Statement:</strong> FEDF-PS01</p>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Team</h4>
              <p>Nallagorla Siva Ganesh</p>
              <p>Kamineni Bala Koteswara Rao</p>
              <p>Gunja Nagendra Vara Prasad</p>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Contact</h4>
              <p>📧 <a href="mailto:2400090093@kluniversity.in">2400090093@kluniversity.in</a></p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Rural Entrepreneurship Platform. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

