"use client";

import Image from "next/image";
import React from "react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-6 md:px-24 lg:px-40">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <Image
            src={"/images/vs_logo.png"}
            alt="VillageSquare logo"
            width={200}
            height={100}
          />
          <h1 className="text-4xl md:text-7xl font-bold text-primary mb-2">
            Disclaimer
          </h1>
        </div>

        <p className="text-sm text-gray-500 mb-8 mt-6">
          Effective Date: <span className="font-semibold">02-11-2023</span>
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">1. General</h2>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">VillageSquare</span> is a social
            networking platform, including a marketplace called{" "}
            <span className="font-semibold">MarketSquare</span> and a dating
            module named <span className="font-semibold">"Get Squared"</span>.
          </p>
          <p className="text-gray-700 mb-2">
            By using this App, you agree to comply with and be bound by the
            following disclaimer, which together with our{" "}
            <a href="/en/privacy-policy" className="text-primary underline">
              Privacy Policy
            </a>{" "}
            governs the relationship between you and{" "}
            <span className="font-semibold">TheVillageSquare LTD</span>.
          </p>
          <p className="text-gray-700">
            If you disagree with any part of this disclaimer, please do not use
            our App.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">2. User Content</h2>
          <p className="text-gray-700 mb-2">
            Users of the App are solely responsible for the content they post.
            <span className="font-semibold"> TheVillageSquare LTD</span> does
            not endorse or guarantee the accuracy, integrity, or quality of any
            user-generated content.
          </p>
          <p className="text-gray-700">
            Users should exercise their own judgment, caution, and common sense
            when evaluating any content found on the App.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            3. Marketplace (MarketSquare)
          </h2>
          <p className="text-gray-700 mb-2">
            MarketSquare is a platform for buying and selling goods and
            services. <span className="font-semibold">TheVillageSquare LTD</span>{" "}
            is not involved in any transaction between buyers and sellers.
          </p>
          <p className="text-gray-700 mb-2">
            Users are solely responsible for their interactions in the
            marketplace.{" "}
            <span className="font-semibold">TheVillageSquare LTD</span> does not
            guarantee the quality, safety, or legality of items listed, the
            accuracy of listings, or the ability of sellers to sell items or
            buyers to pay for items.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            4. Dating Module ("Get Squared")
          </h2>
          <p className="text-gray-700 mb-2">
            “Get Squared” is designed to facilitate connections between users.
            <span className="font-semibold"> TheVillageSquare LTD</span> does
            not conduct background checks or verify the accuracy of user
            profiles.
          </p>
          <p className="text-gray-700">
            Users are responsible for their interactions and relationships with
            others. <span className="font-semibold">TheVillageSquare LTD</span>{" "}
            is not liable for any actions or behavior of users met through the
            dating module.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">5. App Usage</h2>
          <p className="text-gray-700">
            Users agree not to misuse the App, including but not limited to
            violating applicable laws, infringing on intellectual property
            rights, or engaging in harmful or deceptive activities.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            6. Limitation of Liability
          </h2>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">TheVillageSquare LTD</span> shall
            not be liable for any indirect, incidental, special, consequential,
            or punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly.
          </p>
          <p className="text-gray-700">
            This includes losses resulting from unauthorized access, errors, or
            omissions in content, or loss of data or goodwill resulting from use
            of the App.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            7. Changes to Disclaimer
          </h2>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">TheVillageSquare LTD</span> reserves
            the right to modify or amend this disclaimer at any time.
          </p>
          <p className="text-gray-700">
            It is your responsibility to review this disclaimer periodically.
            Continued use of the App after any changes signifies your acceptance
            of the updated disclaimer.
          </p>
        </section>

        {/* Contact Info */}
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Contact Information
          </h2>
          <p className="text-gray-700">
            If you have any questions about this disclaimer, please contact us
            at{" "}
            <a href="mailto:admin@villagesquare.io" className="text-primary underline">
              admin@villagesquare.io
            </a>
            .
          </p>
        </section>

        {/* Footer note */}
        <div className="mt-12 border-t pt-6 text-gray-700 text-sm">
          <p>
            By continuing to use the VillageSquare app, you acknowledge that you
            have read and understood this disclaimer and agree to be bound by
            its terms.
          </p>
        </div>
      </div>
    </div>
  );
}
