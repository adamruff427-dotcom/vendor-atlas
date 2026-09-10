export type ServiceId = 'dsear' | 'lev' | 'pressure-systems' | 'loler' | 'asbestos'
export type ServiceCategory =
  | 'dsear-assessment'
  | 'hazardous-area-classification'
  | 'dsear-verification'
  | 'training'
  | 'lev-thorough-examination'
  | 'lev-commissioning'
  | 'pssr-written-scheme'
  | 'pssr-examination'
  | 'loler-thorough-examination'
  | 'examination-scheme'
  | 'asbestos-management-survey'
  | 'asbestos-refurbishment-demolition-survey'
  | 'asbestos-reinspection'
export type Hazard = 'flammable-liquids' | 'solvents-paints' | 'lpg-gases' | 'combustible-dust' | 'fuels' | 'batteries' | 'pressurised-gases'
export type Sector = 'manufacturing' | 'food-drink' | 'woodworking' | 'automotive' | 'chemicals' | 'energy-waste' | 'laboratory' | 'other'
export type Region = 'scotland' | 'north' | 'midlands' | 'wales' | 'south-west' | 'south-east' | 'london' | 'northern-ireland' | 'great-britain' | 'uk-wide'

export interface EvidenceClaim {
  claim: string
  sourceUrl: string
  sourceType: 'provider' | 'primary-regulator' | 'legislation' | 'other'
  checkedOn: string
}

export interface Supplier {
  id: string
  name: string
  website: string
  geographicalCoverage: Region[]
  sectors: Sector[]
  serviceCategories: ServiceCategory[]
  capabilities: string[]
  hazardExperience: Hazard[]
  qualificationsAndMemberships: string[]
  insuranceEvidence: string
  deliveryModes: Array<'on-site' | 'remote-scoping'>
  pricingEvidence: string
  evidence: EvidenceClaim[]
  lastVerifiedDate: string
  verificationStatus: 'provider-source-checked' | 'partially-verified'
  complexity: Array<'standard' | 'complex'>
}

export interface AssessmentAnswers {
  sector: Sector
  processes: string[]
  hazards: Hazard[]
  sites: number
  size: 'micro' | 'small' | 'medium' | 'large'
  existingAssessment: 'none' | 'current' | 'old-or-unknown'
  projectReason: 'new-installation' | 'change' | 'review' | 'first-assessment'
  region: Region
  postcode: string
  timescale: 'urgent' | 'one-month' | 'three-months' | 'planning'
}

export interface QualificationResult {
  status: 'likely-relevant' | 'may-be-relevant' | 'no-obvious-trigger'
  score: number
  triggeredFactors: string[]
  caveats: string[]
  scope: string[]
  complexity: 'standard' | 'complex'
}

export interface PriceEstimate {
  low: number
  high: number
  currency: 'GBP'
  factors: Array<{ label: string; amount: number }>
  assumptions: string[]
}

export interface SupplierMatch {
  supplier: Supplier
  score: number
  reasons: string[]
  gaps: string[]
}

export interface ServiceAssessmentAnswers {
  serviceId: Exclude<ServiceId, 'dsear'>
  sector: Sector
  workTypes: string[]
  riskSignals: string[]
  assetCount: number
  secondaryCount: number
  sites: number
  size: 'micro' | 'small' | 'medium' | 'large'
  documentationStatus: 'none' | 'partial' | 'available' | 'unknown'
  inspectionStatus: 'none' | 'in-date' | 'overdue-or-unknown' | 'new-system'
  projectReason: 'new-installation' | 'change' | 'routine' | 'first-examination'
  region: Region
  postcode: string
  timescale: 'urgent' | 'one-month' | 'three-months' | 'planning'
}

export interface ServiceSupplier {
  id: string
  name: string
  website: string
  serviceIds: Array<Exclude<ServiceId, 'dsear'>>
  geographicalCoverage: Region[]
  sectors: Sector[]
  serviceCategories: ServiceCategory[]
  capabilities: string[]
  specialisms: string[]
  qualificationsAndMemberships: string[]
  insuranceEvidence: string
  deliveryModes: Array<'on-site' | 'remote-scoping'>
  pricingEvidence: string
  evidence: EvidenceClaim[]
  lastVerifiedDate: string
  verificationStatus: 'provider-source-checked' | 'partially-verified'
  complexity: Array<'standard' | 'complex'>
}

export interface ServiceSupplierMatch {
  supplier: ServiceSupplier
  score: number
  reasons: string[]
  gaps: string[]
}

export interface Enquiry {
  id: string
  createdAt: string
  serviceId: 'dsear'
  answers: AssessmentAnswers
  qualification: QualificationResult
  estimate: PriceEstimate
  matchedSupplierIds: string[]
  companyName: string
  contactName: string
  businessEmail: string
  phone?: string
  consent: true
  status: 'received'
}

export interface ServiceEnquiry {
  id: string
  createdAt: string
  serviceId: Exclude<ServiceId, 'dsear'>
  answers: ServiceAssessmentAnswers
  qualification: QualificationResult
  estimate: PriceEstimate
  matchedSupplierIds: string[]
  companyName: string
  contactName: string
  businessEmail: string
  phone?: string
  consent: true
  status: 'received'
}
