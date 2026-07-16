import React from "react";

interface MapSectionProps {
  hotelName: string;
  address: string;
  mapUrl: string;
}

export default function MapSection({ hotelName, address, mapUrl }: MapSectionProps) {
  // Extract URL if user pasted full iframe HTML
  const getEmbedUrl = (input: string) => {
    if (!input) return "";
    const srcMatch = input.match(/src="([^"]+)"/);
    return srcMatch ? srcMatch[1] : input;
  };

  const finalMapUrl = getEmbedUrl(mapUrl) || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.1895648834947!2d-0.1558231!3d51.509355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487605330e2f8955%3A0xe5eb6c7ebd286d99!2sPark%20Ln%2C%20London!5e0!3m2!1sen!2suk!4v1689000000000!5m2!1sen!2suk";

  return (
    <section className="py-16 bg-gray-50" id="homepage-map">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase text-golden-600 tracking-widest block mb-2 font-semibold">
            Our Location
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Find Us in the Heart of London
          </h3>
          <p className="mt-3 text-sm text-gray-500 font-light">{address}</p>
        </div>

        <div
          className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 w-full"
          style={{ height: "420px" }}
        >
          <iframe
            title={`${hotelName} Location Map`}
            src={finalMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[0.2] contrast-105"
          />
        </div>
      </div>
    </section>
  );
}
