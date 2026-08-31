export interface DecisionSource {
  label: string;
  url: string;
  context: string;
}

export interface DecisionPage {
  path: string;
  title: string;
  description: string;
  cardPrompt: string;
  eyebrow: string;
  intro: string;
  decision: {
    heading: string;
    summary: string;
    checks: string[];
    action: string;
  };
  sections: Array<{
    heading: string;
    body: string;
    detail?: string;
    points?: string[];
  }>;
  sources: DecisionSource[];
}

const dsearQuick: DecisionSource = {
  label: "HSE: Quick guide to DSEAR",
  url: "https://www.hse.gov.uk/fireandexplosion/dsear.htm",
  context: "Plain-English summary of who has duties, the substances covered and the controls employers must consider.",
};
const dsearDetail: DecisionSource = {
  label: "HSE: DSEAR in detail",
  url: "https://www.hse.gov.uk/fireandexplosion/dsear-background.htm",
  context: "Use this for HSE's fuller explanation of when DSEAR applies and the hierarchy for preventing or controlling risk.",
};
const regulation5: DecisionSource = {
  label: "DSEAR 2002: Regulation 5 risk assessment",
  url: "https://www.legislation.gov.uk/uksi/2002/2776/regulation/5",
  context: "The legal text listing the matters a suitable and sufficient assessment must consider, including review after significant change.",
};
const acop: DecisionSource = {
  label: "HSE L138: Approved Code of Practice and guidance",
  url: "https://www.hse.gov.uk/pubns/priced/l138.pdf",
  context: "Detailed HSE guidance on applying DSEAR, assessing risk, controlling releases and classifying hazardous areas.",
};
const briefGuide: DecisionSource = {
  label: "HSE INDG370: Controlling fire and explosion risks",
  url: "https://www.hse.gov.uk/pubns/indg370.htm",
  context: "A shorter employer-facing introduction to DSEAR and the practical steps expected after hazards are identified.",
};
const flammableLiquids: DecisionSource = {
  label: "HSE HSG140: Safe use and handling of flammable liquids",
  url: "https://www.hse.gov.uk/pubns/priced/hsg140.pdf",
  context: "More detailed guidance for receiving, storing, transferring and using flammable liquids, including spraying operations.",
};
const explosiveElectricity: DecisionSource = {
  label: "HSE: Electricity in potentially explosive atmospheres",
  url: "https://www.hse.gov.uk/electricity/explosive.htm",
  context: "Explains why electrical equipment, hot surfaces and static can matter where vapours, mists, gases or dusts may form an explosive atmosphere.",
};
const woodworkingFire: DecisionSource = {
  label: "HSE: Fire and explosion in woodworking",
  url: "https://www.hse.gov.uk/woodworking/fire.htm",
  context: "Sector-specific HSE guidance on wood-dust fire and explosion risk, with particular attention to extraction systems.",
};
const combustibleDust: DecisionSource = {
  label: "HSE HSG103: Safe handling of combustible dust",
  url: "https://www.hse.gov.uk/pubns/priced/hsg103.pdf",
  context: "Specialist guidance on assessing and controlling explosion risks from combustible dust across different materials and processes.",
};
const batterySystems: DecisionSource = {
  label: "HSE: Grid-scale battery energy storage systems",
  url: "https://www.hse.gov.uk/electricity/battery-energy-storage-systems.htm",
  context: "Authoritative but deliberately narrow guidance for grid-scale BESS. It confirms relevant duties; it is not a guide for every battery workplace.",
};
const coshh: DecisionSource = {
  label: "HSE: COSHH basics",
  url: "https://www.hse.gov.uk/coshh/basics/overview.htm",
  context: "Use this to understand the separate duty to prevent or control harm to health from workplace substances.",
};
const areaClassificationCourse: DecisionSource = {
  label: "HSE: Hazardous area classification course overview",
  url: "https://training.hse.gov.uk/courses/dsear-hazardous-area-classification-for-gases-and-liquids",
  context: "Useful for understanding the knowledge involved in straightforward area classification and how to act as an informed customer.",
};

