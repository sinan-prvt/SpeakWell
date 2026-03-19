import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/InstructorPage.css';

function InstructorPage() {
  const [instructor, setInstructor] = useState(null);

  useEffect(() => {
    fetch('/api/instructor')
      .then(res => res.json())
      .then(data => setInstructor(data))
      .catch(err => console.error(err));
  }, []);

  if (!instructor) return <div className="loading">Loading...</div>;

  return (
    <div className="instructor-page">
      <div className="container">
        <h1 className="section-title">Meet Your Trainer</h1>

        <div className="instructor-hero">
          <div className="instructor-image">
            <img src={instructor.image} alt={instructor.name} />
          </div>
          <div className="instructor-info">
            <h2>{instructor.name}</h2>
            <p className="title">{instructor.title}</p>
            <p className="experience">Experience: {instructor.experience}</p>
            <p className="bio">{instructor.bio}</p>
            <div className="qualifications">
              <h3>Qualifications & Certifications</h3>
              <ul>
                {instructor.qualifications.split(',').map((qual, idx) => (
                  <li key={idx}>{qual.trim()}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="about-section">
          <div className="about-grid">
            <div className="about-card">
              <h3>Teaching Philosophy</h3>
              <p>I believe in creating an interactive and supportive learning environment where students can develop confidence in spoken English through practical exercises and real-world scenarios.</p>
            </div>
            <div className="about-card">
              <h3>What Makes Me Different</h3>
              <p>With over 12 years of experience, I use proven methodologies combined with modern teaching techniques to deliver personalized learning experiences tailored to each student's needs and goals.</p>
            </div>
            <div className="about-card">
              <h3>Student Success</h3>
              <p>5000+ students have transformed their English communication skills through my programs. Many have achieved their career goals, cleared competitive exams, and gained confidence in professional settings.</p>
            </div>
          </div>
        </section>

        {/* Expertise Areas */}
        <section className="expertise-section">
          <h2 className="section-title">Areas of Expertise</h2>
          <div className="expertise-grid">
            <div className="expertise-card">
              <div className="expertise-icon">🎯</div>
              <h3>Spoken English</h3>
              <p>Master conversational English with focus on fluency, accuracy, and natural pronunciation.</p>
            </div>
            <div className="expertise-card">
              <div className="expertise-icon">🔤</div>
              <h3>Grammar & Vocabulary</h3>
              <p>Build strong foundation with comprehensive grammar and vocabulary training.</p>
            </div>
            <div className="expertise-card">
              <div className="expertise-icon">🗣️</div>
              <h3>Accent Reduction</h3>
              <p>Specialized training to improve pronunciation and reduce native accent.</p>
            </div>
            <div className="expertise-card">
              <div className="expertise-icon">💼</div>
              <h3>Business English</h3>
              <p>Professional communication skills for corporate environments and global workplaces.</p>
            </div>
            <div className="expertise-card">
              <div className="expertise-icon">📝</div>
              <h3>IELTS Preparation</h3>
              <p>Comprehensive coaching for IELTS speaking band 7+.</p>
            </div>
            <div className="expertise-card">
              <div className="expertise-icon">👥</div>
              <h3>Corporate Training</h3>
              <p>Customized programs for organizations and professional groups.</p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="contact-info-section">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>Email</h3>
              <p>{instructor.contact.email}</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📱</div>
              <h3>Phone</h3>
              <p>{instructor.contact.phone}</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Location</h3>
              <p>{instructor.contact.location}</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/contact" className="btn-primary">Schedule a Free Consultation</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InstructorPage;
