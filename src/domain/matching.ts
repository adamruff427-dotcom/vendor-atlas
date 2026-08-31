import type { AssessmentAnswers, QualificationResult, Supplier, SupplierMatch } from './types'

export function matchSuppliers(suppliers: Supplier[], answers: AssessmentAnswers, result: QualificationResult): SupplierMatch[] {
  return suppliers.map((supplier) => {
    let score = 0
    const reasons: string[] = []
    const gaps: string[] = []
    const coversRegion = supplier.geographicalCoverage.includes('uk-wide')
      || supplier.geographicalCoverage.includes(answers.region)
      || (supplier.geographicalCoverage.includes('great-britain') && answers.region !== 'northern-ireland')
    if (coversRegion) { score += 4; reasons.push('Stated coverage includes your region') }
    else gaps.push('Regional coverage was not evidenced for your location')
    if (supplier.sectors.includes(answers.sector)) { score += 3; reasons.push(`Provider evidence includes ${answers.sector.replace('-', ' ')} work`) }
    const hazardMatches = answers.hazards.filter((hazard) => supplier.hazardExperience.includes(hazard))
    if (hazardMatches.length) { score += Math.min(hazardMatches.length * 2, 6); reasons.push(`Relevant evidence for ${hazardMatches.length} selected hazard type${hazardMatches.length > 1 ? 's' : ''}`) }
    else if (answers.hazards.length) gaps.push('No specific provider-source hazard evidence matched')
    if (supplier.complexity.includes(result.complexity)) { score += 2; reasons.push(`Suitable for a ${result.complexity} project on published evidence`) }
    if (supplier.serviceCategories.includes('hazardous-area-classification') && result.scope.some((item) => item.includes('Hazardous area'))) { score += 2; reasons.push('Hazardous area classification capability is stated') }
    return { supplier, score, reasons, gaps }
  }).sort((a, b) => b.score - a.score || a.supplier.name.localeCompare(b.supplier.name)).slice(0, 3)
}