export const pages: DecisionPage[] = [
  {
    path: "/dsear",
    title: "DSEAR: a practical starting point",
    description: "Understand the DSEAR duty, likely assessment scope and how to find a competent specialist.",
    cardPrompt: "Understand the duty before deciding whether to commission work.",
    eyebrow: "DSEAR overview",
    intro: "DSEAR concerns safety risks from dangerous substances at work: fire, explosion and similar energetic events. The first practical question is what substances are present and how they are used—not what your industry is called.",
    decision: {
      heading: "Start with substances and work activities",
      summary: "DSEAR is not triggered simply by a company label or by owning a chemical. The practical screen is whether work is carried out, a dangerous substance is present or liable to be present, and it could create a safety risk through fire, explosion or a similar event.",
      checks: [
        "What is bought in, stored, used, produced or released by the work?",
        "Could vapour, gas, mist or dust escape during normal work, cleaning, maintenance or failure?",
        "What could ignite it, and who could be harmed if it ignited or a pressure system failed?",
      ],
      action: "If any answer is yes or genuinely unknown, document the uncertainty and use the finder or obtain competent advice. A screening answer is not the assessment itself.",
    },
    sections: [
      {
        heading: "When to look more closely",
        body: "If a dangerous substance is present or liable to be present, Regulation 5 requires the employer to make a suitable and sufficient assessment of the resulting risk to employees. HSE explains that liquids, gases, vapours and dusts can all be dangerous substances.",
        detail: "The assessment should be proportionate. HSE also says that if there is no safety risk, or the risk is trivial, no further DSEAR action is needed. Reaching that conclusion still requires the substance and the real work activity to have been considered.",
        points: [
          "Identify substances, labels and current safety data",
          "Map work activities, quantities, storage and waste",
          "Consider releases, ventilation and ignition sources",
          "Record significant findings where the law requires it",
        ],
      },
      {
        heading: "What a competent assessment is likely to do",
        body: "A specialist normally moves from an inventory and process description to release scenarios, existing controls, people at risk and reasonably practicable improvements. Hazardous area classification is part of some assessments, not an automatic deliverable for every site.",
        detail: "The useful output is not merely a compliance certificate. It should show the evidence considered, significant findings, assumptions, controls already working, actions required and any areas where further design, testing or specialist input is needed.",
      },
      {
        heading: "What this finder does—and does not do",
        body: "Vendor Atlas turns a short set of procurement questions into an initial relevance indication, explainable scope, deterministic planning price and evidence-backed supplier shortlist.",
        detail: "It cannot inspect the workplace, verify substance properties, model ventilation, classify a hazardous area or decide whether controls are suitable. Those limitations are why the result explains its triggers and keeps links to the underlying rules.",
      },
    ],
    sources: [dsearQuick, dsearDetail, regulation5, acop],
  },
  {
    path: "/dsear/do-i-need-a-dsear-assessment",
    title: "Do I need a DSEAR assessment?",
    description: "A decision aid for checking when dangerous substances may trigger the need for a DSEAR risk assessment.",
    cardPrompt: "Test whether your substances and work create a credible DSEAR trigger.",
    eyebrow: "Decision guide",
    intro: "You are likely to need to assess DSEAR risks when a dangerous substance is or could be present at a workplace. The exact answer depends on the substance, quantity, process, potential release and possible consequences.",
    decision: {
      heading: "Use a three-part threshold",
      summary: "Ask whether work is being carried out, whether a dangerous substance is present or could be present, and whether it could put people at risk through fire, explosion, another energetic event, a gas under pressure or corrosion to metal.",
      checks: [
        "Check what is created by the process as well as what arrives in a labelled container.",
        "Include cleaning, maintenance, charging, waste, breakdown and foreseeable abnormal conditions.",
        "Do not use quantity alone as the answer: release conditions, confinement and ignition sources also matter.",
      ],
      action: "A clear yes to the three-part threshold means the risk should be assessed. If substance properties or release conditions are uncertain, treat that as a scoping question rather than a reason to answer no.",
    },
    sections: [
      {
        heading: "Strong indicators",
        body: "Common indicators include flammable liquids or gases, solvent use, fuels, potentially explosive dust clouds, gases under pressure and substances capable of energetic thermal events.",
        detail: "A product classification or safety data sheet helps identify intrinsic hazards, but the assessment must also consider the way the material is stored and used. A sealed small container and an open heated transfer are not equivalent situations.",
        points: [
          "Spraying or coating with solvent-borne products",
          "Decanting or transferring fuel or flammable liquid",
          "Producing or extracting fine wood, food, plastic or metal dust",
          "Using LPG or another flammable or pressurised gas",
          "Introducing or materially changing plant involving these hazards",
        ],
      },
      {
        heading: "What Regulation 5 asks you to consider",
        body: "The legal list includes hazardous properties, supplier safety information, work processes, amounts, combinations of substances, storage and transport, maintenance, existing controls, explosive atmospheres, ignition sources and the anticipated effects of fire or explosion.",
        detail: "It also requires review when there is reason to suspect the assessment is no longer valid or a significant change affects the workplace, process or organisation of work. An old report is therefore evidence to review, not proof that the current operation is covered.",
      },
      {
        heading: "When a simple screen is not enough",
        body: "Escalate early where there are multiple release points, combustible dust, uncertain material data, new plant design, occupied areas close to the process or a possibility that hazardous area classification is needed.",
        detail: "A competent person should be able to state what information is missing and whether a proportionate desktop review, site survey, testing or more specialist engineering work is required.",
      },
    ],
    sources: [regulation5, dsearDetail, briefGuide],
  },
  {
    path: "/dsear/cost",
    title: "What might a DSEAR assessment cost?",
    description: "See the practical factors that shape DSEAR assessment quotations and get an explainable planning estimate.",
    cardPrompt: "Understand the cost drivers and compare quotations on the same scope.",
    eyebrow: "Cost guide",
    intro: "There is no official tariff. A useful estimate has to reflect the number of sites, processes, hazard types, available drawings, survey access and whether hazardous area classification is likely.",
    decision: {
      heading: "Price the scope, not the report title",
      summary: "Two quotations both called a ‘DSEAR assessment’ can contain materially different work. The main buying decision is whether each provider has allowed for the same site access, process review, technical analysis and deliverables.",
      checks: [
        "Is a site survey included, and how many locations or process areas are covered?",
        "Are zoning, drawings, equipment review, travel and report revisions included or excluded?",
        "Does the price assume that substance data, layouts and prior records are complete and current?",
      ],
      action: "Give every bidder the same brief and ask for assumptions, exclusions and optional work in writing. Compare the scope line by line before comparing the total.",
    },
    sections: [
      {
        heading: "How the Vendor Atlas estimate works",
        body: "The calculator starts with a visible site-size allowance, then adds fixed amounts for additional sites, multiple hazard types, specialist processes, combustible dust and design-stage review. The result is a planning range—not a market tariff or supplier quote.",
        detail: "The model is deliberately deterministic so a buyer can see why the range changed. It does not infer a price from prose, use an LLM or quietly favour a listed supplier. The configuration can later be recalibrated against real comparable quotes.",
      },
      {
        heading: "What usually increases effort",
        body: "Complexity tends to rise with multiple processes, poor records, several release sources, dust explosibility questions, hazardous area classification, equipment suitability checks and new-installation design input.",
        detail: "Travel and site access can matter, but technical uncertainty is often more important. A well-prepared substance inventory, layout and process description can reduce avoidable scoping time without reducing the assessment work that is genuinely needed.",
      },
      {
        heading: "Compare like with like",
        body: "Ask each provider to state exactly what the price includes and what would trigger additional fees.",
        points: [
          "Site visit, travel and number of survey days",
          "Substance inventory and process review",
          "Hazardous area classification and drawings where required",
          "Equipment suitability or ignition-source review",
          "Prioritised actions, draft review and final report",
          "VAT, testing and follow-on design or remedial work",
        ],
      },
    ],
    sources: [regulation5, acop, briefGuide],
  },
  {
    path: "/dsear/who-can-carry-out-a-dsear-assessment",
    title: "Who can carry out a DSEAR assessment?",
    description: "How to select a competent person or consultancy for DSEAR assessment and hazardous area work.",
    cardPrompt: "Choose competence that matches your actual hazards and project complexity.",
    eyebrow: "Supplier selection",
    intro: "The employer retains the duty, but can appoint competent help. Competence should fit the actual hazards and work: a simple flammable-store review is not the same as complex dust zoning or a new process plant.",
    decision: {
      heading: "Match competence to the difficult part",
      summary: "A general health and safety background may be suitable for some straightforward work, while hazardous area classification, combustible dust or process design can require deeper engineering knowledge. The provider should explain who will do the work and why they are competent for it.",
      checks: [
        "Can the named assessor evidence relevant work with the same hazard and process type?",
        "Can they explain the standards, data and judgments they expect to use?",
        "Will specialist work be completed in-house, subcontracted or excluded?",
      ],
      action: "Treat memberships, training and project examples as evidence to examine, not a single universal approval badge. Verify insurance and assessor details for your appointment.",
    },
    sections: [
      {
        heading: "Evidence to request",
        body: "Vendor Atlas records what can be evidenced publicly, but the buyer still needs project-specific pre-qualification. Ask for claims that relate to the work you are actually commissioning rather than a long generic capability list.",
        points: [
          "Relevant project examples and hazard experience",
          "Named assessor competence and professional evidence",
          "Professional indemnity and public liability insurance",
          "Scope, exclusions and applicable standards",
          "Sample deliverable or report structure",
          "Position on remedial design or other possible conflicts",
        ],
      },
      {
        heading: "What a comparable quotation needs",
        body: "Give every supplier the same process, site, hazard, location, timescale and existing-document information. Ask each to identify assumptions, exclusions, survey time, technical deliverables and who will approve the report.",
        detail: "If one provider includes hazardous area drawings and another only identifies that zoning may be needed, those are not equivalent quotations even when the headline service name is the same.",
      },
      {
        heading: "What Vendor Atlas verification means",
        body: "‘Evidence found’ means a claim was located on a provider or other cited public source on the stated checking date. It is not an audit, recommendation, accreditation or guarantee of current availability.",
        detail: "Before appointment, verify the evidence directly, check the proposed individual and agree contractual scope. Vendor Atlas does not use paid ranking in the shortlist.",
      },
    ],
    sources: [acop, areaClassificationCourse, dsearQuick],
  },
  {
    path: "/dsear/for-manufacturing",
    title: "DSEAR for manufacturing",
    description: "A focused DSEAR decision guide for manufacturing operations involving flammables, gases, dusts or fuels.",
    cardPrompt: "Trace DSEAR risk through a production process, not just the chemical store.",
    eyebrow: "Sector guide",
    intro: "Manufacturing can bring several DSEAR-relevant hazards together: solvent use, coating, fuel systems, gases, powders, dust extraction and ignition-capable equipment.",
    decision: {
      heading: "Follow the material through the process",
      summary: "A store that looks well controlled does not answer what happens during transfer, mixing, heating, spraying, machining, extraction, cleaning or waste handling. Map where the material can be released and where an ignition source could be effective.",
      checks: [
        "Where does the substance enter, change state, become airborne or leave as waste?",
        "What happens during start-up, shutdown, maintenance, blockage or ventilation failure?",
        "Are new equipment, layout or throughput changes already covered by the current assessment?",
      ],
      action: "If the process has multiple hazards or is being designed or changed, involve competent DSEAR input before equipment and layout decisions become expensive to alter.",
    },
    sections: [
      {
        heading: "Map the process, not just the stores",
        body: "Assessment should follow substances through receipt, storage, transfer, use, by-products, waste and maintenance. Normal operation and foreseeable abnormal events both matter.",
        detail: "Talk to operators and maintenance staff as well as reading the written procedure. The real release point may be a sampling step, filter change, cleaning method or temporary container that is not obvious on a high-level process diagram.",
      },
      {
        heading: "Separate control questions",
        body: "The assessment should distinguish preventing or containing a release, avoiding an explosive atmosphere, controlling ignition, and mitigating the consequences if prevention fails.",
        detail: "Ventilation, equipment selection, bonding and earthing, segregation, housekeeping and emergency arrangements solve different parts of the problem. A list of controls is useful only when it is connected to the assessed scenario.",
      },
      {
        heading: "Information to prepare",
        body: "A specialist will work faster with current layouts, safety data sheets, inventories, extraction information, equipment records and a clear description of process changes.",
        points: [
          "Process flow and layout drawings",
          "Substance quantities and current safety data sheets",
          "Extraction, ventilation and maintenance information",
          "Existing zoning, equipment and inspection records",
          "Incidents, near misses and planned changes",
        ],
      },
    ],
    sources: [regulation5, dsearDetail, explosiveElectricity],
  },
  {
    path: "/dsear/for-breweries",
    title: "DSEAR for breweries and distilleries",
    description: "Check DSEAR considerations around ethanol, LPG, gases, grain dust and cleaning chemicals in drink production.",
    cardPrompt: "Separate alcohol, gas and grain-dust scenarios before seeking a quote.",
    eyebrow: "Sector guide",
    intro: "Breweries and distilleries can involve alcohol vapour, LPG or natural gas, carbon dioxide under pressure and combustible grain or malt dust. Not every area is hazardous; conditions and quantities matter.",
    decision: {
      heading: "Treat each hazard as a separate scenario",
      summary: "Alcohol transfer, a gas installation and a grain-handling system have different release behaviour and ignition questions. A useful assessment should identify where each scenario starts and ends, then consider how connected areas or shared equipment affect the risk.",
      checks: [
        "Where are spirits, high-strength alcohol or flammable cleaning products stored and transferred?",
        "Can grain or malt dust accumulate or form a cloud in mills, conveyors, extraction or collection equipment?",
        "Which gases are flammable, oxidising, asphyxiating or under pressure, and where are they used?",
      ],
      action: "Seek multi-hazard competence if more than one scenario is present. Do not assume one zoning method or one generic action list covers liquids, gases and dusts equally.",
    },
    sections: [
      {
        heading: "Typical review areas",
        body: "A review may cover spirit or alcohol handling, grain transfer, mills and dust collection, gas systems, charging points, cleaning products, ventilation and ignition controls.",
        detail: "Quantities, alcohol strength, temperature, transfer method, confinement and frequency all affect the relevance of a scenario. The process description should distinguish routine brewing from distilling, packaging, laboratory work and maintenance.",
      },
      {
        heading: "Prepare a useful site picture",
        body: "List the substances and gas systems, mark transfer and release points on a layout, and gather extraction, electrical and cleaning information before requesting quotations.",
        detail: "If records are incomplete, say so in the brief. A provider can then price discovery work explicitly instead of relying on an assumption that may later change the fee or deliverable.",
      },
      {
        heading: "Keep health and safety duties distinct",
        body: "DSEAR addresses harmful physical effects such as fire, explosion and pressure events. COSHH addresses health risks from exposure. A substance or process can require consideration under both regimes.",
        detail: "For example, a dust may present both inhalation and explosion risks. The controls may overlap, but the questions and evidence needed are not interchangeable.",
      },
    ],
    sources: [dsearDetail, combustibleDust, coshh],
  },
  {
    path: "/dsear/for-woodworking",
    title: "DSEAR for woodworking",
    description: "A practical guide to DSEAR questions for wood dust, extraction systems, finishing products and workshops.",
    cardPrompt: "Check extraction, dust collection and solvent finishing as connected risks.",
    eyebrow: "Sector guide",
    intro: "Fine wood dust can form an explosive atmosphere when dispersed in air. Finishing processes may also involve flammable solvents, paints or lacquers.",
    decision: {
      heading: "Look inside the extraction system",
      summary: "The visible workshop is only part of the picture. Ducts, filters, fans, cyclones and waste collection can contain different dust concentrations and ignition sources from the open work area.",
      checks: [
        "Where is fine dust generated, conveyed, separated and collected?",
        "Can sparks, hot particles, static or unsuitable equipment reach an explosive dust cloud or layer?",
        "Are solvent finishing, spraying or cleaning processes assessed separately from the dust system?",
      ],
      action: "If dust is routinely extracted or collected, include the complete extraction system in the brief. Do not base the decision only on whether a dense cloud is normally visible in the workshop.",
    },
    sections: [
      {
        heading: "Generation and collection change the risk",
        body: "Saws, sanders, ductwork, filters, cyclones, waste collection and housekeeping all affect the scenario. Dust inside extraction equipment can differ substantially from settled dust on open workshop surfaces.",
        detail: "HSE specifically notes that wood dust can cause fire and explosion and highlights extraction systems as a common location for fires. The assessment should connect equipment design and maintenance to credible ignition and propagation routes.",
      },
      {
        heading: "Finishing can create a second hazard set",
        body: "Solvent-borne stains, paints, lacquers and cleaning products may introduce vapour or mist risks around storage, mixing, application, drying and waste.",
        detail: "These liquid and vapour scenarios should not be hidden inside a generic ‘wood dust’ assessment. Tell potential suppliers whether finishing occurs and provide the product information and method of use.",
      },
      {
        heading: "Evidence a specialist may need",
        body: "Prepare dust and material information, extraction drawings, cleaning arrangements, maintenance records, equipment details and any previous zoning or explosion-protection work.",
        points: [
          "Machine and extraction-system layout",
          "Dust collection, emptying and housekeeping arrangements",
          "Maintenance and fire or blockage history",
          "Finishing-product safety data and application method",
          "Any previous dust testing or hazardous-area work",
        ],
      },
    ],
    sources: [woodworkingFire, combustibleDust, explosiveElectricity],
  },
  {
    path: "/dsear/for-spray-booths",
    title: "DSEAR for spray booths",
    description: "Decision support for spray-painting, coating, mixing and solvent-cleaning operations.",
    cardPrompt: "Assess the whole coating process, including mixing, cleaning and waste.",
    eyebrow: "Process guide",
    intro: "Spraying can create a flammable mist or vapour, while mixing, cleaning and waste handling can introduce separate release sources.",
    decision: {
      heading: "The booth boundary is not the assessment boundary",
      summary: "A compliant-looking booth does not answer how products are stored and mixed, how guns are cleaned, where contaminated waste goes or what happens when ventilation is unavailable.",
      checks: [
        "What do the product safety data say about flashpoint and physical hazards?",
        "How are mixing, spraying, flash-off, drying, gun cleaning and waste handled?",
        "What interlocks, airflow checks and rules prevent spraying when extraction is ineffective?",
      ],
      action: "Include the booth, adjacent process steps and foreseeable ventilation failure in the same project brief. Ask whether zoning and equipment-suitability outputs are included.",
    },
    sections: [
      {
        heading: "Map every release point",
        body: "Consider the paint or coating store, mixing point, application, flash-off or drying, gun cleaning, contaminated waste and maintenance. Each can create a different release duration and extent.",
        detail: "The assessment should use the actual products and operating conditions. Water-based branding alone is not a complete answer if flammable cleaners, additives or other coatings remain in use.",
      },
      {
        heading: "Ventilation and ignition controls must connect",
        body: "Ventilation may prevent or limit a flammable atmosphere, while suitable equipment and static control address ignition. The assessment should explain the assumptions that make each control effective.",
        detail: "Maintenance, filter condition, airflow indication and interlocks matter because the risk can change when the booth is degraded or used outside its design conditions.",
      },
      {
        heading: "Useful quotation inputs",
        body: "Share product safety data, booth and extraction specifications, layout, throughput, cleaning method, operating hours and existing electrical or zoning information.",
        points: [
          "Products, quantities and method of application",
          "Booth, extraction and interlock specifications",
          "Mixing, cleaning, drying and waste arrangements",
          "Existing zoning drawings and equipment records",
          "Planned changes to products, throughput or layout",
        ],
      },
    ],
    sources: [flammableLiquids, explosiveElectricity, regulation5],
  },
  {
    path: "/dsear/combustible-dust",
    title: "Combustible dust and DSEAR",
    description: "Understand why fine wood, food, metal and other dusts can require specialist DSEAR review.",
    cardPrompt: "Decide when dust properties and process conditions need specialist review.",
    eyebrow: "Hazard guide",
    intro: "HSE states that any dust capable of exploding when spread in air as a cloud can be a dangerous substance. Material, particle size, process and containment all affect the assessment.",
    decision: {
      heading: "Do not decide from the material name alone",
      summary: "Explosibility depends on the dust presented by the real process, not merely the bulk material or product label. Particle size, moisture, composition, concentration, containment and dispersion all affect the scenario.",
      checks: [
        "Is suitable explosibility data available for the dust actually produced or handled?",
        "Where can a cloud or hazardous layer occur during operation, cleaning, emptying or failure?",
        "Can an event propagate through connected ducts or equipment, and what protection is present?",
      ],
      action: "If material data are absent or the process contains, extracts or transports fine dust, ask a specialist whether representative testing and hazardous area classification are needed.",
    },
    sections: [
      {
        heading: "Why dust work can be specialist",
        body: "Assessment may need material test data, release-source identification, dust-cloud and layer consideration, extraction review, zoning, ignition-source assessment and explosion protection.",
        detail: "Gas-and-vapour assumptions should not be copied mechanically to dust. The relevant evidence may include dust-specific test parameters, equipment geometry, deposits and the potential for a primary event to disturb more material.",
      },
      {
        heading: "Look beyond normal operation",
        body: "Filter changes, bag emptying, spills, blockages, leaks, cleaning and maintenance can create conditions that are absent during steady production.",
        detail: "A useful site survey should examine housekeeping and hidden accumulation as well as the intended process. It should also identify connected equipment through which flame or pressure could travel.",
      },
      {
        heading: "What the finder can conclude",
        body: "Vendor Atlas treats a selected dust hazard or specialist dust process as a relevance and complexity signal. It does not determine whether a material is explosible, assign a zone or specify explosion protection.",
        detail: "That boundary is intentional: those conclusions require reliable material evidence and site-specific engineering judgment.",
      },
    ],
    sources: [combustibleDust, dsearDetail, acop],
  },
  {
    path: "/dsear/lithium-batteries",
    title: "Lithium batteries and DSEAR",
    description: "A cautious decision guide for battery charging, storage, processing and thermal-event risk.",
    cardPrompt: "Describe the battery operation precisely before deciding what expertise is needed.",
    eyebrow: "Hazard guide",
    intro: "Battery work is not automatically one uniform DSEAR scenario. Chemistry, scale, charging, damage, processing, gas release and thermal-event potential should be examined by someone competent for the operation.",
    decision: {
      heading: "Define the battery activity before applying a label",
      summary: "Routine charging, grid-scale storage, damaged-battery handling and recycling are materially different operations. The relevant substances, failure modes, energy and people at risk need to be identified before deciding the assessment scope.",
      checks: [
        "What chemistry, format, quantity and state of charge are involved?",
        "Are batteries intact, charging, stored, tested, damaged, repacked, dismantled or shredded?",
        "What credible fault, gas-release, thermal-runaway, fire, pressure and electrical scenarios have been considered?",
      ],
      action: "Use Vendor Atlas as an escalation signal, not a declaration that all battery work falls into the same DSEAR category. Seek competence that covers the actual battery system and fire, electrical and process risks.",
    },
    sections: [
      {
        heading: "Describe the operation precisely",
        body: "Distinguish routine charging from bulk storage, energy storage systems, testing, repacking, damaged-battery handling and recycling or shredding. The substances and failure modes are different.",
        detail: "A supplier cannot scope useful work from ‘lithium batteries on site’ alone. Provide the equipment purpose, chemistry where known, quantities, physical condition, charging arrangements and separation from people or other hazards.",
      },
      {
        heading: "DSEAR may be only one part of the review",
        body: "Depending on the operation, electrical safety, general fire precautions, emergency response, environmental controls, planning or other duties may also be relevant.",
        detail: "The HSE page cited here is specifically for grid-scale battery energy storage systems. It is useful evidence that several legal regimes can apply, but it should not be stretched into detailed guidance for smaller charging or recycling operations.",
      },
      {
        heading: "What the finder can conclude",
        body: "The wizard flags battery work for professional scoping and increases the complexity of battery-processing projects. It does not declare a hazardous zone, equipment category or final legal conclusion.",
        detail: "This conservative treatment prevents a short questionnaire from collapsing several technically different battery scenarios into one unsupported answer.",
      },
    ],
    sources: [batterySystems, dsearDetail, regulation5],
  },
  {
    path: "/dsear/dsear-vs-coshh",
    title: "DSEAR vs COSHH",
    description: "Understand the practical difference between DSEAR safety risks and COSHH health risks.",
    cardPrompt: "Check whether your substance assessment covers both physical and health risks.",
    eyebrow: "Comparison guide",
    intro: "DSEAR and COSHH ask different questions. DSEAR focuses on harmful physical effects from fire, explosion and similar events. COSHH focuses on health risks from exposure to hazardous substances.",
    decision: {
      heading: "Ask two different harm questions",
      summary: "For DSEAR, ask how the substance could cause a fire, explosion, pressure event or other harmful physical effect. For COSHH, ask how exposure through breathing, skin, eyes or ingestion could damage health.",
      checks: [
        "Does the substance or process create both physical-hazard and health-hazard information?",
        "Are release, ignition and emergency controls covered as well as exposure controls?",
        "Do the records clearly show which risk assessment answers which duty?",
      ],
      action: "If a document discusses only PPE, exposure limits and health effects, do not assume it answers DSEAR. If it discusses only fire and explosion, do not assume it answers COSHH.",
    },
    sections: [
      {
        heading: "The same substance can appear in both assessments",
        body: "A solvent may create inhalation or skin-exposure risk under COSHH and fire or explosion risk under DSEAR. Fine dust may similarly present both respiratory and combustible-dust hazards.",
        detail: "The substance inventory and safety data can support both assessments, but the routes to harm, people at risk and control reasoning differ. Completing one assessment does not automatically complete the other.",
      },
      {
        heading: "Controls can overlap without being interchangeable",
        body: "Substitution, containment, local exhaust ventilation, housekeeping and maintenance may help both health and safety outcomes. Their design basis and evidence of effectiveness still need to match the particular risk.",
        detail: "For example, extraction selected to control worker exposure is not automatically demonstrated to control an explosive atmosphere, and explosion-risk controls do not by themselves establish adequate exposure control.",
      },
      {
        heading: "A useful document check",
        body: "Look for distinct consideration of substance health hazards, physical hazards, exposure routes, releases, ignition sources, fire and explosion controls, and emergency arrangements.",
        points: [
          "Health effects and routes of exposure",
          "Physical hazards and credible release scenarios",
          "Exposure-control measures and their performance",
          "Ignition prevention and consequence mitigation",
          "Separate findings, actions and review triggers",
        ],
      },
    ],
    sources: [dsearDetail, coshh, regulation5],
  },
];
