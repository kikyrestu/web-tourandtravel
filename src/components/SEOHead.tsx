import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

export default function SEOHead({
  title = "Nusantara Tour",
  description = "Tour and Travel terpercaya untuk menjelajahi keindahan Indonesia",
  keywords = "tour, travel, indonesia, bromo, ijen, wisata",
  ogImage = "",
  ogTitle,
  ogDescription,
  canonicalUrl,
}: SEOHeadProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const fullTitle = title === "Nusantara Tour" ? title : `${title} | Nusantara Tour`;
  const defaultOgImage = ogImage || `${baseUrl}/logo.svg`;
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Nusantara Tour",
    "description": description,
    "url": baseUrl,
    "logo": `${baseUrl}/logo.svg`,
    "image": defaultOgImage,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Wisata No. 123",
      "addressLocality": "Surabaya",
      "addressRegion": "Jawa Timur",
      "postalCode": "60291",
      "addressCountry": "ID"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-812-3456-7890",
      "contactType": "customer service",
      "email": "info@nusantaratour.com"
    },
    "sameAs": [
      "https://facebook.com/nusantaratour",
      "https://instagram.com/nusantaratour",
      "https://twitter.com/nusantaratour"
    ],
    "openingHours": "Mo-Su 09:00-21:00",
    "priceRange": "IDR"
  };

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Nusantara Tour" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={defaultOgImage} />
      <meta property="og:url" content={canonicalUrl || baseUrl} />
      <meta property="og:site_name" content="Nusantara Tour" />
      <meta property="og:locale" content="id_ID" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={defaultOgImage} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={canonicalUrl || baseUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </>
  );
}