import type {
  QualificationResult,
  ServiceAssessmentAnswers,
  ServiceSupplier,
  ServiceSupplierMatch,
} from './types'

export function matchServiceSuppliers(
  suppliers: ServiceSupplier[],
  answers: ServiceAssessmentAnswers,
  result: QualificationResult,
): ServiceSupplierMatch[] {
  return suppliers
    .filter((supplier) => supplier.serviceIds.includes(answers.serviceId))
    .map((supplier) => {
      let score = 0
      const reasons: string[] = []
      const gaps: string[] = []
      const coversRegion = supplier.geographicalCoverage.includes('uk-wide')
        || supplier.geographicalCoverage.includes(answers.region)
        || (supplier.geographicalCoverage.includes('great-britain') && answers.region !== 'northern-ireland')

      if (coversRegion) {
        score += 4
        reasons.push('Published coverage includes your region')
      } else if (supplier.geographicalCoverage.length === 0) {
        gaps.push('The checked page did not establish geographical coverage')
      } else {
        gaps.push('Published coverage did not clearly include your region')
      }

      if (supplier.sectors.includes(answers.sector)) {
        score += 3
        reasons.push(`Provider evidence is relevant to ${answers.sector.replace('-', ' ')} work`)
      } else {
        gaps.push('No sector-specific provider evidence matched your selection')
      }

      const selected = [...answers.workTypes, ...answers.riskSignals]
      const specialismMatches = selected.filter((item) => supplier.specialisms.includes(item))
      if (specialismMatches.length) {
        score += Math.min(specialismMatches.length * 2, 8)
        reasons.push(`Published capability matches ${specialismMatches.length} selected equipment or process signal${specialismMatches.length === 1 ? '' : 's'}`)
      } else {
        gaps.push('No equipment-specific evidence matched the selected items')
      }

      if (supplier.complexity.includes(result.complexity)) {
        score += 3
        reasons.push(`Published service is suitable for a ${result.complexity} brief`)
      } else {
        gaps.push(`Complexity evidence did not cover a ${result.complexity} brief`)
      }

      const capabilityNeed = answers.serviceId === 'lev'
        ? 'LEV thorough examination and test'
        : answers.serviceId === 'pressure-systems'
          ? answers.inspectionStatus === 'none' || answers.inspectionStatus === 'new-system'
            ? 'Written scheme'
            : 'pressure-system examination'
          : 'LOLER'
      if (supplier.capabilities.some((item) => item.toLowerCase().includes(capabilityNeed.toLowerCase()))) {
        score += 2
        reasons.push('The required core examination capability is stated')
      }

      return { supplier, score, reasons, gaps }
    })
    .sort((a, b) => b.score - a.score || a.supplier.name.localeCompare(b.supplier.name))
    .slice(0, 3)
}
