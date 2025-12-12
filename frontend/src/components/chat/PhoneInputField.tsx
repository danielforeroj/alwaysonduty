"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  COUNTRY_DIAL_CODES,
  CountryDialCode,
  DEFAULT_COUNTRY,
} from "./countryCodes";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
};

function findCountryFromValue(value: string): {
  country: CountryDialCode;
  national: string;
} {
  const normalized = value.replace(/\s+/g, "").replace(/^\+/, "");
  const match = COUNTRY_DIAL_CODES.find((country) =>
    normalized.startsWith(country.dialCode.replace("+", ""))
  );
  if (!match) {
    return { country: DEFAULT_COUNTRY, national: value };
  }
  const withoutPrefix = normalized.replace(
    match.dialCode.replace("+", ""),
    ""
  );
  return { country: match, national: withoutPrefix };
}

export default function PhoneInputField({
  value,
  onChange,
  placeholder = "Phone number",
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const [{ country, national }, setParsed] = useState(() =>
    findCountryFromValue(value)
  );
  const [userInteracted, setUserInteracted] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
    if (!value) return;
    setParsed(findCountryFromValue(value));
  }, [value]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const iso = data?.country_code?.toLowerCase();
        const found = COUNTRY_DIAL_CODES.find((c) => c.iso2 === iso);
        if (found && !userInteracted && !valueRef.current?.trim()) {
          updateValue(found, "", false);
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [onChange, userInteracted]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return COUNTRY_DIAL_CODES;
    return COUNTRY_DIAL_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.dialCode.replace("+", "").includes(term.replace("+", ""))
    );
  }, [search]);

  const updateValue = (
    nextCountry: CountryDialCode,
    nextNational: string,
    userInitiated = true
  ) => {
    if (userInitiated) {
      setUserInteracted(true);
    }
    const formattedNational = nextNational.replace(/[^0-9\s]/g, "");
    setParsed({ country: nextCountry, national: formattedNational });
    const joined = `${nextCountry.dialCode} ${formattedNational}`.trim();
    onChange(joined);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-xs text-slate-600">Phone number</label>
      <div className={`mt-1 flex rounded-lg border px-3 py-2 shadow-sm ${
        error ? "border-red-400" : "border-slate-200"
      } focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100`}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="mr-2 flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm hover:border-slate-300"
        >
          <span className="text-lg" aria-hidden>
            {country.flag}
          </span>
          <span className="text-slate-900">{country.dialCode}</span>
        </button>
        <input
          value={national}
          onChange={(e) => updateValue(country, e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          inputMode="tel"
        />
      </div>
      {open && (
        <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="p-2">
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4 text-slate-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m0 0a7.5 7.5 0 1 0-10.607-10.6 7.5 7.5 0 0 0 10.607 10.6Z"
                />
              </svg>
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for country"
                className="ml-2 w-full bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((item) => (
              <button
                key={item.iso2}
                onClick={() => {
                  updateValue(item, "");
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-blue-50 ${
                  item.iso2 === country.iso2 ? "bg-blue-50" : ""
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {item.flag}
                </span>
                <span className="flex-1 text-slate-900">{item.name}</span>
                <span className="font-medium text-slate-900">{item.dialCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
