/**
 * store.js test
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet)
 * and Thorsten Schaeff (@thorwebdev).
 *
 * Representation of products, and line items stored in Stripe.
 * Please note this is overly simplified class for demo purposes (all products
 * are loaded for convenience, there is no cart management functionality, etc.).
 * A production app would need to handle this very differently.
 */

let apiBase;
if (document.getElementById("Retreat")) {
    apiBase = "http://104.236.19.121/spark-of-life/registration.php";
} else {
    apiBase = "http://104.236.19.121/spark-of-life/index.php";
}

class Store {
    constructor() {}

    // Compute the total for the payment based on the line items (SKUs and quantity).
    getPaymentTotal(sessionNumber = 1) {
        return sessionNumber === 1 ? 12500 : 35000;
    }

    // Retrieve the configuration from the API.
    async getConfig() {
        let account = "coaching";
        if (document.getElementById("Retreat")) {
            account = "registration";
        }

        try {
            // const response = await fetch('/config');
            const response = await fetch(`${apiBase}/config?account=${account}`);
            const config = await response.json();
            // if (config.stripePublishableKey.includes('live')) {
            //   // Hide the demo notice if the publishable key is in live mode.
            //   document.querySelector('#order-total .demo').style.display = 'none';
            // }
            return config;
        } catch (err) {
            return { error: err.message };
        }
    }

    // Create the PaymentIntent with the cart details.
    async createPaymentIntent(
        currency,
        sessionNumber = null,
        familyMemberAttending = null,
        retreatType = null
    ) {
        try {
            const response = await fetch(`${apiBase}/payment_intents`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currency,
                    session_number: sessionNumber,
                    family_member_attending: familyMemberAttending,
                    retreat_type: retreatType
                })
            });
            const data = await response.json();
            if (data.error) {
                return { error: data.error };
            } else {
                return data;
            }
        } catch (err) {
            return { error: err.message };
        }
    }

    // Update Payment Intent when the number of session changes
    async updatePaymentIntent(paymentIntent, options = {}) {
        try {
            const {
                email = null,
                sessionNumber = null,
                familyMemberAttending = null,
                retreatType = null
            } = options;
            const apiUrl = `${apiBase}/payment_intents/${paymentIntent}`;
            const apiBody = JSON.stringify({
                email,
                session_number: sessionNumber,
                family_member_attending: familyMemberAttending,
                retreat_type: retreatType
            });
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: apiBody
            });
            const data = await response.json();
            if (data.error) {
                return { error: data.error };
            } else {
                return data;
            }
        } catch (err) {
            return { error: err.message };
        }
    }

    // Save data to Google Sheet
    /*
      async saveData(params = []) {
        if (!params['email']) return;
        try {
          const apiUrl = `${apiBase}/save_data`;
          const apiBody = JSON.stringify(params);
          const response = await fetch(
            apiUrl,
            {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: apiBody,
            }
          );
          const data = await response.json();
          if (data.error) {
            return {error: data.error};
          } else {
            return data;
          }
        } catch (err) {
          return {error: err.message};
        }
      }
    */

    // Send confirmation email
    async sendConfirmationEmail(email = "", name = "", type = "") {
        if (!email) return;
        try {
            const apiUrl = `${apiBase}/send_confirmation_email`;
            const apiBody = JSON.stringify({
                email,
                name,
                type
            });
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: apiBody
            });
            const data = await response.json();
            if (data.error) {
                return { error: data.error };
            } else {
                return data;
            }
        } catch (err) {
            return { error: err.message };
        }
    }

    // Format a price (assuming a two-decimal currency like EUR or USD for simplicity).
    formatPrice(amount, currency) {
        let price = (amount / 100).toFixed(2);
        let numberFormat = new Intl.NumberFormat(["en-US"], {
            style: "currency",
            currency: currency,
            currencyDisplay: "symbol"
        });
        return numberFormat.format(price);
    }
}

window.store = new Store();
