"use client";

import Image from "next/image";
import PageTitle from "components/Layouts/PageTitle";
import React from "react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-6 md:px-24 lg:px-40">
      <PageTitle title="Refund Policy | Village Square" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <Image src={"/images/vs_logo.png"} alt="VillageSquare logo" width={200} height={100} />
          <h1 className="text-4xl md:text-7xl font-bold text-primary mb-2">
            Refund Policy
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-8 mt-6">
          Effective Date: <span className="font-semibold">February 2026</span>
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            1. Overview
          </h2>
          <p className="text-gray-700">
            This Refund Policy applies to all coin purchases made on the VillageSquare platform through our
            payment processing partner, <span className="font-semibold">Flutterwave</span>. By purchasing coins,
            you agree to the terms outlined in this policy.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            2. Coin Purchases
          </h2>
          <p className="text-gray-700 mb-3">
            Coins are a virtual currency used within the VillageSquare platform. They can be purchased using real
            currency via Flutterwave and are used to send gifts to creators, support live stream hosts, and access
            premium features.
          </p>
          <p className="text-gray-700">
            All coin purchases are processed securely through Flutterwave. Once a transaction is completed
            successfully, the corresponding coins are credited to your VillageSquare wallet immediately.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            3. Refund Eligibility
          </h2>
          <p className="text-gray-700 mb-3">
            Refunds may be granted under the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>
              <span className="font-semibold">Duplicate charges:</span> If you were charged more than once for the
              same coin purchase due to a technical error.
            </li>
            <li>
              <span className="font-semibold">Failed delivery:</span> If payment was deducted from your account but
              coins were not credited to your VillageSquare wallet.
            </li>
            <li>
              <span className="font-semibold">Unauthorized transactions:</span> If a purchase was made without your
              authorization and you can provide supporting evidence.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            4. Non-Refundable Scenarios
          </h2>
          <p className="text-gray-700 mb-3">
            Refunds will not be issued in the following cases:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Coins that have already been spent (e.g., sent as gifts to creators or used for premium features)</li>
            <li>Change of mind after a successful purchase and delivery of coins</li>
            <li>Account suspension or termination due to violation of our Terms and Conditions</li>
            <li>Dissatisfaction with content or interactions on the platform</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            5. How to Request a Refund
          </h2>
          <p className="text-gray-700 mb-3">
            To request a refund, please contact our support team with the following information:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Your VillageSquare username or registered email address</li>
            <li>Transaction reference number or Flutterwave payment receipt</li>
            <li>Date and amount of the transaction</li>
            <li>A brief description of the issue</li>
          </ul>
          <p className="text-gray-700 mt-3">
            Send your refund request to{" "}
            <a href="mailto:admin@villagesquare.io" className="text-primary underline">
              admin@villagesquare.io
            </a>{" "}
            with the subject line <span className="font-semibold">"Refund Request"</span>.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            6. Refund Processing
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Refund requests will be reviewed within <span className="font-semibold">7 business days</span> of receipt.</li>
            <li>Approved refunds will be processed back to the original payment method used for the purchase.</li>
            <li>
              Refund processing times may vary depending on your bank or payment provider, typically taking
              5–14 business days after approval.
            </li>
            <li>You will receive an email notification once your refund has been processed.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            7. Disputes
          </h2>
          <p className="text-gray-700">
            If your refund request is denied and you believe the decision is incorrect, you may escalate the matter
            by replying to the denial email with additional supporting information. We will conduct a secondary
            review and provide a final decision within <span className="font-semibold">14 business days</span>.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-700">
            TheVillageSquare LTD reserves the right to modify this Refund Policy at any time. Changes will be
            posted on this page with an updated effective date. Continued use of the platform after changes
            constitutes acceptance of the revised policy.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            9. Contact Us
          </h2>
          <p className="text-gray-700">
            For any questions regarding this Refund Policy, please contact us at{" "}
            <a href="mailto:admin@villagesquare.io" className="text-primary underline">
              admin@villagesquare.io
            </a>
            .
          </p>
        </section>

        {/* Agreement Notice */}
        <div className="mt-12 border-t pt-6 text-gray-700 text-sm">
          <p>
            By purchasing coins on VillageSquare, you acknowledge that you have read, understood, and agreed to
            this Refund Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
