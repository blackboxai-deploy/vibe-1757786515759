'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function HomePage() {
  useEffect(() => {
    // Initialize JavaScript functionality
    const initializeApp = () => {
      // Elements
      const navbar = document.getElementById('navbar')
      const mobileMenuButton = document.querySelector('.mobile-menu-button')
      const mobileMenu = document.querySelector('.mobile-menu')
      const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link')
      const contactForm = document.getElementById('contact-form')
      const animateElements = document.querySelectorAll('.animate-on-scroll')

      // Mobile Menu Toggle
      if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
          mobileMenu.classList.toggle('hidden')
          mobileMenu.classList.toggle('open')
          
          // Change hamburger icon
          const icon = mobileMenuButton.querySelector('svg')
          if (mobileMenu.classList.contains('open')) {
            icon!.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />'
          } else {
            icon!.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />'
          }
        })
      }

      // Smooth Navigation & Active State
      navLinks.forEach(link => {
        link.addEventListener('click', function(this: HTMLAnchorElement, e) {
          e.preventDefault()
          const href = this.getAttribute('href')
          const targetId = href?.substring(1)
          const targetElement = targetId ? document.getElementById(targetId) : null
          
          if (targetElement) {
            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
              mobileMenu.classList.add('hidden')
              mobileMenu.classList.remove('open')
              const icon = mobileMenuButton?.querySelector('svg')
              if (icon) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />'
              }
            }
            
            // Smooth scroll
            const offsetTop = targetElement.offsetTop - 70 // Account for fixed navbar
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            })
            
            // Update active state
            if (targetId) {
              updateActiveNavLink(targetId)
            }
          }
        })
      })

      // Update active navigation link
      function updateActiveNavLink(activeId: string) {
        navLinks.forEach(link => {
          link.classList.remove('active')
          if ((link as HTMLAnchorElement).getAttribute('href') === `#${activeId}`) {
            link.classList.add('active')
          }
        })
      }

      // Scroll Effects
      window.addEventListener('scroll', function() {
        const scrollY = window.scrollY
        
        // Navbar scroll effect
        if (navbar) {
          if (scrollY > 50) {
            navbar.classList.add('scrolled')
          } else {
            navbar.classList.remove('scrolled')
          }
        }
        
        // Update active section based on scroll position
        updateActiveSection()
        
        // Animate elements on scroll
        animateOnScroll()
      })

      // Update active section based on scroll position
      function updateActiveSection() {
        const sections = ['accueil', 'services', 'apropos', 'contact']
        let currentSection = 'accueil'
        
        sections.forEach(sectionId => {
          const section = document.getElementById(sectionId)
          if (section) {
            const rect = section.getBoundingClientRect()
            if (rect.top <= 100 && rect.bottom >= 100) {
              currentSection = sectionId
            }
          }
        })
        
        updateActiveNavLink(currentSection)
      }

      // Animate elements on scroll
      function animateOnScroll() {
        animateElements.forEach(element => {
          const elementTop = element.getBoundingClientRect().top
          const elementVisible = 150
          
          if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible')
          }
        })
      }

      // Contact Form Handling
      if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
          e.preventDefault()
          
          // Get form data
          const formData = new FormData(contactForm as HTMLFormElement)
          const data: {[key: string]: any} = {}
          formData.forEach((value, key) => {
            data[key] = value
          })
          
          // Validation
          if (!validateForm(data)) {
            return
          }
          
          // Show loading state
          const submitButton = contactForm.querySelector('button[type="submit"]') as HTMLButtonElement
          if (submitButton) {
            const originalText = submitButton.textContent
            submitButton.textContent = 'Envoi en cours...'
            submitButton.disabled = true
            submitButton.classList.add('loading')
            
            // Simulate form submission
            setTimeout(() => {
              // Reset form
              if (contactForm && typeof (contactForm as HTMLFormElement).reset === 'function') {
                (contactForm as HTMLFormElement).reset()
              }
              
              // Show success message
              showSuccessMessage()
              
              // Reset button
              submitButton.textContent = originalText
              submitButton.disabled = false
              submitButton.classList.remove('loading')
            }, 2000)
          }
        })
      }

      // Form validation
      function validateForm(data: {[key: string]: any}) {
        let isValid = true
        const errors = []
        
        // Required fields
        if (!data.prenom || data.prenom.trim() === '') {
          errors.push('Le prénom est requis')
          highlightError('prenom')
          isValid = false
        }
        
        if (!data.nom || data.nom.trim() === '') {
          errors.push('Le nom est requis')
          highlightError('nom')
          isValid = false
        }
        
        if (!data.email || data.email.trim() === '') {
          errors.push('L\'email est requis')
          highlightError('email')
          isValid = false
        } else if (!isValidEmail(data.email)) {
          errors.push('L\'email n\'est pas valide')
          highlightError('email')
          isValid = false
        }
        
        if (!isValid) {
          showErrorMessage(errors)
        }
        
        return isValid
      }

      // Email validation
      function isValidEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
      }

      // Highlight form errors
      function highlightError(fieldName: string) {
        const field = document.getElementById(fieldName) as HTMLInputElement
        if (field) {
          field.classList.add('border-red-500')
          field.addEventListener('input', function() {
            field.classList.remove('border-red-500')
          }, { once: true })
        }
      }

      // Show error message
      function showErrorMessage(errors: string[]) {
        removeMessages()
        const errorDiv = document.createElement('div')
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'
        errorDiv.innerHTML = `
          <strong class="font-bold">Erreurs dans le formulaire :</strong>
          <ul class="mt-2">
            ${errors.map(error => `<li>• ${error}</li>`).join('')}
          </ul>
        `
        if (contactForm) {
          contactForm.insertBefore(errorDiv, contactForm.firstChild)
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          if (errorDiv.parentNode) {
            errorDiv.remove()
          }
        }, 5000)
      }

      // Show success message
      function showSuccessMessage() {
        removeMessages()
        const successDiv = document.createElement('div')
        successDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 success-message'
        successDiv.innerHTML = `
          <strong class="font-bold">Message envoyé avec succès !</strong>
          <p class="mt-1">Nous vous recontacterons dans les plus brefs délais.</p>
        `
        if (contactForm) {
          contactForm.insertBefore(successDiv, contactForm.firstChild)
        }
        
        // Animate in
        setTimeout(() => {
          successDiv.classList.add('show')
        }, 100)
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          if (successDiv.parentNode) {
            successDiv.remove()
          }
        }, 5000)
      }

      // Remove existing messages
      function removeMessages() {
        if (contactForm) {
          const existingMessages = contactForm.querySelectorAll('.bg-red-100, .bg-green-100')
          existingMessages.forEach(msg => msg.remove())
        }
      }

      // Initialize animations on load
      animateOnScroll()

      // Keyboard navigation support
      document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden')
          mobileMenu.classList.remove('open')
          const icon = mobileMenuButton?.querySelector('svg')
          if (icon) {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />'
          }
        }
      })
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeApp)
    } else {
      initializeApp()
    }
  }, [])

  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      
      <main>
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm transition-all duration-300" id="navbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-blue-700">ProConnect RH</h1>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <a href="#accueil" className="nav-link text-gray-900 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Accueil</a>
                  <a href="#services" className="nav-link text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Services</a>
                  <a href="#apropos" className="nav-link text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">À propos</a>
                  <a href="#contact" className="nav-link text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</a>
                </div>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button type="button" className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Ouvrir le menu principal</span>
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          <div className="mobile-menu hidden md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <a href="#accueil" className="mobile-nav-link block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-blue-700 hover:bg-gray-50">Accueil</a>
              <a href="#services" className="mobile-nav-link block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-700 hover:bg-gray-50">Services</a>
              <a href="#apropos" className="mobile-nav-link block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-700 hover:bg-gray-50">À propos</a>
              <a href="#contact" className="mobile-nav-link block px-3 py-2 rounded-md text-base font-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-700 hover:bg-gray-50">Contact</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="accueil" className="pt-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Votre partenaire RH <br />
                <span className="text-blue-300">de confiance</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                ProConnect RH accompagne les entreprises dans leur gestion des ressources humaines avec expertise et professionnalisme.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#services" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                  Découvrir nos services
                </a>
                <a href="#contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors">
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nos Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des solutions RH complètes et personnalisées pour accompagner votre entreprise à chaque étape de son développement.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Placement de Personnel */}
              <div className="service-card bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow animate-on-scroll">
                <div className="w-16 h-16 bg-blue-700 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Placement de Personnel</h3>
                <p className="text-gray-600 mb-6">
                  Nous vous aidons à trouver les meilleurs talents pour tous les secteurs d&apos;activité. Notre approche personnalisée garantit un matching parfait entre vos besoins et les compétences des candidats.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-700 rounded-full mr-3"></span>
                    Recrutement dans tous les secteurs
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-700 rounded-full mr-3"></span>
                    Processus de sélection rigoureux
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-700 rounded-full mr-3"></span>
                    Suivi post-placement
                  </li>
                </ul>
              </div>

              {/* Traitement de la Paie */}
              <div className="service-card bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow animate-on-scroll">
                <div className="w-16 h-16 bg-blue-700 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Traitement de la Paie</h3>
                <p className="text-gray-600 mb-6">
                  Services complets de gestion de la paie avec garantie de conformité légale. Nous nous occupons de toute la complexité administrative pour que vous puissiez vous concentrer sur votre cœur de métier.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-700 rounded-full mr-3"></span>
                    Gestion complète de la paie
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-700 rounded-full mr-3"></span>
                    Conformité légale garantie
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-700 rounded-full mr-3"></span>
                    Déclarations sociales
                  </li>
                </ul>
              </div>

              {/* Formations RH */}
              <div className="service-card bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow animate-on-scroll">
                <div className="w-16 h-16 bg-blue-700 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Formations RH</h3>
                <p className="text-gray-600 mb-6">
                  Programmes de formation diversifiés pour développer les compétences de vos équipes RH et managers. Nos formations s&apos;adaptent aux besoins spécifiques de votre organisation.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-700 rounded-full mr-3"></span>
                    Formations sur mesure
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-700 rounded-full mr-3"></span>
                    Expertise reconnue
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-700 rounded-full mr-3"></span>
                    Suivi personnalisé
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* À propos Section */}
        <section id="apropos" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">À propos de ProConnect RH</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Cabinet RH nouvellement créé, nous apportons une approche moderne et personnalisée à la gestion des ressources humaines. Notre équipe d&apos;experts accompagne les PME et grandes entreprises dans tous leurs défis RH.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Nous croyons en des solutions RH qui s&apos;adaptent à votre réalité d&apos;entreprise, avec un service de proximité et une expertise technique de pointe.
                </p>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700">100%</div>
                    <div className="text-sm text-gray-600">Satisfaction client</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700">24h</div>
                    <div className="text-sm text-gray-600">Temps de réponse</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700">360°</div>
                    <div className="text-sm text-gray-600">Accompagnement</div>
                  </div>
                </div>
              </div>
              <div className="animate-on-scroll">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Nos Valeurs</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-700 rounded-full flex-shrink-0 mt-1 mr-4"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Excellence</h4>
                        <p className="text-gray-600">Nous visons l&apos;excellence dans chaque mission.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-700 rounded-full flex-shrink-0 mt-1 mr-4"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Proximité</h4>
                        <p className="text-gray-600">Un accompagnement personnalisé et proche de vous.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-700 rounded-full flex-shrink-0 mt-1 mr-4"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Innovation</h4>
                        <p className="text-gray-600">Des solutions RH modernes et efficaces.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Témoignages Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Témoignages</h2>
              <p className="text-xl text-gray-600">Ce que disent nos clients de nos services</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="testimonial-card bg-gray-50 rounded-xl p-8 animate-on-scroll">
                <div className="text-blue-700 mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  &quot;ProConnect RH nous a aidés à restructurer notre service paie avec une efficacité remarquable. Leur expertise nous a fait gagner un temps précieux.&quot;
                </p>
                <div className="font-semibold text-gray-900">Marie Dubois</div>
                <div className="text-sm text-gray-500">DRH, TechCorp</div>
              </div>
              
              <div className="testimonial-card bg-gray-50 rounded-xl p-8 animate-on-scroll">
                <div className="text-blue-700 mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  &quot;Grâce aux formations proposées par ProConnect RH, nos managers ont développé de nouvelles compétences en gestion d&apos;équipe. Très satisfaits !&quot;
                </p>
                <div className="font-semibold text-gray-900">Pierre Martin</div>
                <div className="text-sm text-gray-500">Directeur, InnoSolutions</div>
              </div>
              
              <div className="testimonial-card bg-gray-50 rounded-xl p-8 animate-on-scroll">
                <div className="text-blue-700 mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  &quot;Le service de placement de personnel de ProConnect RH nous a permis de recruter des profils parfaitement adaptés à nos besoins. Un service de qualité !&quot;
                </p>
                <div className="font-semibold text-gray-900">Sophie Leroy</div>
                <div className="text-sm text-gray-500">CEO, StartupX</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Contactez-nous</h2>
              <p className="text-xl text-gray-300">Prêt à transformer votre gestion RH ? Parlons-en ensemble.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="animate-on-scroll">
                <h3 className="text-2xl font-semibold mb-6">Parlons de votre projet</h3>
                <p className="text-gray-300 mb-8">
                  Que vous soyez une PME ou une grande entreprise, nos experts sont là pour vous accompagner dans tous vos défis RH. Contactez-nous pour un diagnostic gratuit.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span>+33 1 XX XX XX XX</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>contact@proconnectrh.fr</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Paris, France</span>
                  </div>
                </div>
              </div>
              
              <div className="animate-on-scroll">
                <form className="bg-white rounded-xl p-8 text-gray-900" id="contact-form">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      <input type="text" id="prenom" name="prenom" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input type="text" id="nom" name="nom" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" id="email" name="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="entreprise" className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
                    <input type="text" id="entreprise" name="entreprise" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">Service d&apos;intérêt</label>
                    <select id="service" name="service" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Sélectionnez un service</option>
                      <option value="placement">Placement de personnel</option>
                      <option value="paie">Traitement de la paie</option>
                      <option value="formation">Formations RH</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea id="message" name="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                  </div>
                  
                  <button type="submit" className="w-full bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">ProConnect RH</h3>
                <p className="text-gray-300 mb-4">
                  Votre partenaire RH de confiance pour accompagner la croissance de votre entreprise avec des solutions personnalisées et innovantes.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#services" className="hover:text-blue-400 transition-colors">Placement de personnel</a></li>
                  <li><a href="#services" className="hover:text-blue-400 transition-colors">Traitement de la paie</a></li>
                  <li><a href="#services" className="hover:text-blue-400 transition-colors">Formations RH</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>Paris, France</li>
                  <li>+33 1 XX XX XX XX</li>
                  <li>contact@proconnectrh.fr</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 ProConnect RH. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        /* Custom CSS pour ProConnect RH */

        /* Fonts */
        body {
          font-family: 'Inter', sans-serif;
        }

        /* Custom Tailwind utilities */
        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Navigation active state */
        .nav-link.active {
          color: #1d4ed8;
          font-weight: 600;
        }

        /* Animations */
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.6s ease-out;
        }

        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Service cards hover effects */
        .service-card {
          transform: translateY(0);
          transition: all 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Testimonial cards */
        .testimonial-card {
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }

        .testimonial-card:hover {
          border-left-color: #1d4ed8;
          transform: translateX(5px);
        }

        /* Button animations */
        button, .btn {
          transition: all 0.2s ease;
        }

        button:hover, .btn:hover {
          transform: translateY(-1px);
        }

        /* Form focus states */
        input:focus, textarea:focus, select:focus {
          outline: none;
          ring: 2px;
          ring-color: #3b82f6;
          border-color: transparent;
        }

        /* Mobile menu animation */
        .mobile-menu {
          transition: all 0.3s ease;
          max-height: 0;
          overflow: hidden;
        }

        .mobile-menu.open {
          max-height: 300px;
        }

        /* Navbar scroll effect */
        #navbar.scrolled {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* Loading animation for form submission */
        .loading {
          position: relative;
          overflow: hidden;
        }

        .loading::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* Success message animation */
        .success-message {
          transform: scale(0);
          transition: all 0.3s ease;
        }

        .success-message.show {
          transform: scale(1);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .animate-on-scroll {
            transform: translateY(30px);
          }
          
          .service-card:hover {
            transform: translateY(-2px);
          }
          
          .testimonial-card:hover {
            transform: translateX(2px);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-on-scroll,
          .service-card,
          .testimonial-card,
          button,
          .btn {
            animation: none !important;
            transition: none !important;
          }
          
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </>
  )
}