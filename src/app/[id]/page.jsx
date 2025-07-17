import CheckoutPageClient from './CheckoutPageClient';

export async function generateMetadata({ params }) {
    return {
        title: `Checkout`,
    };
}

export default function CheckoutPage({ params }) {
    return <CheckoutPageClient id={params.id} /> 
}
  