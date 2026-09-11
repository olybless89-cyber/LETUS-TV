import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/server-data";
import { ContactForm } from "@/components/contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Letus TV",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-page py-8">
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Get in touch</h1>
          <p className="mt-3 text-ink-soft">
            Story tips, partnership ideas, or feedback on our coverage — we read every message.
          </p>
          <dl className="mt-8 space-y-3 text-sm">
            {settings?.contactEmail && (
              <div>
                <dt className="font-display font-semibold text-ink-soft">Email</dt>
                <dd>{settings.contactEmail}</dd>
              </div>
            )}
            {settings?.phone && (
              <div>
                <dt className="font-display font-semibold text-ink-soft">Phone</dt>
                <dd>{settings.phone}</dd>
              </div>
            )}
            {settings?.address && (
              <div>
                <dt className="font-display font-semibold text-ink-soft">Address</dt>
                <dd>{settings.address}</dd>
              </div>
            )}
          </dl>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
