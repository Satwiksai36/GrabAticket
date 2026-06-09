import React from 'react';
import Layout from '@/components/layout/Layout';
import { useLocation } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Support: React.FC = () => {
    const location = useLocation();
    const path = location.pathname;

    let title = "Support";
    let content = null;

    if (path === '/help') {
        title = "Help Center";
        content = (
            <div className="space-y-6">
                <p className="text-lg text-muted-foreground">Welcome to the GrabAticket Help Center. How can we assist you today?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-lg bg-card">
                        <h3 className="font-semibold text-xl mb-2">Booking Issues</h3>
                        <p className="text-muted-foreground"> trouble booking tickets? Contact our support team for immediate assistance.</p>
                    </div>
                    <div className="p-6 border rounded-lg bg-card">
                        <h3 className="font-semibold text-xl mb-2">Refunds & Cancellations</h3>
                        <p className="text-muted-foreground">Learn about our refund policy and how to cancel your tickets.</p>
                    </div>
                    <div className="p-6 border rounded-lg bg-card">
                        <h3 className="font-semibold text-xl mb-2">Account Management</h3>
                        <p className="text-muted-foreground">Manage your profile, password, and preferences settings.</p>
                    </div>
                    <div className="p-6 border rounded-lg bg-card">
                        <h3 className="font-semibold text-xl mb-2">Payment Methods</h3>
                        <p className="text-muted-foreground">We accept various payment methods including credit cards, UPI, and wallets.</p>
                    </div>
                </div>
            </div>
        );
    } else if (path === '/faq') {
        title = "Frequently Asked Questions";
        content = (
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>How do I book a ticket?</AccordionTrigger>
                    <AccordionContent>
                        You can book tickets by selecting a movie, event, or sport, choosing your preferred venue and time, selecting seats, and proceeding to payment.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Can I cancel my booking?</AccordionTrigger>
                    <AccordionContent>
                        Yes, cancellations are allowed up to 2 hours before the showtime. A cancellation fee may apply depending on the venue policy.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Where can I see my booking history?</AccordionTrigger>
                    <AccordionContent>
                        You can view your booking history in the "My Bookings" section under your profile menu.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>Do you offer group discounts?</AccordionTrigger>
                    <AccordionContent>
                        Yes, for bulk bookings (more than 20 tickets), please contact our support team directly for special rates.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        );
    } else if (path === '/terms') {
        title = "Terms of Service";
        content = (
            <div className="prose dark:prose-invert max-w-none">
                <p>Last updated: January 2026</p>
                <h3>1. Acceptance of Terms</h3>
                <p>By accessing and using GrabAticket, you agree to be bound by these Terms of Service.</p>
                <h3>2. Use of Service</h3>
                <p>You agree to use the service for lawful purposes only and in a way that does not infringe the rights of others.</p>
                <h3>3. Ticket Purchases</h3>
                <p>All ticket purchases are subject to availability and acceptance by the venue.</p>
                <h3>4. Modifications</h3>
                <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of new terms.</p>
            </div>
        );
    } else if (path === '/privacy') {
        title = "Privacy Policy";
        content = (
            <div className="prose dark:prose-invert max-w-none">
                <p>Last updated: January 2026</p>
                <h3>1. Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you create an account, maximize a booking, or contact support.</p>
                <h3>2. How We Use Information</h3>
                <p>We use your information to provide, maintain, and improve our services, and to communicate with you.</p>
                <h3>3. Data Security</h3>
                <p>We implement appropriate security measures to protect your personal information.</p>
                <h3>4. Third-Party Services</h3>
                <p>We may share information with third-party vendors who perform services on our behalf.</p>
            </div>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6">{title}</h1>
                <div className="bg-card border rounded-lg p-6 shadow-sm">
                    {content}
                </div>
            </div>
        </Layout>
    );
};

export default Support;
