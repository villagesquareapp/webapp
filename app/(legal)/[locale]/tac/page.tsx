"use client";

import Image from "next/image";
import PageTitle from "components/Layouts/PageTitle";
import React from "react";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-6 md:px-24 lg:px-40">
      <PageTitle title="Terms & Conditions | Village Square" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <Image src={"/images/vs_logo.png"} alt="logo" width={200} height={100} />
          <h1 className="text-4xl md:text-7xl font-bold text-primary mb-2">
            Terms & Conditions
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-8 mt-6">
          Effective Date: <span className="font-semibold">02-11-2023</span>
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700">
            Users must agree to comply with these terms and conditions when accessing and using the app.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            2. User Eligibility
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Users must be at least 18 years old to use the dating module ("Get Squared").</li>
            <li>Users are responsible for ensuring their activities on the app comply with local laws and regulations.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            3. Account Registration
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Users are required to create an account to access certain features of the app.</li>
            <li>Users are responsible for maintaining the confidentiality of their account information.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            4. User Content
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Users are solely responsible for the content they post on the app, including photos, videos, and text.</li>
            <li>Users must not post content that is offensive, illegal, or violates the rights of others.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            5. Marketplace (MarketSquare)
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Users engaging in buying and selling activities on MarketSquare must adhere to the marketplace rules and guidelines.</li>
            <li>The app is not responsible for transactions, disputes, or issues arising from marketplace activities.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            6. Dating Module (Get Squared)
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Users using the dating module must respect others' privacy and boundaries.</li>
            <li>The app is not responsible for interactions, relationships, or outcomes resulting from the dating module.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            7. Privacy and Data Security
          </h2>
          <p className="text-gray-700 mb-2">
            The app collects and processes user data according to the{" "}
            <a href="/en/privacy-policy" className="text-primary underline">
              Privacy Policy
            </a>
            .
          </p>
          <p className="text-gray-700">
            Users' privacy and data security are of utmost importance; the app employs industry-standard measures to safeguard user data.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            8. Termination of Accounts
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>The app reserves the right to suspend or terminate accounts violating the terms and conditions.</li>
            <li>Users can terminate their accounts at any time.</li>
          </ul>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            9. Limitation of Liability
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>The app is not liable for any direct, indirect, incidental, or consequential damages arising from the use of the app.</li>
            <li>The app is not responsible for the actions of third parties, including other users.</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            10. Changes to Terms and Conditions
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>The app reserves the right to modify these terms and conditions at any time.</li>
            <li>Users will be notified of significant changes via email or app notifications.</li>
          </ul>
        </section>

        {/* Section 11 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            11. Governing Law
          </h2>
          <p className="text-gray-700">
            These terms and conditions are governed by and construed in accordance with the laws of the{" "}
            <span className="font-semibold">Federal Republic of Nigeria</span>, without regard to its conflict of law principles.
          </p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            12. Contact Information
          </h2>
          <p className="text-gray-700">
            Users can contact the app's support team at{" "}
            <a href="mailto:admin@villagesquare.io" className="text-primary underline">
              admin@villagesquare.io
            </a>{" "}
            for any inquiries or concerns regarding the terms and conditions.
          </p>
        </section>

        {/* Agreement Notice */}
        <div className="mt-12 border-t pt-6 text-gray-700 text-sm">
          <p>
            By using the VillageSquare app, users agree to abide by these Terms and Conditions. It’s crucial to read and understand your responsibilities and rights while using our platform.
          </p>
        </div>
      </div>
    </div>
  );
}
