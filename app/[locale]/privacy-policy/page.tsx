"use client";

import Image from "next/image";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-6 md:px-24 lg:px-40">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3">
            <Image src={'/images/vs_logo.png'} alt="logo"  width={200} height={100}/>
          <h1 className="text-4xl md:text-7xl font-bold text-primary mb-2">
            Privacy Policy
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-8 mt-6">
          Effective Date: <span className="font-semibold">02-11-2023</span>
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            1. Information We Collect
          </h2>
          <h3 className="text-lg font-semibold mb-2">
            1.1 Personal Information
          </h3>
          <p className="mb-2">
            We may collect personal information from users, including but not
            limited to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Full name</li>
            <li>Email address</li>
            <li>Date of birth</li>
            <li>Gender</li>
            <li>Location data</li>
            <li>Profile picture</li>
            <li>Interests and preferences</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            1.2 Additional Information
          </h3>
          <p className="mb-2">
            In addition to personal information, we may collect other data such
            as:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Content shared on the app (photos, videos, messages, etc.)</li>
            <li>Transaction details related to the Marketplace feature</li>
            <li>Data provided when using the "Get Squared" dating module</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Providing and improving our services</li>
            <li>Personalizing user experience</li>
            <li>Facilitating connections between users on the app</li>
            <li>Processing transactions on the Marketplace</li>
            <li>Sending relevant notifications and updates</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            3. Sharing Your Information
          </h2>
          <p className="text-gray-700 mb-2">
            We may share your information with third parties under the following
            circumstances:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            4. Data Security
          </h2>
          <p className="text-gray-700">
            We take appropriate measures to protect user data from unauthorized
            access, alteration, disclosure, or destruction. However, no method
            of transmission over the internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            5. Your Choices
          </h2>
          <p className="text-gray-700">
            Users can manage their account settings and privacy preferences
            within the app. You can also contact us to update or delete your
            personal information.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            6. Children's Privacy
          </h2>
          <p className="text-gray-700">
            Our services are not intended for children under the age of 13. We
            do not knowingly collect personal information from children. If you
            are a parent or guardian and believe that your child has provided us
            with personal information, please contact us, and we will delete the
            information.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            7. CSAE and CSAM Policy
          </h2>
          <p className="text-gray-700 mb-3">
            We are committed to protecting children from sexual abuse and
            exploitation (CSAE) and have a zero-tolerance policy toward any form
            of child sexual abuse material (CSAM). Our platform strictly
            prohibits:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
            <li>The creation, sharing, or distribution of CSAM.</li>
            <li>
              Grooming, sextortion, or any behavior that sexually exploits or
              endangers children.
            </li>
            <li>
              Trafficking of children for sexual purposes or any other form of
              child exploitation.
            </li>
          </ul>
          <p className="text-gray-700">
            We actively monitor and report any suspected instances of CSAE or
            CSAM to the relevant authorities. If you encounter any content or
            behavior that violates this policy, please report it immediately to{" "}
            <a
              href="mailto:admin@villagesquare.io"
              className="text-primary underline"
            >
              admin@villagesquare.io
            </a>
            .
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            8. Published Standards for CSAE
          </h2>
          <p className="text-gray-700 mb-3">
            To ensure transparency and compliance with global standards, we have
            published our policies and standards regarding CSAE on our website.
            These standards are accessible to all users and include:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
            <li>
              Functionality: The web resource is designed to load without errors
              and is accessible globally.
            </li>
            <li>
              Relevance: The content explicitly addresses CSAE and child safety.
            </li>
            <li>
              Reference: The resource clearly identifies the app or developer
              name as it appears on Google Play.
            </li>
          </ul>
          <p className="text-gray-700">
            You can access our published standards here:{" "}
            <a href="#" className="text-primary underline">
              CSAE Standards
            </a>
            .
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            9. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700">
            We may update our privacy policy from time to time. We will notify
            you of any changes by posting the new privacy policy on this page.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            10. Contact Us
          </h2>
          <p className="text-gray-700">
            If you have any questions or concerns about our privacy policy,
            please contact us at{" "}
            <a
              href="mailto:admin@villagesquare.io"
              className="text-primary underline"
            >
              admin@villagesquare.io
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
