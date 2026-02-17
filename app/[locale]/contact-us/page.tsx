"use client";

import Image from "next/image";
import PageTitle from "components/Layouts/PageTitle";
import React, { useState, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function SupportPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would normally send the data to your API
      console.log("Form submitted:", formData);

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] to-[#0f1823] flex flex-col items-center px-5 py-10">
      <PageTitle title="Contact Us | Village Square" />
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <Image
          src={"/images/vs_logo.png"}
          alt="VillageSquare logo"
          width={50}
          height={100}
        />
        <div className="flex flex-col">
          <div className="text-lg font-semibold text-white">VillageSquare</div>
          <div className="text-xs text-slate-400">
            Where Connections Flourish
          </div>
        </div>
      </div>

      {/* Support Container */}
      <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-10 max-w-2xl w-full shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-4 text-white">
          VillageSquare Support
        </h1>
        <p className="text-center text-slate-300 mb-8 leading-relaxed">
          Need help? Fill out the form below and we'll get back to you as soon
          as possible.
        </p>

        {/* Contact Options */}
        <div className="bg-slate-900/60 rounded-xl p-6 mb-8">
          <h2 className="text-blue-400 text-lg font-semibold mb-4">
            Contact Options
          </h2>
          <p className="text-slate-200 mb-3">
            Email:{" "}
            <a
              href="mailto:support@villagesquare.io"
              className="text-blue-400 underline hover:text-blue-300"
            >
              support@villagesquare.io
            </a>
          </p>

          <p className="text-slate-200">
            Visit our{" "}
            <a
              href="/account-deletion"
              className="text-blue-400 underline hover:text-blue-300"
            >
              Account Deletion Page
            </a>
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
            <p className="text-green-300 text-center">
              Thank you! Your message has been sent successfully.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-slate-200 text-sm font-medium"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className={`w-full px-4 py-3.5 bg-slate-700/50 border ${errors.name ? "border-red-500" : "border-transparent"
                } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:bg-slate-700/70 focus:border-blue-500 transition-all`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1.5">{errors.name}</p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-slate-200 text-sm font-medium"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className={`w-full px-4 py-3.5 bg-slate-700/50 border ${errors.email ? "border-red-500" : "border-transparent"
                } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:bg-slate-700/70 focus:border-blue-500 transition-all`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1.5">{errors.email}</p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="subject"
              className="block mb-2 text-slate-200 text-sm font-medium"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className={`w-full px-4 py-3.5 bg-slate-700/50 border ${errors.subject ? "border-red-500" : "border-transparent"
                } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:bg-slate-700/70 focus:border-blue-500 transition-all`}
            />
            {errors.subject && (
              <p className="text-red-400 text-sm mt-1.5">{errors.subject}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="message"
              className="block mb-2 text-slate-200 text-sm font-medium"
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={5}
              className={`w-full px-4 py-3.5 bg-slate-700/50 border ${errors.message ? "border-red-500" : "border-transparent"
                } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:bg-slate-700/70 focus:border-blue-500 transition-all resize-vertical`}
            />
            {errors.message && (
              <p className="text-red-400 text-sm mt-1.5">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Footer / Address */}
      <div className="mt-12 text-center pb-6">
        <p className="text-slate-500 text-xs text-opacity-70">
          TheVillagesquare LTD • 22 cocacola road, Ilorin Kwara • &copy;{" "}
          {new Date().getFullYear()} TheVillagesquare. All rights reserved.
        </p>
      </div>
    </div>
  );
}
