import React, { useState } from 'react';
import '../styles/ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="section-title">Get In Touch</h1>
        <p className="subtitle">Have questions? We're here to help!</p>

        <div className="contact-wrapper">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <div className="info-item">
              <div className="info-icon">📧</div>
              <div>
                <h3>Email</h3>
                <p><a href="mailto:rajesh@speakwell.com">rajesh@speakwell.com</a></p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📱</div>
              <div>
                <h3>Phone</h3>
                <p><a href="tel:+919876543210">+91 98765 43210</a></p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h3>Location</h3>
                <p>Delhi, India</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">⏰</div>
              <div>
                <h3>Working Hours</h3>
                <p>Monday - Friday: 9:00 AM - 9:00 PM</p>
                <p>Saturday: 9:00 AM - 5:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="#facebook" className="social-btn">Facebook</a>
                <a href="#instagram" className="social-btn">Instagram</a>
                <a href="#linkedin" className="social-btn">LinkedIn</a>
                <a href="#youtube" className="social-btn">YouTube</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label htmlFor="course">Interested Course *</label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a course</option>
                  <option value="beginner">Beginner Spoken English</option>
                  <option value="intermediate">Intermediate English Communication</option>
                  <option value="advanced">Advanced Professional English</option>
                  <option value="accent">Accent Reduction Program</option>
                  <option value="ielts">IELTS Speaking Preparation</option>
                  <option value="corporate">Corporate Training</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us about your English learning goals..."
                ></textarea>
              </div>

              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How long are the courses?</h3>
              <p>Our courses range from 6 to 12 weeks depending on the level and intensity. Each course has specific duration mentioned in the services page.</p>
            </div>
            <div className="faq-item">
              <h3>What is the class size?</h3>
              <p>We offer both group classes (max 8 students) and one-on-one sessions to ensure personalized attention and better learning outcomes.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer online classes?</h3>
              <p>Yes! We offer both in-person and online classes with the same quality instruction and interactive experience.</p>
            </div>
            <div className="faq-item">
              <h3>What if I miss a class?</h3>
              <p>We provide recorded sessions and flexible rescheduling options. You won't miss out on any learning material.</p>
            </div>
            <div className="faq-item">
              <h3>Is there a free trial class?</h3>
              <p>Yes! We offer a free consultation and trial class so you can experience our teaching methodology before enrolling.</p>
            </div>
            <div className="faq-item">
              <h3>What payment options do you accept?</h3>
              <p>We accept all major payment methods including credit/debit cards, net banking, UPI, and installment options for longer courses.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="contact-cta">
          <h2>Schedule a Free Consultation</h2>
          <p>Fill out the form above or contact us directly to discuss your English learning goals</p>
          <button onClick={() => window.location.href = '#'} className="btn-primary">Book a Call</button>
        </section>
      </div>
    </div>
  );
}

export default ContactPage;
