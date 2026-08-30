import type { Supplier } from '../domain/types'

const checkedOn = '2026-08-30'

export const suppliers: Supplier[] = [
  {
    id: 'dw-consulting-services', name: 'DW Consulting Services', website: 'https://www.dsearuk.com/',
    geographicalCoverage: ['uk-wide'], sectors: ['manufacturing', 'food-drink', 'energy-waste', 'chemicals'],
    serviceCategories: ['dsear-assessment', 'hazardous-area-classification', 'dsear-verification', 'training'],
    capabilities: ['DSEAR risk assessment', 'hazardous area classification', 'DSEAR verification', 'training'],
    hazardExperience: ['combustible-dust', 'solvents-paints', 'lpg-gases', 'batteries'],
    qualificationsAndMemberships: [], insuranceEvidence: 'No public certificate verified; request evidence during pre-qualification.',
    deliveryModes: ['on-site', 'remote-scoping'], pricingEvidence: 'No public price list found; quotation required.',
    evidence: [
      { claim: 'Provider states it supports organisations throughout the UK and Ireland.', sourceUrl: 'https://www.dsearuk.com/aboutus', sourceType: 'provider', checkedOn },
      { claim: 'Provider lists assessment, hazardous area classification, verification and training.', sourceUrl: 'https://www.dsearuk.com/', sourceType: 'provider', checkedOn },
      { claim: 'Provider describes manufacturing, food and drink, energy-from-waste and battery-recycling experience.', sourceUrl: 'https://www.dsearuk.com/', sourceType: 'provider', checkedOn },
    ], lastVerifiedDate: checkedOn, verificationStatus: 'provider-source-checked', complexity: ['standard', 'complex'],
  },
  {
    id: 'dsear-assessments', name: 'DSEAR Assessments', website: 'https://dsearassessments.co.uk/',
    geographicalCoverage: ['wales', 'south-west', 'uk-wide'], sectors: ['manufacturing', 'food-drink', 'woodworking', 'automotive', 'other'],
    serviceCategories: ['dsear-assessment', 'hazardous-area-classification'],
    capabilities: ['DSEAR risk assessment', 'hazardous area classification', 'new-plant review', 'petroleum storage support'],
    hazardExperience: ['flammable-liquids', 'solvents-paints', 'lpg-gases', 'combustible-dust', 'fuels', 'batteries'],
    qualificationsAndMemberships: ['Credentials and professional memberships stated as available on request; details not publicly verified.'],
    insuranceEvidence: 'Provider states insurance certificates are supplied on request; no certificate was publicly verified.',
    deliveryModes: ['on-site', 'remote-scoping'], pricingEvidence: 'Provider states fixed-price quotes follow a short scoping call; no numeric public price found.',
    evidence: [
      { claim: 'Provider states it carries out DSEAR assessments and hazardous area classification across the UK.', sourceUrl: 'https://dsearassessments.co.uk/about', sourceType: 'provider', checkedOn },
      { claim: 'Provider lists fuel, solvent, LPG, spray-booth, dust and battery-charging work types.', sourceUrl: 'https://dsearassessments.co.uk/hazardous-area-classification', sourceType: 'provider', checkedOn },
      { claim: 'Provider describes fixed-price scoping and its main cost drivers.', sourceUrl: 'https://dsearassessments.co.uk/dsear-risk-assessment-cost', sourceType: 'provider', checkedOn },
    ], lastVerifiedDate: checkedOn, verificationStatus: 'provider-source-checked', complexity: ['standard', 'complex'],
  },
  {
    id: 'dsear-ra', name: 'DSEAR RA Ltd', website: 'https://dsearriskassessments.co.uk/',
    geographicalCoverage: ['uk-wide'], sectors: ['manufacturing', 'food-drink', 'woodworking', 'automotive', 'chemicals', 'other'],
    serviceCategories: ['dsear-assessment', 'hazardous-area-classification'],
    capabilities: ['DSEAR risk assessment', 'hazardous area classification', 'prioritised action planning'],
    hazardExperience: ['flammable-liquids', 'solvents-paints', 'lpg-gases', 'combustible-dust', 'fuels'],
    qualificationsAndMemberships: [], insuranceEvidence: 'No public certificate verified; request evidence during pre-qualification.',
    deliveryModes: ['on-site', 'remote-scoping'], pricingEvidence: 'Provider offers fixed-price quotations but publishes no numeric tariff.',
    evidence: [
      { claim: 'Provider states it covers the whole UK.', sourceUrl: 'https://dsearriskassessments.co.uk/', sourceType: 'provider', checkedOn },
      { claim: 'Provider describes site survey, assessment, hazardous area classification and action-plan outputs.', sourceUrl: 'https://dsearriskassessments.co.uk/', sourceType: 'provider', checkedOn },
      { claim: 'A provider case study describes work at Adnams brewery involving gases, liquids, sprays and combustible dust.', sourceUrl: 'https://www.dsearriskassessments.co.uk/case-studies/adnams/', sourceType: 'provider', checkedOn },
    ], lastVerifiedDate: checkedOn, verificationStatus: 'provider-source-checked', complexity: ['standard', 'complex'],
  },
  {
    id: 'otecsa-consulting', name: 'OTECSA Consulting', website: 'https://www.dsearassessment.co.uk/',
    geographicalCoverage: ['scotland', 'north', 'midlands', 'uk-wide'], sectors: ['manufacturing', 'chemicals', 'energy-waste'],
    serviceCategories: ['dsear-assessment', 'hazardous-area-classification', 'training'],
    capabilities: ['DSEAR risk assessment', 'hazardous area classification', 'HAZOP', 'process safety engineering'],
    hazardExperience: ['flammable-liquids', 'solvents-paints', 'lpg-gases', 'combustible-dust', 'fuels', 'pressurised-gases'],
    qualificationsAndMemberships: [], insuranceEvidence: 'No public certificate verified; request evidence during pre-qualification.',
    deliveryModes: ['on-site', 'remote-scoping'], pricingEvidence: 'No public price list found; quotation required.',
    evidence: [
      { claim: 'Provider lists DSEAR risk assessment and hazardous area classification services.', sourceUrl: 'https://www.dsearassessment.co.uk/services/dsear-and-hac', sourceType: 'provider', checkedOn },
      { claim: 'Provider lists process-safety capabilities including HAZOP and mechanical ignition risk assessment.', sourceUrl: 'https://www.dsearassessment.co.uk/services', sourceType: 'provider', checkedOn },
    ], lastVerifiedDate: checkedOn, verificationStatus: 'provider-source-checked', complexity: ['complex'],
  },
]
