import React, { useState, useEffect } from 'react';
import '../styles/TestimonialsPage.css';

function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error(err));
  }, []);

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="testimonials-page">
      <div className="container">
        <h1 className="section-title">Student Testimonials</h1>
        <p className="subtitle">Hear from our successful students</p>

        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-image">
                <img src={testimonial.image} alt={testimonial.name} />
              </div>
              <div className="testimonial-content">
                <div className="stars">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="testimonial-text">"{testimonial.testimonial}"</p>
                <div className="testimonial-author">
                  <h3>{testimonial.name}</h3>
                  <p className="role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <section className="testimonials-stats">
          <h2 className="section-title">Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">5000+</div>
              <div className="stat-label">Happy Students</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">4.9/5</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">12+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="success-stories">
          <h2 className="section-title">Success Stories</h2>
          <div className="stories-grid">
            <div className="story-card">
              <div className="story-icon">💼</div>
              <h3>Career Advancement</h3>
              <p>Hundreds of students have secured better positions and higher-paying roles after improving their English communication skills with us.</p>
            </div>
            <div className="story-card">
              <div className="story-icon">🎓</div>
              <h3>Exam Success</h3>
              <p>Students have achieved 7+ bands in IELTS speaking and cleared competitive exams like SSC, Bank, and Railway with improved English proficiency.</p>
            </div>
            <div className="story-card">
              <div className="story-icon">🌍</div>
              <h3>Global Opportunities</h3>
              <p>Our students have landed international jobs, pursued higher education abroad, and expanded their professional networks globally.</p>
            </div>
            <div className="story-card">
              <div className="story-icon">😊</div>
              <h3>Personal Growth</h3>
              <p>Beyond language skills, students report increased confidence, reduced anxiety in public speaking, and improved self-esteem.</p>
            </div>
          </div>
        </section>

        {/* Testimonial Video Section */}
        <section className="video-testimonials">
          <h2 className="section-title">Student Video Reviews</h2>
          <p className="subtitle">Watch our students speak about their experience</p>
          <div className="video-grid">
            <div className="video-placeholder">
              <div className="video-icon">▶️</div>
              <p>Video Testimonial 1</p>
            </div>
            <div className="video-placeholder">
              <div className="video-icon">▶️</div>
              <p>Video Testimonial 2</p>
            </div>
            <div className="video-placeholder">
              <div className="video-icon">▶️</div>
              <p>Video Testimonial 3</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="testimonials-cta">
          <h2>Ready to Join Our Success Stories?</h2>
          <p>Start your English learning journey today and become the next success story!</p>
          <a href="/contact" className="btn-primary">Enroll Now</a>
        </section>
      </div>
    </div>
  );
}

export default TestimonialsPage;
