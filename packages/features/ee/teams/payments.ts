import stripe from "@calcom/app-store/stripepayment/lib/server";
import { CAL_URL } from "@calcom/lib/constants";

export const purchaseTeamSubscription = async (
  teamId: number,
  billingFrequency: "monthly" | "yearly",
  seats: number,
  email: string
) => {
  return await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${CAL_URL}/settings/teams/${teamId}/profile`,
    cancel_url: `${CAL_URL}/settings/profile`,
    line_items: [
      {
        price:
          billingFrequency === "monthly"
            ? process.env.STRIPE_TEAM_MONTHLY_PRICE_ID
            : process.env.STRIPE_TEAM_YEARLY_PRICE_ID,
        quantity: seats,
      },
    ],
    customer_email: email,
    metadata: {
      teamId,
    },
    payment_method_types: ["card"],
    subscription_data: {
      metadata: {
        teamId,
      },
    },
  });
};
