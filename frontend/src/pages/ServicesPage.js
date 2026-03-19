import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ServicesPage.css';

function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="services-page">
      <div className="container">
        <h1 className="section-title">Our Services & Courses</h1>
        <p className="subtitle">Choose the perfect course for your English learning journey</p>

        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-image">
                <img src={service.image} alt={service.name} />
                <div className="level-badge">{service.level}</div>
              </div>
              <div className="service-content">
                <h2>{service.name}</h2>
                <div className="service-meta">
                  <span className="duration">⏱️ {service.duration}</span>
                  <span className="price">{service.price}</span>
                </div>
                <p className="description">{service.description}</p>
                <div className="includes">
                  <h4>What's Included:</h4>
                  <ul>
                    {service.includes.map((item, idx) => (
                      <li key={idx}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
                <Link to="/contact" className="btn-primary">Enroll Now</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Why Each Course */}
        <section className="course-benefits">
          <h2 className="section-title">Why Choose Each Course?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <h3>👶 Beginner Courses</h3>
              <p>Perfect if you're just starting your English journey. Build a strong foundation with basic grammar, vocabulary, and conversational skills.</p>
            </div>
            <div className="benefit-item">
              <h3>🚀 Intermediate Courses</h3>
              <p>Ideal for those with some English knowledge who want to improve fluency and confidence in professional and social settings.</p>
            </div>
            <div className="benefit-item">
              <h3>💎 Advanced Courses</h3>
              <p>For professionals seeking to master English for career advancement, leadership roles, and international opportunities.</p>
            </div>
            <div className="benefit-item">
              <h3>🎤 Specialized Programs</h3>
              <p>Focused programs for specific needs like accent reduction, IELTS preparation, or corporate training.</p>
            </div>
          </div>
        </section>

        {/* Learning Path */}
        <section className="learning-path">
          <h2 className="section-title">Your Learning Journey</h2>
          <div className="path-timeline">
            <div className="path-step">
              <div className="step-number">1</div>
              <h4>Assessment</h4>
              <p>We assess your current level and goals</p>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">2</div>
              <h4>Customization</h4>
              <p>Tailor your learning to your needs</p>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">3</div>
              <h4>Learning</h4>
              <p>Engaging classes and practice</p>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">4</div>
              <h4>Progress</h4>
              <p>Achieve your English goals</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="services-cta">
          <h2>Still Not Sure?</h2>
          <p>Schedule a free consultation with us. We'll help you choose the perfect course!</p>
          <Link to="/contact" className="btn-primary">Get Free Consultation</Link>
        </section>
      </div>
    </div>
  );
}

export default ServicesPage;
