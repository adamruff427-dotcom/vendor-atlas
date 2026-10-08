import type {
  QualificationResult,
  ServiceAssessmentAnswers,
  ServiceSupplier,
  ServiceSupplierMatch,
} from './types'
import { isActionableFirstAidBrief, selectedFirstAidCourse } from './first-aid-training'

export function matchServiceSuppliers(
  suppliers: ServiceSupplier[],
  answers: ServiceAssessmentAnswers,
  result: QualificationResult,
): ServiceSupplierMatch[] {
  if (answers.serviceId === 'workplace-first-aid-training') {
    const course = selectedFirstAidCourse(answers)
    const simpleSingleClass = result.complexity === 'standard'
      && answers.sites === 1
      && answers.assetCount > 0
      && answers.assetCount <= 12
      && answers.secondaryCount === 0
    if (!course || !simpleSingleClass || !isActionableFirstAidBrief(answers, result)) return []

    return suppliers
      .filter((supplier) => supplier.serviceIds.includes(answers.serviceId))
      .filter((supplier) => supplier.specialisms.includes(course))
      .filter((supplier) => supplier.geographicalCoverage.includes('uk-wide')
        || supplier.geographicalCoverage.includes(answers.region)
        || (supplier.geographicalCoverage.includes('great-britain') && answers.region !== 'northern-ireland'))
      .filter((supplier) => supplier.id !== 'st-john-cymru-first-aid' || answers.assetCount >= 6)
      .map((supplier) => ({
        supplier,
        score: 12,
        reasons: [
          'Provider-source evidence covers the selected course',
          'Published coverage includes your region',
          'Provider describes on-site workplace training for a single class',
        ],
        gaps: ['Confirm current course or awarding evidence, trainer competence, insurance, learner limit, dates and total price directly'],
      }))
      .sort((a, b) => a.supplier.name.localeCompare(b.supplier.name))
      .slice(0, 3)
  }

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
      if (answers.serviceId === 'kitchen-extract-cleaning' && answers.sites > 1 && supplier.specialisms.includes('multi-site')) {
        score += 2
        reasons.push('Provider describes multi-site kitchen-extract delivery')
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
          : answers.serviceId === 'loler'
            ? 'LOLER'
            : answers.serviceId === 'asbestos'
              ? 'asbestos survey'
              : answers.serviceId === 'fire-risk-assessment'
                ? 'fire risk assessment'
                : answers.serviceId === 'legionella'
                  ? 'legionella risk assessment'
                  : answers.serviceId === 'pat-testing'
                    ? 'portable appliance testing'
                    : answers.serviceId === 'tm44'
                      ? 'TM44 inspection'
                      : answers.serviceId === 'fire-alarm-servicing'
                        ? 'fire alarm servicing'
                      : answers.serviceId === 'fire-extinguisher-servicing'
                        ? 'fire extinguisher servicing'
                      : answers.serviceId === 'fire-door-inspection'
                        ? 'fire door inspection'
                      : answers.serviceId === 'emergency-lighting'
                        ? 'emergency lighting testing'
                      : answers.serviceId === 'workplace-noise'
                        ? 'workplace noise risk assessment'
                      : answers.serviceId === 'hand-arm-vibration'
                        ? 'hand-arm vibration assessment'
                        : answers.serviceId === 'kitchen-extract-cleaning'
                          ? 'kitchen extract cleaning'
                          : 'fixed wire testing'
      if (supplier.capabilities.some((item) => item.toLowerCase().includes(capabilityNeed.toLowerCase()))) {
        score += 2
        reasons.push('The required core service capability is stated')
      }

      return { supplier, score, reasons, gaps }
    })
    .sort((a, b) => b.score - a.score || a.supplier.name.localeCompare(b.supplier.name))
    .slice(0, 3)
}
