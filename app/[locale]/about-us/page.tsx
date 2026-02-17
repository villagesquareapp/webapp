"use client";

import Image from "next/image";
import PageTitle from "components/Layouts/PageTitle";
import React from "react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-6 md:px-24 lg:px-40">
      <PageTitle title="About Us | Village Square" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <Image src={"/images/vs_logo.png"} alt="VillageSquare logo" width={200} height={100} />
          <h1 className="text-4xl md:text-7xl font-bold text-primary mb-2">
            About Us
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-8 mt-6">
          Last Updated: <span className="font-semibold">February 2026</span>
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            1. Who We Are
          </h2>
          <p className="text-gray-700 mb-3">
            <span className="font-semibold">TheVillageSquare LTD</span> is a technology company that builds and operates
            VillageSquare — a social media platform designed to bring people together through shared experiences,
            content creation, and community engagement.
          </p>
          <p className="text-gray-700">
            Our platform is available on mobile (iOS and Android) and on the web, serving users who want to connect,
            share, and discover content in a vibrant social environment.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            2. What We Do
          </h2>
          <p className="text-gray-700 mb-3">
            VillageSquare is a feature-rich social media platform that enables users to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Create and share posts including text, photos, and videos</li>
            <li>Engage with content through likes, comments, saves, and shares</li>
            <li>Go live and interact with audiences in real-time via live streaming</li>
            <li>Watch and discover short-form video content through VFlix</li>
            <li>Connect with other users through direct messaging</li>
            <li>Build and customize personal profiles</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            3. In-App Economy &amp; Payments
          </h2>
          <p className="text-gray-700 mb-3">
            VillageSquare features an in-app coin system that powers our digital economy. Users can purchase coins
            using real currency through our integrated payment system powered by{" "}
            <span className="font-semibold">Flutterwave</span>.
          </p>
          <p className="text-gray-700 mb-3">
            Coins are used within the platform to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Send gifts to content creators and live stream hosts as a form of appreciation and support</li>
            <li>Access premium features and enhanced experiences on the platform</li>
            <li>Support fellow community members and their content</li>
          </ul>
          <p className="text-gray-700 mt-3">
            Flutterwave is used solely as our payment processing partner to facilitate secure coin purchases.
            All transactions are processed in compliance with applicable financial regulations.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            4. Our Mission
          </h2>
          <p className="text-gray-700">
            We believe in the power of community. Our mission is to create a safe, engaging, and inclusive digital
            space where people can express themselves, discover new content, support creators, and build meaningful
            connections — all within a single platform.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            5. Governing Law
          </h2>
          <p className="text-gray-700">
            TheVillageSquare LTD operates under the laws of the{" "}
            <span className="font-semibold">Federal Republic of Nigeria</span>.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            6. Contact Us
          </h2>
          <p className="text-gray-700">
            For any questions, partnership inquiries, or support, please reach out to us at{" "}
            <a href="mailto:admin@villagesquare.io" className="text-primary underline">
              admin@villagesquare.io
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
