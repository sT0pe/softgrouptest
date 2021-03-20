/**
 * payments.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet)
 * and Thorsten Schaeff (@thorwebdev).
 *
 * This modern JavaScript file handles the checkout process using Stripe.
 *
 * 1. It shows how to accept card payments with the `card` Element, and
 * the `paymentRequestButton` Element for Payment Request and Apple Pay.
 * 2. It shows how to use the Stripe Sources API to accept non-card payments,
 * such as iDEAL, SOFORT, SEPA Direct Debit, and more.
 */

(async () => {
    "use strict";

    // Retrieve the configuration for the store.
    const config = await store.getConfig();

    // Create references to the main form and its submit button.
    const form = document.getElementById("payment-form");
    const submitButton = form.querySelector("[type=submit]");

    const isVirtualRetreat = !!document.querySelector(
        "[name='wf-form-Virtual-Retreat-Reg']"
    );
    /*
    const isInPersonRetreat = !!document.querySelector(
        "[name='wf-form-In-Person-Retreat-Reg']"
    );
    */
    const retreatPrice = isVirtualRetreat ? 49500 : 69500;
    const retreatCompanionPrice = isVirtualRetreat ? 69500 : 99500;
    const retreatType = isVirtualRetreat ? "virtual" : "in-person";

    // Success notification
    const successNotification = document.querySelector(".w-form-done");

    // Global variable to store the PaymentIntent object.
    let paymentIntent;

    /**
     * Setup Stripe Elements.
     */

    // Create a Stripe client.
    const stripe = Stripe('pk_test_QBkvDcxEkvTqjoqiFICkuYgn');

    // Create an instance of Elements.
    const elements = stripe.elements();

    // Prepare the styles for Elements.
    const style = {
        base: {
            iconColor: "#666ee8",
            color: "#31325f",
            fontWeight: 400,
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "15px",
            "::placeholder": {
                color: "#aab7c4"
            },
            ":-webkit-autofill": {
                color: "#666ee8"
            }
        }
    };

    /**
     * Implement a Stripe Card Element that matches the look-and-feel of the app.
     *
     * This makes it easy to collect debit and credit card payments information.
     */

    // Create a Card Element and pass some custom styles to it.
    const card = elements.create("card", { style, hidePostalCode: true });
    const cardErrors = document.getElementById("card-errors");

    // Mount the Card Element on the page.
    card.mount("#card-element");

    // Monitor change events on the Card Element to display any errors.
    card.on("change", ({ error, complete }) => {
        if (complete) {
            cardErrors.classList.remove("visible");
            submitButton.disabled = false;
        } else if (error) {
            cardErrors.textContent = error.message;
            cardErrors.classList.add("visible");
            submitButton.disabled = true;
        }
    });

    // Disable submit button
    submitButton.disabled = true;

    /**
     * Implement a Stripe Payment Request Button Element.
     *
     * This automatically supports the Payment Request API (already live on Chrome),
     * as well as Apple Pay on the Web on Safari, Google Pay, and Microsoft Pay.
     * When of these two options is available, this element adds a “Pay” button on top
     * of the page to let users pay in just a click (or a tap on mobile).
     */

    // Create the payment request.
    let totalAmount = 0;
    if (document.getElementById("session_number")) {
        totalAmount = 12500;
    } else if (document.querySelector("[name=family_member_attending]")) {
        totalAmount = retreatPrice;
    } else {
        totalAmount = 29900;
    }
    const paymentRequest = stripe.paymentRequest({
        country: config.stripeCountry,
        currency: config.currency,
        total: {
            label: "Total",
            amount: totalAmount
            // amount: store.getPaymentTotal(),
        },
        requestShipping: true,
        requestPayerEmail: true,
        shippingOptions: config.shippingOptions
    });

    // Callback when a payment method is created.
    paymentRequest.on("paymentmethod", async (event) => {
        // Confirm the PaymentIntent with the payment method returned from the payment request.
        const { error } = await stripe.confirmCardPayment(
            paymentIntent.client_secret,
            {
                payment_method: event.paymentMethod.id,
                shipping: {
                    name: event.shippingAddress.recipient,
                    phone: event.shippingAddress.phone,
                    address: {
                        line1: event.shippingAddress.addressLine[0],
                        city: event.shippingAddress.city,
                        postal_code: event.shippingAddress.postalCode,
                        state: event.shippingAddress.region,
                        country: event.shippingAddress.country
                    }
                }
            },
            { handleActions: false }
        );
        if (error) {
            // Report to the browser that the payment failed.
            event.complete("fail");
            handlePayment({ error });
        } else {
            // Report to the browser that the confirmation was successful, prompting
            // it to close the browser payment method collection interface.
            event.complete("success");
            // Let Stripe.js handle the rest of the payment flow, including 3D Secure if needed.
            const response = await stripe.confirmCardPayment(
                paymentIntent.client_secret
            );
            handlePayment(response);
        }
    });

    // Create the Payment Request Button.
    const paymentRequestButton = elements.create("paymentRequestButton", {
        paymentRequest
    });

    /**
     * Handle the form submission.
     *
     * This uses Stripe.js to confirm the PaymentIntent using payment details collected
     * with Elements.
     *
     * Please note this form is not submitted when the user chooses the "Pay" button
     * or Apple Pay, Google Pay, and Microsoft Pay since they provide name and
     * shipping information directly.
     */

    // Listen to changes to the number of sessions
    const sessionNumberEl = form.querySelector("select[name=session_number]");
    if (sessionNumberEl) {
        sessionNumberEl.addEventListener("change", async (event) => {
            event.preventDefault();
            const sessionNumber = parseInt(event.target.value);

            /* Disable the submit button */
            submitButton.disabled = true;

            /* Update the checkout price */
            const checkoutPriceEl = document.getElementById("checkout-price");
            if (checkoutPriceEl) {
                checkoutPriceEl.textContent = store.formatPrice(
                    sessionNumber === 1 ? 12500 : 35000,
                    config.currency
                );
            }

            /* Update the payment intent */
            await store.updatePaymentIntent(paymentIntent.id, {
                sessionNumber
            });

            /* Enable the submit button */
            submitButton.disabled = false;
        });
    }

    // Listen to changes to family member attending
    const els = form.querySelectorAll('[name="family_member_attending"]');
    if (els && els.length) {
        const updateCheckoutPrice = (familyMemberAttending = "No") => {
            const checkoutPriceEl = document.getElementById("checkout-price");
            if (checkoutPriceEl) {
                checkoutPriceEl.textContent = store.formatPrice(
                    familyMemberAttending === "No"
                        ? retreatPrice
                        : retreatCompanionPrice,
                    config.currency
                );
            }
        };
        updateCheckoutPrice()
        form.querySelector(
            '[name="family_member_attending"][value="No"]'
        ).checked = true;
        els.forEach((el) => {
            el.addEventListener("change", async (event) => {
                const familyMemberAttending = event.target.value;

                /* Disable the submit button */
                submitButton.disabled = true;

                /* Update the checkout price */
                updateCheckoutPrice(familyMemberAttending);

                /* Update the payment intent */
                await store.updatePaymentIntent(paymentIntent.id, {
                    familyMemberAttending,
                    retreatType
                });

                /* Enable the submit button */
                submitButton.disabled = false;
            });
        });
    }

    // Preselect the Lodging-with-family-member value
    const lodgingEls = form.querySelectorAll('[name="lodging_with_family_member"]');
    if (lodgingEls && lodgingEls.length) {
        form.querySelector(
            '[name="lodging_with_family_member"][value="No"]'
        ).checked = true;
    }

    // Unbind submit method from Webflow
    if (Webflow) {
        Webflow.push(function () {
            $(document).off("submit");
        });
    }

    // Submit handler for our payment form.
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // If the card is not filled, return immediately
        const cardEl = document.getElementById("card-element");
        if (cardEl) {
            const cardElClasslist = cardEl.classList;
            if (
                cardElClasslist.contains("StripeElement--empty") ||
                cardElClasslist.contains("StripeElement--invalid")
            ) {
                if (cardElClasslist.contains("StripeElement--empty")) {
                    cardErrors.textContent = "Please enter your card number.";
                } else if (cardElClasslist.contains("StripeElement--invalid")) {
                    cardErrors.textContent = "Your card number is invalid.";
                }
                cardErrors.classList.add("visible");
                return;
            } else {
                cardErrors.classList.remove("visible");
            }
        }

        // Retrieve the user information from the form.
        // const payment = form.querySelector('input[name=payment]:checked').value;
        const payment = "card";
        const name = form.querySelector("input[name=name]").value;
        const country = "US"; // Set it to US by default
        const email = form.querySelector("input[name=email]").value;
        const billingAddress = {
            line1: form.querySelector("input[name=address]").value,
            postal_code: form.querySelector("input[name=postal_code]").value
        };
        const shipping = {
            name,
            address: {
                line1: form.querySelector("input[name=address]").value,
                city: form.querySelector("input[name=city]").value,
                postal_code: form.querySelector("input[name=postal_code]").value,
                state: form.querySelector("[name=state]").value,
                country
            }
        };

        // Disable the Pay button to prevent multiple click events.
        submitButton.value = "Please wait...";
        submitButton.disabled = true;

        // Update the receipt_email
        await store.updatePaymentIntent(paymentIntent.id, {
            email
        });

        // Let Stripe.js handle the confirmation of the PaymentIntent with the card Element.
        const response = await stripe.confirmCardPayment(paymentIntent.client_secret, {
            payment_method: {
                card,
                billing_details: {
                    name,
                    address: billingAddress
                }
            },
            shipping
        });
        handlePayment(response);
    });

    // Handle new PaymentIntent result
    const handlePayment = async (paymentResponse) => {
        const { paymentIntent, error } = paymentResponse;

        if (error && error.type === "validation_error") {
            // Validation error
            submitButton.disabled = false;
            submitButton.textContent = "Submit";
        } else if (error) {
            // Some unexpected error occurred
        } else if (paymentIntent.status === "succeeded") {
            const email = document.querySelector("[name=email]").value;
            const firstName = document.querySelector("[name=firstName]").value;
            const lastName = document.querySelector("[name=lastName]").value;
            const address = document.querySelector("[name=address]").value;
            const city = document.querySelector("[name=city]").value;
            const phone = document.querySelector("[name=phone]").value;
            const state = document.querySelector("[name=state]").value;
            const postalCode = document.querySelector("[name=postal_code]").value;
            const name = `${firstName} ${lastName}`;
            const { pathname } = window.location;
            let type = "";
            switch (pathname) {
                case "/online-course-registration-payment":
                    type = "course";
                    break;
                case "/coaching-registration-payment":
                    type = "coaching";
                    break;
                case "/virtual-retreat-registration-payment":
                    type = "virtual_retreat";
                    break;
                case "/retreat-registration-payment":
                    type = "in_person";
                    break;
                default:
                    break;
            }

            const createCoachAccountableClient = (_params) => {
                const url = new URL("https://www.coachaccountable.com/API/");
                const params = {
                    ..._params,
                    APIID: config.coachaccountable.APIID,
                    APIKey: config.coachaccountable.APIKey,
                    CoachID: config.coachaccountable.CoachID,
                    a: "Client.add",
                    sendInvite: "true"
                };
                url.search = new URLSearchParams(params).toString();

                fetch(url).catch((err) => {
                    console.log(err);
                    alert("Can not create CoachAccountable client");
                });
            };

            if (type === "course") {
                const params = {
                    firstName,
                    lastName,
                    email,
                    cellPhone: phone,
                    ZIP: postalCode,
                    address,
                    city,
                    state
                };
                createCoachAccountableClient(params);
            }

            /*
                await store.saveData({
                    type,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    postal_code: postalCode,,
                    address,
                    city,
                    state,
                });
            */
            await store.sendConfirmationEmail(email, name, type);

            // Success! Payment is confirmed. Update the interface to display the confirmation screen.
            submitButton.disabled = false;
            form.classList.add("hidden");
            successNotification.classList.add("visible");

            // Scroll to top
            window.scrollTo({ top: 0 });
        } else if (paymentIntent.status === "processing") {
            // Success! Now waiting for payment confirmation. Update the interface to display the confirmation screen.
        } else if (paymentIntent.status === "requires_payment_method") {
            // Failure. Requires new PaymentMethod, show last payment error message.
        } else {
            // Payment has failed.
        }
    };

    /**
     * Monitor the status of a source after a redirect flow.
     *
     * This means there is a `source` parameter in the URL, and an active PaymentIntent.
     * When this happens, we'll monitor the status of the PaymentIntent and present real-time
     * information to the user.
     */

    const pollPaymentIntentStatus = async (
        paymentIntent,
        timeout = 30000,
        interval = 500,
        start = null
    ) => {
        start = start ? start : Date.now();
        const endStates = [
            "succeeded",
            "processing",
            "canceled",
            "requires_payment_method"
        ];
        // Retrieve the PaymentIntent status from our server.
        const rawResponse = await fetch(`payment_intents/${paymentIntent}/status`);
        const response = await rawResponse.json();
        if (
            !endStates.includes(response.paymentIntent.status) &&
            Date.now() < start + timeout
        ) {
            // Not done yet. Let's wait and check again.
            setTimeout(
                pollPaymentIntentStatus,
                interval,
                paymentIntent,
                timeout,
                interval,
                start
            );
        } else {
            handlePayment(response);
            if (!endStates.includes(response.paymentIntent.status)) {
                // Status has not changed yet. Let's time out.
                console.warn(new Error("Polling timed out."));
            }
        }
    };

    const url = new URL(window.location.href);
    if (url.searchParams.get("source") && url.searchParams.get("client_secret")) {
        const { source } = await stripe.retrieveSource({
            id: url.searchParams.get("source"),
            client_secret: url.searchParams.get("client_secret")
        });

        // Poll the PaymentIntent status.
        pollPaymentIntentStatus(source.metadata.paymentIntent);
    } else if (url.searchParams.get("payment_intent")) {
        // Poll the PaymentIntent status.
        pollPaymentIntentStatus(url.searchParams.get("payment_intent"));
    } else {
        // Create the PaymentIntent with the cart details.
        let response;
        if (document.getElementById("session_number")) {
            const sessionNumber = parseInt(
                document.getElementById("session_number").value
            );
            response = await store.createPaymentIntent(config.currency, sessionNumber);
        } else if (document.querySelector('[name="family_member_attending"]')) {
            response = await store.createPaymentIntent(
                config.currency,
                null,
                "No",
                retreatType
            );
        } else {
            response = await store.createPaymentIntent(config.currency);
        }
        paymentIntent = response.paymentIntent;
    }
})();
