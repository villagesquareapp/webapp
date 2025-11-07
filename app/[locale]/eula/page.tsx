"use client";

import Image from "next/image";
import React from "react";

export default function EULAPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-6 md:px-24 lg:px-40">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <Image src={"/images/vs_logo.png"} alt="VillageSquare logo" width={200} height={100} />
          <h1 className="text-2xl md:text-6xl font-bold text-primary mb-2">
            End-User License Agreement (EULA)
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-8 mt-6">
          Effective Date: <span className="font-semibold">02-11-2023</span>
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By installing and using <span className="font-semibold">VillageSquare</span>, you agree to comply with and be bound by the terms and conditions of this End-User License Agreement (EULA).
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">2. License Grant</h2>
          <p className="text-gray-700">
            <span className="font-semibold">TheVillageSquare LTD</span> grants you a revocable, non-exclusive, non-transferable, limited license to use the App solely for your personal, non-commercial purposes on a mobile device that you own or control.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">3. User-Generated Content</h2>
          <p className="text-gray-700 mb-2">
            Users are solely responsible for the content they post, including but not limited to text, images, and videos.
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">TheVillageSquare LTD</span> is not responsible for any user-generated content and does not endorse any opinions expressed by users.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">4. Marketplace (MarketSquare)</h2>
          <p className="text-gray-700 mb-2">
            The Marketplace feature allows users to buy and sell goods and services.
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">TheVillageSquare LTD</span> is not responsible for any transactions, disputes, or issues arising from the use of the Marketplace. Users are encouraged to exercise caution and use their best judgment.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Dating Module ("Get Squared")</h2>
          <p className="text-gray-700 mb-2">
            The Dating Module allows users to connect with others based on mutual interests.
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">TheVillageSquare LTD</span> does not conduct background checks on users. Users are responsible for their interactions and are advised to take necessary precautions when meeting in person.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">6. Privacy</h2>
          <p className="text-gray-700">
            Your privacy is important to us. Please refer to our{" "}
            <a href="/en/privacy-policy" className="text-primary underline">
              Privacy Policy
            </a>{" "}
            for information on how we collect, use, and disclose personal information.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">7. Termination</h2>
          <p className="text-gray-700">
            <span className="font-semibold">TheVillageSquare LTD</span> reserves the right to terminate your access to the App without notice if you violate this EULA.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">8. Changes to Terms</h2>
          <p className="text-gray-700">
            <span className="font-semibold">TheVillageSquare LTD</span> reserves the right to modify this EULA at any time. Continued use of the App after such modifications constitutes your acceptance of the updated terms.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">9. Disclaimer of Warranty</h2>
          <p className="text-gray-700">
            The App is provided <span className="italic">"as is"</span> without any warranties, express or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">10. Limitation of Liability</h2>
          <p className="text-gray-700">
            <span className="font-semibold">TheVillageSquare LTD</span> shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
          </p>
        </section>

        {/* Section 11 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">11. Governing Law</h2>
          <p className="text-gray-700">
            This EULA shall be governed by and construed in accordance with the laws of the{" "}
            <span className="font-semibold">Federal Republic of Nigeria</span>, without regard to its conflict of law principles.
          </p>
        </section>

        {/* Contact Info */}
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">Contact Information</h2>
          <p className="text-gray-700">
            If you have any questions about this EULA, please contact us at{" "}
            <a href="mailto:admin@villagesquare.io" className="text-primary underline">
              admin@villagesquare.io
            </a>
            .
          </p>
        </section>

        {/* Agreement Notice */}
        <div className="mt-12 border-t pt-6 text-gray-700 text-sm">
          <p>
            By installing or using the VillageSquare app, you acknowledge that you have read, understood, and agreed to be bound by the terms of this End-User License Agreement (EULA).
          </p>
        </div>
      </div>
    </div>
  );
}
