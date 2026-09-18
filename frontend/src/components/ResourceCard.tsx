import React from "react";
import { Phone, ExternalLink, ShieldCheck, MapPin, Globe, FileText, Star } from "lucide-react";
import { ResourceItem, UrgencyTier } from "@/types";

interface ResourceCardProps {
  resource: ResourceItem;
  urgencyTier?: UrgencyTier;
  isTopRecommended?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  urgencyTier = "general",
  isTopRecommended = false,
}) => {
  // Verification check: ONLY 'verified_web', 'verified_authority', or India DB record (always trusted)
  const isIndiaRecord =
    resource.is_india_db === true ||
    resource.country?.toLowerCase() === "india" ||
    (Boolean(resource.phone || resource.priority) && !resource.verification_status);

  const isVerified =
    resource.verification_status === "verified_web" ||
    resource.verification_status === "verified_authority" ||
    isIndiaRecord;

  // Phone extraction: supports India DB `phone` or global `voice_numbers`
  const primaryPhone =
    resource.phone ||
    (resource.voice_numbers && resource.voice_numbers.length > 0
      ? resource.voice_numbers[0]
      : null);

  const websiteUrl = resource.website || resource.url;
  const isEmergency = urgencyTier === "emergency";

  // Border styling based on urgency
  // Emergency gets amber left-border, otherwise teal left-border
  const leftBorderClass = isEmergency
    ? "border-l-4 border-l-amber-500"
    : "border-l-4 border-l-teal-600 dark:border-l-teal-400";

  const languagesText = Array.isArray(resource.languages)
    ? resource.languages.join(", ")
    : resource.languages || null;

  const locationText = [resource.district, resource.state, resource.country]
    .filter(Boolean)
    .join(", ");

  if (isTopRecommended) {
    return (
      <div
        id="top-recommended-resource-card"
        className={`bg-white dark:bg-slate-900 rounded-xl p-5 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 ${leftBorderClass} transition-all`}
      >
        {/* Top Header with Recommended Label & Verified Badge */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-teal-700 dark:text-teal-400 uppercase">
            <Star className="w-4 h-4 fill-teal-600 dark:fill-teal-400 text-teal-600 dark:text-teal-400" />
            <span>Top Recommended Resource</span>
          </div>

          {isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
        </div>

        {/* Resource Main Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 flex items-center justify-center shrink-0 text-teal-700 dark:text-teal-400 font-bold">
              <ShieldCheck className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {resource.name || resource.title}
              </h3>
              {(resource.organization || resource.department) && (
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {resource.department ? `${resource.organization} • ${resource.department}` : resource.organization}
                </p>
              )}
              {(resource.description || resource.service) && (
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 pt-0.5 line-clamp-2 max-w-xl">
                  {resource.description || resource.service}
                </p>
              )}
            </div>
          </div>

          {/* Action Call Now or Visit */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            {primaryPhone && (
              <a
                id="call-now-button"
                href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-sm transition-colors focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <Phone className="w-4 h-4" />
                <span>Call now</span>
              </a>
            )}

            {websiteUrl && (
              <a
                id="visit-website-button"
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs md:text-sm transition-colors"
              >
                <span>Visit website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Large Phone Banner */}
        {primaryPhone && (
          <div className="mt-4 pt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Phone className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span
                className={`font-black tracking-tight ${
                  isEmergency ? "text-2xl md:text-3xl text-amber-600 dark:text-amber-400" : "text-xl md:text-2xl"
                }`}
              >
                {primaryPhone}
              </span>
            </div>

            {resource.availability && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                {resource.availability}
              </span>
            )}
          </div>
        )}

        {/* Metadata Chips */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          {locationText && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{locationText}</span>
            </div>
          )}

          {languagesText && (
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{languagesText}</span>
            </div>
          )}

          {resource.type && (
            <div className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{resource.type}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Secondary Resource Card
  return (
    <div
      id={`resource-card-${resource.id || resource.name}`}
      className="bg-white dark:bg-slate-900 rounded-xl p-4 md:p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
          <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
              {resource.name || resource.title}
            </h4>
            {isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {(resource.organization || resource.department) && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {resource.organization}
            </p>
          )}

          {websiteUrl && (
            <p className="text-xs text-teal-600 dark:text-teal-400 hover:underline pt-0.5">
              Report online at: <span className="underline">{websiteUrl.replace(/^https?:\/\//, "")}</span>
            </p>
          )}

          {resource.description && !websiteUrl && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
              {resource.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-start md:self-center shrink-0">
        {primaryPhone && (
          <a
            href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-semibold text-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call {primaryPhone}</span>
          </a>
        )}

        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors"
          >
            <span>Visit website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
