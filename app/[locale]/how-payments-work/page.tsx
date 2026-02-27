"use client";

import Image from "next/image";
import PageTitle from "components/Layouts/PageTitle";
import React from "react";

export default function HowPaymentsWorkPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-6 md:px-24 lg:px-40">
      <PageTitle title="How Payments Work | Village Square" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <Image src={"/images/vs_logo.png"} alt="VillageSquare logo" width={200} height={100} />
          <h1 className="text-4xl md:text-7xl font-bold text-primary mb-2">
            How Payments Work
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-8 mt-6">
          Last Updated: <span className="font-semibold">February 2026</span>
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            1. Platform Overview
          </h2>
          <p className="text-gray-700 mb-3">
            VillageSquare is a social and digital services platform where users
            create content, engage with communities, livestream, and send virtual
            gifts.
          </p>
          <p className="text-gray-700 mb-3">
            Users may initiate payments to purchase VS Coins, which are
            non-transferable in-app digital engagement credits purchased with
            real currency through Flutterwave.
          </p>
          <p className="text-gray-700">
            VS Coins are used to send virtual gifts to content creators and
            livestreamers as part of a creator economy model.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            2. Role of VillageSquare
          </h2>
          <p className="text-gray-700 mb-3">
            VillageSquare provides the platform where transactions are initiated.
            VillageSquare is not a bank, wallet service, escrow service, e-money
            service, or financial institution.
          </p>
          <p className="text-gray-700 mb-3">
            VS Coins are internal, non-transferable digital engagement credits
            and do not represent stored monetary value.
          </p>
          <p className="text-gray-700">
            VillageSquare does not operate a financial service, money
            transmission business, or stored-value facility.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            3. Payment Processor
          </h2>
          <p className="text-gray-700 mb-3">
            All fiat payments are securely processed by Flutterwave as a
            licensed payment service provider.
          </p>
          <p className="text-gray-700 mb-3">
            VillageSquare does not store card details, bank account information,
            or directly process payments.
          </p>
          <p className="text-gray-700">
            Flutterwave handles all sensitive payment data in compliance with
            applicable financial regulations.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            4. How You Pay
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>You select a VS Coins package within the app</li>
            <li>You are directed to a secure payment page powered by Flutterwave</li>
            <li>You choose your preferred payment method and complete the payment</li>
            <li>Your payment is securely verified</li>
            <li>VS Coins are credited to your account</li>
          </ol>
          <p className="text-gray-700 mt-3">
            All payment processing is handled entirely by Flutterwave.
            VillageSquare never sees or stores your payment details.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            5. Fund Flow
          </h2>
          <p className="text-gray-700 mb-3">
            When a user makes a payment, the funds move as follows: the customer
            pays, Flutterwave processes the transaction, the bank authorizes the
            payment, and funds settle to the VillageSquare merchant account on
            Flutterwave.
          </p>
          <p className="text-gray-700 mb-3">
            VillageSquare does not hold customer deposits or store payment
            credentials.
          </p>
          <p className="text-gray-700">
            All fiat payments are processed directly by Flutterwave as a
            licensed payment service provider.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            6. Security
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>All connections are encrypted using industry-standard HTTPS encryption</li>
            <li>VillageSquare does not store your card or bank details — Flutterwave handles all sensitive payment data in compliance with PCI-DSS standards</li>
            <li>Every payment is verified before coins are credited to prevent errors or duplicate charges</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            7. Refunds and Disputes
          </h2>
          <p className="text-gray-700 mb-3">
            Refund-eligible scenarios include:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Duplicate charges</li>
            <li>Failed delivery of VS Coins</li>
            <li>Unauthorized transactions</li>
          </ul>
          <p className="text-gray-700 mb-3 mt-3">
            The following scenarios are non-refundable:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Spent coins</li>
            <li>Change of mind</li>
            <li>Account violations</li>
          </ul>
          <p className="text-gray-700 mb-3 mt-3">
            Refund requests are reviewed within 7 business days.
          </p>
          <p className="text-gray-700 mb-3">
            Approved refunds are processed back to the original payment method
            within 5 to 14 business days.
          </p>
          <p className="text-gray-700 mb-3">
            Disputes can be escalated for secondary review within 14 business
            days.
          </p>
          <p className="text-gray-700">
            For refund requests, contact us at{" "}
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
            8. Compliance Transparency
          </h2>
          <p className="text-gray-700 mb-3">
            VillageSquare is a technology platform that facilitates digital
            engagement. All payment processing is handled by Flutterwave.
          </p>
          <p className="text-gray-700 mb-3">
            VillageSquare does not custody, hold, or manage customer funds at
            any point in the transaction lifecycle.
          </p>
          <p className="text-gray-700">
            VS Coins are non-transferable digital credits with no cash-out or
            withdrawal functionality.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            9. Business Information
          </h2>
          <p className="text-gray-700 mb-3">
            Company Name: TheVillageSquare LTD
          </p>
          <p className="text-gray-700 mb-3">
            Operating Country: Federal Republic of Nigeria
          </p>
          <p className="text-gray-700">
            Support Contact:{" "}
            <a
              href="mailto:admin@villagesquare.io"
              className="text-primary underline"
            >
              admin@villagesquare.io
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
