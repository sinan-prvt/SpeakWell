import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "./Icon";
import { COURSES, WHATSAPP } from "../data";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const text = `*New Enrollment Enquiry*\n\n*Name:* ${data.get("name") || "N/A"}\n*Phone:* ${data.get("phone") || "N/A"}\n*Email:* ${data.get("email") || "N/A"}\n*Course:* ${data.get("course") || "N/A"}\n*Mode:* ${data.get("mode") || "N/A"}\n*Message:* ${data.get("message") || "None"}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
    setSent(true);
  };

  return (
    <div className="glass form-card">
      <div className="form-glow" />
      <h3 className="form-title">Enroll Now</h3>
      <p className="muted">Our team will contact you within 24 hours.</p>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="sent" className="form-sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.div className="sent-check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}>
              <Icon name="check" size={34} stroke={2.4} />
            </motion.div>
            <h4 className="serif gold-text" style={{ fontSize: "1.8rem" }}>Enquiry Sent!</h4>
            <p className="muted">Muhammed Shafi Sir's team will contact you shortly. Welcome to the SpeakWell family!</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0, y: -10 }}>
            <div className="form-row">
              <Field label="Full Name"><input required name="name" type="text" placeholder="Your name" autoComplete="name" /></Field>
              <Field label="Phone / WhatsApp"><input required name="phone" type="tel" placeholder="+91 XXXXX XXXXX" autoComplete="tel" /></Field>
            </div>
            <Field label="Email"><input required name="email" type="email" placeholder="your@email.com" autoComplete="email" /></Field>
            <div className="form-row">
              <Field label="Course">
                <select required name="course" defaultValue="">
                  <option value="" disabled>Select…</option>
                  {COURSES.map((c) => <option key={c.title} value={c.title}>{c.title}</option>)}
                </select>
              </Field>
              <Field label="Mode">
                <select required name="mode">
                  <option value="Online">Online</option>
                  <option value="Offline – Tirurangadi">Offline – Tirurangadi</option>
                  <option value="Both okay">Both okay</option>
                </select>
              </Field>
            </div>
            <Field label="Message (Optional)"><textarea name="message" rows={3} placeholder="Your goals or questions for Muhammed Shafi Sir…" /></Field>
            <button type="submit" className="btn btn-gold btn-block">
              Send Enquiry &amp; Enroll <Icon name="arrow" size={18} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const Field = ({ label, children }) => (
  <label className="field">
    <span className="field-label">{label}</span>
    {children}
  </label>
);
