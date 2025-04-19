import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Send,
  User,
  Clock,
  MapPin,
  ChevronDown,
  Check,
} from "lucide-react";

// Define types for form data and errors
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contacts() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState("message");
  const [currentTime, setCurrentTime] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Contact information
  const contactInfo = {
    email: "contact@example.com",
    phone: "(555) 123-4567",
    address: "123 Innovation Way, Tech City, CA 94043",
    hours: "Monday - Friday: 9am - 6pm",
  };

  // FAQ items
  const faqItems = [
    {
      question: "How quickly do you respond to inquiries?",
      answer:
        "We typically respond to all inquiries within 24 hours during business days.",
    },
    {
      question: "Do you offer support on weekends?",
      answer:
        "Our support team is available Monday through Friday. Weekend support is available for premium clients.",
    },
    {
      question: "Can I schedule a consultation call?",
      answer:
        "Yes! You can request a consultation call through this form or by directly calling our office.",
    },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email) && formData.email.trim())
      errors.email = "Invalid email format";
    if (!formData.message.trim()) errors.message = "Message is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (formErrors[name as keyof FormErrors]) {
      const updatedErrors = { ...formErrors };
      delete updatedErrors[name as keyof FormErrors];
      setFormErrors(updatedErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    // Simulate sending email
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);

      // Reset form after success
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 5000);
    }, 2000);
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? "" : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
        {/* Design elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-indigo-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-pink-100 rounded-full opacity-50"></div>

        {/* Left sidebar with contact info */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 lg:p-12 lg:w-2/5 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-600 opacity-20 rounded-full"></div>
          <div className="absolute bottom-20 -left-20 w-40 h-40 bg-purple-600 opacity-20 rounded-full"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"></div>
              <span className="text-xl font-bold tracking-tight">COMPANY</span>
            </div>

            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Let's Start a Conversation
            </h1>
            <p className="text-indigo-200 mb-12 text-lg">
              We're excited to hear from you and learn how we can help with your
              project or inquiry.
            </p>

            <div className="space-y-8 mt-12 relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-indigo-700/50"></div>

              <div className="flex items-start space-x-4 relative">
                <div className="w-12 h-12 bg-indigo-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <Mail size={20} className="text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-indigo-100">
                    Email Us
                  </h3>
                  <p className="text-indigo-300">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 relative">
                <div className="w-12 h-12 bg-indigo-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <Phone size={20} className="text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-indigo-100">
                    Call Us
                  </h3>
                  <p className="text-indigo-300">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 relative">
                <div className="w-12 h-12 bg-indigo-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <MapPin size={20} className="text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-indigo-100">
                    Visit Us
                  </h3>
                  <p className="text-indigo-300">{contactInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 relative">
                <div className="w-12 h-12 bg-indigo-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <Clock size={20} className="text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-indigo-100">
                    Business Hours
                  </h3>
                  <p className="text-indigo-300">{contactInfo.hours}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        new Date().getHours() >= 9 &&
                        new Date().getHours() < 18 &&
                        new Date().getDay() > 0 &&
                        new Date().getDay() < 6
                          ? "bg-green-400"
                          : "bg-red-400"
                      }`}
                    ></div>
                    <span className="text-sm text-indigo-300">
                      {new Date().getHours() >= 9 &&
                      new Date().getHours() < 18 &&
                      new Date().getDay() > 0 &&
                      new Date().getDay() < 6
                        ? "Currently Open"
                        : "Currently Closed"}
                    </span>
                    <span className="text-xs text-indigo-400">
                      {currentTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side with form */}
        <div className="p-8 lg:p-12 lg:w-3/5 relative">
          <nav className="mb-10 flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => toggleSection("message")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeSection === "message"
                  ? "bg-white shadow-sm text-indigo-800"
                  : "text-gray-600 hover:text-indigo-700"
              }`}
            >
              Send Message
            </button>
            <button
              onClick={() => toggleSection("faq")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeSection === "faq"
                  ? "bg-white shadow-sm text-indigo-800"
                  : "text-gray-600 hover:text-indigo-700"
              }`}
            >
              FAQ
            </button>
          </nav>

          {activeSection === "message" && (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                We'll get back to you as soon as possible
              </p>

              {submitted ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    <Check size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Thank you for reaching out, {formData.name}.
                  </p>
                  <p className="text-gray-500 text-sm">
                    We've received your message and will respond to your inquiry
                    at {formData.email} shortly.
                  </p>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Your Name
                      </label>
                      <div
                        className={`relative ${
                          formErrors.name ? "animate-shake" : ""
                        }`}
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User
                            size={18}
                            className={
                              formErrors.name ? "text-red-400" : "text-gray-400"
                            }
                          />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                            formErrors.name
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200"
                          } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition`}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Your Email
                      </label>
                      <div
                        className={`relative ${
                          formErrors.email ? "animate-shake" : ""
                        }`}
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail
                            size={18}
                            className={
                              formErrors.email
                                ? "text-red-400"
                                : "text-gray-400"
                            }
                          />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                            formErrors.email
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200"
                          } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition`}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Subject (Optional)
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Your Message
                    </label>
                    <div
                      className={`relative ${
                        formErrors.message ? "animate-shake" : ""
                      }`}
                    >
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you today?"
                        rows={4}
                        className={`w-full px-4 py-3 bg-gray-50 border ${
                          formErrors.message
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200"
                        } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition`}
                      ></textarea>
                    </div>
                    {formErrors.message && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      className="w-4 h-4 rounded bg-gray-100 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="#" className="text-indigo-600 hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-md flex items-center justify-center space-x-2 relative overflow-hidden group"
                  >
                    {submitting ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                        <span>Send Message</span>
                        <div className="absolute right-full w-full h-full bg-white/20 skew-x-12 transition-all group-hover:right-0 duration-300 opacity-0 group-hover:opacity-100"></div>
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {activeSection === "faq" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 mb-8">
                  Find quick answers to common questions
                </p>
              </div>

              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition text-left"
                      onClick={() => toggleSection(`faq-${index}`)}
                    >
                      <span className="font-medium text-gray-800">
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-gray-500 transition-transform ${
                          activeSection === `faq-${index}` ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeSection === `faq-${index}` && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-indigo-50 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                  Still have questions?
                </h3>
                <p className="text-indigo-600 mb-4">
                  Don't hesitate to reach out to our support team directly.
                </p>
                <button
                  onClick={() => toggleSection("message")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Contact Us
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap justify-between items-center">
              <div className="text-sm text-gray-500">
                © 2025 Your Company. All rights reserved.
              </div>

              <div className="flex space-x-3 mt-4 md:mt-0">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
