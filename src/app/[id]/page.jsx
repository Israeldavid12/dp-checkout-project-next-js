import CheckoutPageClient from './CheckoutPageClient';

export async function generateMetadata({ params }) {
   
    const { id } = await params; 

    return {
        title: `Checkout - ${id}`,
    };
}

export default async function CheckoutPage({ params }) {
    
    const { id } = await params;
    
  
    return <CheckoutPageClient id={id} />; 
}