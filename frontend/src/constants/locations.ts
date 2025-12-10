// frontend/src/constants/locations.ts

export type RegionId = "LATAM" | "North America" | "Europe";

export interface CountryOption {
  code: string;
  name: string;
  region: RegionId;
}

export const REGION_OPTIONS: { id: RegionId; label: string }[] = [
  { id: "LATAM", label: "LATAM" },
  { id: "North America", label: "North America" },
  { id: "Europe", label: "Europe" },
];

export const COUNTRY_OPTIONS: CountryOption[] = [
  // LATAM
  { code: "AR", name: "Argentina", region: "LATAM" },
  { code: "BO", name: "Bolivia", region: "LATAM" },
  { code: "BR", name: "Brazil", region: "LATAM" },
  { code: "CL", name: "Chile", region: "LATAM" },
  { code: "CO", name: "Colombia", region: "LATAM" },
  { code: "CR", name: "Costa Rica", region: "LATAM" },
  { code: "CU", name: "Cuba", region: "LATAM" },
  { code: "DO", name: "Dominican Republic", region: "LATAM" },
  { code: "EC", name: "Ecuador", region: "LATAM" },
  { code: "SV", name: "El Salvador", region: "LATAM" },
  { code: "GT", name: "Guatemala", region: "LATAM" },
  { code: "HN", name: "Honduras", region: "LATAM" },
  { code: "MX", name: "Mexico", region: "LATAM" },
  { code: "NI", name: "Nicaragua", region: "LATAM" },
  { code: "PA", name: "Panama", region: "LATAM" },
  { code: "PY", name: "Paraguay", region: "LATAM" },
  { code: "PE", name: "Peru", region: "LATAM" },
  { code: "PR", name: "Puerto Rico", region: "LATAM" },
  { code: "UY", name: "Uruguay", region: "LATAM" },
  { code: "VE", name: "Venezuela", region: "LATAM" },

  // North America (keeping Mexico under LATAM for our segmentation)
  { code: "CA", name: "Canada", region: "North America" },
  { code: "US", name: "United States", region: "North America" },

  // Europe
  { code: "AL", name: "Albania", region: "Europe" },
  { code: "AD", name: "Andorra", region: "Europe" },
  { code: "AM", name: "Armenia", region: "Europe" },
  { code: "AT", name: "Austria", region: "Europe" },
  { code: "BY", name: "Belarus", region: "Europe" },
  { code: "BE", name: "Belgium", region: "Europe" },
  { code: "BA", name: "Bosnia and Herzegovina", region: "Europe" },
  { code: "BG", name: "Bulgaria", region: "Europe" },
  { code: "HR", name: "Croatia", region: "Europe" },
  { code: "CY", name: "Cyprus", region: "Europe" },
  { code: "CZ", name: "Czech Republic", region: "Europe" },
  { code: "DK", name: "Denmark", region: "Europe" },
  { code: "EE", name: "Estonia", region: "Europe" },
  { code: "FI", name: "Finland", region: "Europe" },
  { code: "FR", name: "France", region: "Europe" },
  { code: "GE", name: "Georgia", region: "Europe" },
  { code: "DE", name: "Germany", region: "Europe" },
  { code: "GR", name: "Greece", region: "Europe" },
  { code: "HU", name: "Hungary", region: "Europe" },
  { code: "IS", name: "Iceland", region: "Europe" },
  { code: "IE", name: "Ireland", region: "Europe" },
  { code: "IT", name: "Italy", region: "Europe" },
  { code: "XK", name: "Kosovo", region: "Europe" },
  { code: "LV", name: "Latvia", region: "Europe" },
  { code: "LI", name: "Liechtenstein", region: "Europe" },
  { code: "LT", name: "Lithuania", region: "Europe" },
  { code: "LU", name: "Luxembourg", region: "Europe" },
  { code: "MT", name: "Malta", region: "Europe" },
  { code: "MD", name: "Moldova", region: "Europe" },
  { code: "MC", name: "Monaco", region: "Europe" },
  { code: "ME", name: "Montenegro", region: "Europe" },
  { code: "NL", name: "Netherlands", region: "Europe" },
  { code: "MK", name: "North Macedonia", region: "Europe" },
  { code: "NO", name: "Norway", region: "Europe" },
  { code: "PL", name: "Poland", region: "Europe" },
  { code: "PT", name: "Portugal", region: "Europe" },
  { code: "RO", name: "Romania", region: "Europe" },
  { code: "RU", name: "Russia", region: "Europe" },
  { code: "SM", name: "San Marino", region: "Europe" },
  { code: "RS", name: "Serbia", region: "Europe" },
  { code: "SK", name: "Slovakia", region: "Europe" },
  { code: "SI", name: "Slovenia", region: "Europe" },
  { code: "ES", name: "Spain", region: "Europe" },
  { code: "SE", name: "Sweden", region: "Europe" },
  { code: "CH", name: "Switzerland", region: "Europe" },
  { code: "TR", name: "Turkey", region: "Europe" },
  { code: "UA", name: "Ukraine", region: "Europe" },
  { code: "GB", name: "United Kingdom", region: "Europe" },
  { code: "VA", name: "Vatican City", region: "Europe" },
];
