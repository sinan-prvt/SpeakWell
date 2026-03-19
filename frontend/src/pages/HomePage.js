import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CircularGallery from '../components/CircularGallery';
import '../styles/Testimonials.css';
import '../styles/HomePage.css';

function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [services, setServices] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  
  // High-end testimonials for the 3D gallery
  const testimonialItems = [
    { 
      image: '/avatars/emil.png', 
      text: 'Emil White', 
      feedback: 'Finally I find the English language course. My course lasted 5 months, but I will not stop.',
      rating: 5
    },
    { 
      image: '/avatars/tom.png', 
      text: 'Tom Brighton', 
      feedback: 'Very cool teachers! Thanks :)',
      rating: 5
    },
    { 
      image: '/avatars/jessica.png', 
      text: 'Jessica Koel', 
      feedback: 'The structured lessons and professional instructors helped me gain confidence in speaking English fluently.',
      rating: 5
    },
    { 
      image: '/avatars/adam.png', 
      text: 'Adam Smith', 
      feedback: 'Great platform! The interactive sessions are the best part of the program.',
      rating: 5
    },
    { 
      image: '/avatars/sarah.png', 
      text: 'Sarah Lee', 
      feedback: 'I highly recommend SpeakWell to anyone looking to improve their communication skills. Absolutely loved it!',
      rating: 5
    },
    { 
      image: '/avatars/michael.png', 
      text: 'Michael Jordan', 
      feedback: 'Exceeded my expectations. The staff is very supportive and the material is well-organized.',
      rating: 5
    },
  ];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });

  useEffect(() => {
    // Fetch Services
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error('Error fetching services:', err));

    // Fetch Instructor
    fetch('/api/instructor')
      .then(res => res.json())
      .then(data => setInstructor(data))
      .catch(err => console.error('Error fetching instructor:', err));

    // Fetch Testimonials
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error('Error fetching testimonials:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', course: '', message: '' });
  };

  const renderStars = (rating) => '⭐'.repeat(rating);

  const heroImage = "/images/hero_redesign.png";

  return (
    <div className="home-page-container">
      {/* 1. Hero Section */}
      <section className="hero-section" id="home">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">Expert-Led English</span>
            <h1 className="hero-title">
              Your Next <br />
              <span>English School</span>
            </h1>
            <p className="hero-description">
              Master the art of fluent speaking with personalized lessons from the comfort of your home.
            </p>
            <div className="hero-actions">
              <a href="#services" className="btn-enroll">
                Enroll Now <span className="arrow">→</span>
              </a>
              <button className="btn-play">
                <div className="play-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span>Play Video</span>
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img src={heroImage} alt="E-Learning Platform" className="hero-main-img" />
              <div className="floating-card info-card">
                <div className="card-icon">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Photos_icon_%282020%29.svg" alt="Google" width="20" />
                </div>
                <div className="card-text">
                  <p>Basic of Google Design Style</p>
                </div>
              </div>
              <div className="orbit-icon icon-yt">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" alt="YouTube" width="24" />
              </div>
              <div className="orbit-icon icon-drive">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Drive" width="24" />
              </div>
              <div className="orbit-icon icon-google">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="24" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trainer Section (About) */}
      <section className="trainer-section" id="about">
        <div className="container">
          <div className="trainer-grid">
            <div className="trainer-image-area">
              <div className="trainer-img-wrapper">
                <img src={instructor?.image || "/images/profile.png"} alt={instructor?.name || "Muhammed Shafi"} className="trainer-main-img" />
                <div className="experience-badge">
                  <span>{instructor?.experience || "12+ Years"}</span>
                  <p>Experience</p>
                </div>
              </div>
            </div>

            <div className="trainer-content">
              <span className="trainer-badge">Meet Your Trainer</span>
              <h2 className="trainer-name">{instructor?.name || "Muhammed Shafi"}</h2>
              <p className="trainer-title">{instructor?.title || "Senior English Trainer & CEO"}</p>
              <p className="trainer-bio">{instructor?.bio || "Muhammed Shafi is a passionate language coach dedicated to helping students unlock their potential through fluent English communication."}</p>
              
              {instructor?.qualifications && (
                <div className="qualifications-mini">
                  <h3>Qualifications</h3>
                  <ul>
                    {instructor.qualifications.split(',').slice(0, 3).map((qual, idx) => (
                      <li key={idx}>• {qual.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="trainer-actions">
                <a href="#contact" className="btn-trainer-contact">Contact Now</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services/Courses Section */}
      <section className="services-section-v2" id="services">
        <div className="container">
          <h2 className="section-title-center">Our Services & Courses</h2>
          <p className="section-subtitle-center">Choose the perfect course for your English learning journey</p>
          
          <div className="services-grid-v2">
            {services.map(service => (
              <div key={service.id} className="service-card-v2">
                <div className="service-img-v2">
                  <img src={service.image} alt={service.name} />
                  <span className="level-tag">{service.level}</span>
                </div>
                <div className="service-info-v2">
                  <h3>{service.name}</h3>
                  <div className="service-meta-v2">
                    <span>⏱️ {service.duration}</span>
                    <span className="price-tag">{service.price}</span>
                  </div>
                  <p>{service.description}</p>
                  <a href="#contact" className="btn-enroll-small">Enroll Now</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header-v3 text-center" style={{ marginBottom: '40px' }}>
            <span className="contact-tag-red">● REVIEWS ●</span>
            <h2 style={{ fontSize: '3rem', color: '#1a1a2e' }}>What Our Students <br /> Think About Us</h2>
          </div>
          
          <div style={{ height: '900px', position: 'relative', width: '100%', marginTop: '20px' }}>
            <CircularGallery 
              items={testimonialItems} 
              bend={3} 
              textColor="#1a1a2e" 
              borderRadius={0.05} 
            />
          </div>
        </div>
      </section>

      {/* 6. Contact Section Redesign */}
      <section className="contact-section-redesign" id="contact">
        <div className="container contact-container-v3">
          <div className="contact-visual-side">
            <div className="chat-card-red">
              <div className="chat-icon-circle">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </div>
              <h3>Chat With Live !</h3>
              <p>Porro. Erat gravida adipisci quibusdam faucibus diam molestias? Ante, arcu commo do; nan! Phasellus risus.</p>
              <button className="btn-chat-white">LET'S CHAT</button>
            </div>
            <div className="representative-image-wrapper">
              <img src="/images/contact_lady.png" alt="Contact Representative" className="lady-image" />
            </div>
          </div>

          <div className="contact-form-side">
            <div className="contact-header-v3">
              <span className="contact-tag-red">● CONTACT US ●</span>
              <h2>Reach & Get In Touch <br /> With Us !</h2>
            </div>
            <form className="speakwell-form-v3" onSubmit={(e) => { e.preventDefault(); alert('Message Sent!'); }}>
              <div className="form-grid-v3">
                <input type="text" placeholder="Your Name*" required />
                <input type="email" placeholder="Your Email*" required />
                <input type="tel" placeholder="Your number*" />
                <input type="text" placeholder="Your Subject*" />
              </div>
              <textarea placeholder="Enter message" rows="6"></textarea>
              <button type="submit" className="btn-send-red">SEND MESSAGE</button>
            </form>
          </div>
        </div>
      </section>

      {/* 7. Join Banner */}
      <section className="join-banner-section">
        <div className="container">
          <div className="join-banner-card">
            <div className="join-banner-content">
              <h2 className="banner-school-name">SpeakWell school</h2>
              <img src="/images/join_banner.png" alt="Join SpeakWell" className="banner-main-img" />
              <button className="btn-join-banner">Join!</button>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-pattern"></div>
    </div>
  );
}

export default HomePage;

