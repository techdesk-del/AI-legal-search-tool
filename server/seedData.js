// seedData.js - Comprehensive pre-seeded Legal Corpus for Urbangaon AI Legal Search Tool

const defaultDocuments = [
  {
    id: "doc-act-001",
    title: "Industrial Disputes Act, 1947",
    docType: "Act",
    jurisdiction: "India (Central)",
    court: "Parliament of India",
    year: 1947,
    status: "Active",
    confidentiality: "Public",
    category: "Labour & Employment Law",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/1519",
    summary: "An Act to make provision for the investigation and settlement of industrial disputes, laying down provisions for retrenchment, notice periods, layoffs, and strikes.",
    isSuperseded: false,
    supersededBy: null,
    chunks: [
      {
        id: "chunk-act-001-1",
        section: "Section 25F",
        heading: "Conditions precedent to retrenchment of workmen",
        content: "No workman employed in any industry who has been in continuous service for not less than one year under an employer shall be retrenched by that employer until: (a) the workman has been given one month's notice in writing indicating the reasons for retrenchment and the period of notice has expired, or the workman has been paid in lieu of such notice, wages for the period of the notice; (b) the workman has been paid, at the time of retrenchment, compensation which shall be equivalent to fifteen days' average pay for every completed year of continuous service or any part thereof in excess of six months; and (c) notice in the prescribed manner is served on the appropriate Government or such authority as may be specified by the appropriate Government by notification in the Official Gazette.",
        tags: ["retrenchment", "notice period", "termination", "workman", "compensation", "severance", "one month notice"]
      },
      {
        id: "chunk-act-001-2",
        section: "Section 25FFA",
        heading: "Sixty days' notice to be given of intention to close down any undertaking",
        content: "An employer who intends to close down an undertaking shall serve, at least sixty days before the date on which the intended closure is to become effective, a notice, in the prescribed manner, on the appropriate Government stating clearly the reasons for the intended closure of the undertaking: Provided that an undertaking in which less than fifty workmen are employed or were employed on any day in the preceding twelve months is exempt from this section.",
        tags: ["closure", "undertaking", "60 days notice", "government notification", "factory shutdown"]
      },
      {
        id: "chunk-act-001-3",
        section: "Section 2A",
        heading: "Dismissal, etc., of an individual workman to be deemed to be an industrial dispute",
        content: "Where any employer discharges, dismisses, retrenches, or otherwise terminates the services of an individual workman, any dispute or difference between that workman and his employer connected with, or arising out of, such discharge, dismissal, retrenchment or termination shall be deemed to be an industrial dispute notwithstanding that no other workman nor any union of workmen is a party to the dispute. The workman may make an application directly to the Labour Court or Tribunal for adjudication of the dispute after the expiry of forty-five days from the date of making the application to the Conciliation Officer.",
        tags: ["individual dispute", "dismissal", "termination", "direct application", "labour court", "45 days conciliation"]
      }
    ]
  },
  {
    id: "doc-act-002",
    title: "Information Technology Act, 2000",
    docType: "Act",
    jurisdiction: "India (Central)",
    court: "Parliament of India",
    year: 2000,
    status: "Active (Partially Struck Down)",
    confidentiality: "Public",
    category: "Cyber & Tech Law",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/1999",
    summary: "Law providing legal recognition for transactions carried out by means of electronic data interchange and other means of electronic communication, commonly referred to as electronic commerce.",
    isSuperseded: true,
    supersededBy: "Section 66A declared unconstitutional by Supreme Court in Shreya Singhal v. UOI (2015)",
    chunks: [
      {
        id: "chunk-act-002-1",
        section: "Section 66A [Struck Down / Unconstitutional]",
        heading: "Punishment for sending offensive messages through communication service, etc.",
        content: "NOTE: Section 66A was completely struck down and declared unconstitutional by the Supreme Court of India in Shreya Singhal v. Union of India (2015) for violating Article 19(1)(a) of the Constitution of India. It previously criminalized sending information that is grossly offensive or has menacing character via computer resources. Law enforcement authorities cannot register FIRs under this provision.",
        tags: ["section 66A", "offensive messages", "struck down", "unconstitutional", "free speech", "social media posts"]
      },
      {
        id: "chunk-act-002-2",
        section: "Section 43A",
        heading: "Compensation for failure to protect sensitive personal data or information",
        content: "Where a body corporate, possessing, dealing or handling any sensitive personal data or information in a computer resource which it owns, controls or operates, is negligent in implementing and maintaining reasonable security practices and procedures and thereby causes wrongful loss or wrongful gain to any person, such body corporate shall be liable to pay damages by way of compensation to the person so affected.",
        tags: ["data protection", "sensitive personal data", "body corporate liability", "data breach", "compensation", "security practices"]
      },
      {
        id: "chunk-act-002-3",
        section: "Section 65B (Indian Evidence Act / BSA corresponding)",
        heading: "Admissibility of electronic records and mandatory certificate",
        content: "Any information contained in an electronic record which is printed on a paper, stored, recorded or copied in optical or magnetic media produced by a computer shall be deemed to be also a document if the conditions mentioned in this section are satisfied. A certificate identifying the electronic record and describing the manner in which it was produced, signed by a person occupying a responsible official position in relation to the operation of the relevant device, is a condition precedent to the admissibility of electronic evidence as held in Arjun Panditrao Khotkar (2020).",
        tags: ["electronic evidence", "section 65B certificate", "admissibility", "digital records", "whatsapp chats in court"]
      }
    ]
  },
  {
    id: "doc-act-003",
    title: "Sexual Harassment of Women at Workplace (POSH) Act, 2013",
    docType: "Act",
    jurisdiction: "India (Central)",
    court: "Parliament of India",
    year: 2013,
    status: "Active",
    confidentiality: "Public",
    category: "Labour & Compliance",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/2104",
    summary: "Comprehensive legislation to provide protection against sexual harassment of women at workplace and for the prevention and redressal of complaints of sexual harassment.",
    isSuperseded: false,
    supersededBy: null,
    chunks: [
      {
        id: "chunk-act-003-1",
        section: "Section 4",
        heading: "Constitution of Internal Complaints Committee (ICC)",
        content: "Every employer of a workplace shall, by an order in writing, constitute a Committee to be known as the 'Internal Complaints Committee' (ICC) at each administrative unit or office employing 10 or more employees. The ICC shall consist of: (a) Presiding Officer who shall be a woman employed at a senior level; (b) not less than two Members from amongst employees preferably committed to the cause of women or who have had experience in social work or have legal knowledge; (c) one member from amongst non-governmental organisations or associations committed to the cause of women. At least one-half of the total Members so nominated shall be women.",
        tags: ["internal complaints committee", "ICC constitution", "10 employees threshold", "posh committee", "presiding officer", "external member"]
      },
      {
        id: "chunk-act-003-2",
        section: "Section 9",
        heading: "Complaint of sexual harassment and limitation period",
        content: "Any aggrieved woman may make, in writing, a complaint of sexual harassment at workplace to the Internal Committee if so constituted, or the Local Committee, in case it is not so constituted, within a period of three months from the date of incident and in case of a series of incidents, within a period of three months from the date of last incident. Provided that the Internal Committee or the Local Committee may, for the reasons to be recorded in writing, extend the time limit not exceeding three months, if it is satisfied that the circumstances were such which prevented the woman from filing a complaint within the said period.",
        tags: ["posh complaint deadline", "3 months limitation", "extension of time", "aggrieved woman", "filing complaint"]
      },
      {
        id: "chunk-act-003-3",
        section: "Section 11 & Section 14",
        heading: "Inquiry into complaint and consequences of malicious complaint",
        content: "The Internal Committee shall proceed to make inquiry into the complaint in accordance with the provisions of the service rules applicable to the respondent, and where no such rules exist, in such manner as may be prescribed. The inquiry shall be completed within a period of ninety (90) days. Under Section 14, where the Internal Committee arrives at a conclusion that the allegation against the respondent is malicious or the aggrieved woman or any other person making the complaint has made the complaint knowing it to be false, it may recommend disciplinary action in accordance with service rules.",
        tags: ["90 days inquiry", "posh inquiry timeline", "malicious complaint", "false allegation penalty", "principles of natural justice"]
      }
    ]
  },
  {
    id: "doc-act-004",
    title: "Companies Act, 2013",
    docType: "Act",
    jurisdiction: "India (Central)",
    court: "Parliament of India",
    year: 2013,
    status: "Active",
    confidentiality: "Public",
    category: "Corporate Law",
    sourceUrl: "https://www.mca.gov.in/content/mca/global/en/acts-rules/companies-act-2013.html",
    summary: "Law governing the incorporation, responsibilities of a company, directors, board meetings, CSR, mergers and dissolution of companies in India.",
    isSuperseded: false,
    supersededBy: null,
    chunks: [
      {
        id: "chunk-act-004-1",
        section: "Section 135",
        heading: "Corporate Social Responsibility (CSR) Mandate",
        content: "Every company having net worth of rupees five hundred crore or more, or turnover of rupees one thousand crore or more, or a net profit of rupees five crore or more during the immediately preceding financial year shall constitute a Corporate Social Responsibility Committee of the Board consisting of three or more directors, out of which at least one director shall be an independent director. The Board of every company referred above shall ensure that the company spends, in every financial year, at least two per cent (2%) of the average net profits of the company made during the three immediately preceding financial years in pursuance of its Corporate Social Responsibility Policy.",
        tags: ["csr expenditure", "2 percent net profit", "5 crore net profit threshold", "csr committee", "schedule vii activities"]
      },
      {
        id: "chunk-act-004-2",
        section: "Section 149",
        heading: "Company to have Board of Directors and Independent Director requirement",
        content: "Every company shall have a Board of Directors consisting of individuals as directors. Minimum number of directors: 3 for public company, 2 for private company, 1 for One Person Company (OPC). Maximum 15 directors (can be increased by special resolution). Every listed public company shall have at least one-third of the total number of directors as independent directors. At least one woman director is mandatory for every listed company and every other public company having paid-up share capital of Rs. 100 crore or more, or turnover of Rs. 300 crore or more.",
        tags: ["board of directors", "independent directors", "woman director mandate", "minimum directors", "public company board"]
      }
    ]
  },
  {
    id: "doc-act-005",
    title: "Indian Contract Act, 1872",
    docType: "Act",
    jurisdiction: "India (Central)",
    court: "Parliament of India",
    year: 1872,
    status: "Active",
    confidentiality: "Public",
    category: "Commercial & Contract Law",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/2187",
    summary: "Fundamental statute governing contracts, offer and acceptance, void agreements, covenants in restraint of trade, and remedies for breach of contract.",
    isSuperseded: false,
    supersededBy: null,
    chunks: [
      {
        id: "chunk-act-005-1",
        section: "Section 27",
        heading: "Agreement in restraint of trade, void",
        content: "Every agreement by which anyone is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void. Exception 1: One who sells the goodwill of a business may agree with the buyer to refrain from carrying on a similar business, within specified local limits, so long as the buyer carries on a like business therein, provided that such limits appear to the Court reasonable. In Indian employment law, post-termination non-compete clauses restricting an employee from joining a competitor are strictly void under Section 27, as reaffirmed in Percept D'Mark v. Zaheer Khan.",
        tags: ["non compete clause", "restraint of trade", "section 27 contract act", "employee post termination restriction", "void agreement"]
      },
      {
        id: "chunk-act-005-2",
        section: "Section 73 & Section 74",
        heading: "Compensation for loss or damage caused by breach of contract and liquidated damages",
        content: "When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach, or which the parties knew, when they made the contract, to be likely to result from the breach of it. Such compensation is not to be given for any remote and indirect loss or damage. Under Section 74, if a sum is named in the contract as the amount to be paid in case of breach (liquidated damages), the party complaining of the breach is entitled to receive reasonable compensation not exceeding the amount so named.",
        tags: ["damages for breach", "liquidated damages", "direct vs indirect loss", "section 73", "section 74", "remedies for breach"]
      }
    ]
  },
  {
    id: "doc-case-001",
    title: "Shreya Singhal v. Union of India",
    docType: "Judgement",
    jurisdiction: "Supreme Court of India",
    court: "Supreme Court of India",
    year: 2015,
    status: "Landmark Precedent",
    confidentiality: "Public",
    category: "Constitutional & Tech Law",
    citationRef: "(2015) 5 SCC 1",
    summary: "Landmark Supreme Court judgement striking down Section 66A of the Information Technology Act, 2000 in its entirety as being vague, overbroad and violative of the right to freedom of speech and expression under Article 19(1)(a).",
    isSuperseded: false,
    supersededBy: null,
    chunks: [
      {
        id: "chunk-case-001-1",
        section: "Paragraph 82-84",
        heading: "Unconstitutionality of Section 66A IT Act on grounds of vagueness and chilling effect",
        content: "The Supreme Court held that Section 66A of the IT Act is unconstitutional and void in its entirety as it infringes upon the fundamental right of speech and expression under Article 19(1)(a) and is not saved under Article 19(2). The Court observed: 'Section 66A is cast so widely that virtually any opinion on any subject would be covered by it, as any serious opinion will likely be offensive to someone. The line between advocacy and incitement was completely erased. The chilling effect on free speech is severe.'",
        tags: ["shreya singhal", "section 66A unconstitutional", "article 19(1)(a)", "chilling effect", "freedom of speech online"]
      },
      {
        id: "chunk-case-001-2",
        section: "Paragraph 118",
        heading: "Intermediary Liability and Reading Down of Section 79(3)(b)",
        content: "The Court read down Section 79(3)(b) and Rule 3(4) of the Intermediary Guidelines Rules 2011 to mean that an intermediary (such as social media platforms, hosting services) must take down content only upon receiving actual knowledge by way of a court order or a notification by the appropriate Government or its agency, and not merely upon private user complaints.",
        tags: ["intermediary liability", "safe harbour", "section 79 it act", "take down order", "court order mandate"]
      }
    ]
  },
  {
    id: "doc-case-002",
    title: "Justice K.S. Puttaswamy (Retd.) v. Union of India",
    docType: "Judgement",
    jurisdiction: "Supreme Court of India",
    court: "Supreme Court of India (9-Judge Constitution Bench)",
    year: 2017,
    status: "Landmark Precedent",
    confidentiality: "Public",
    category: "Constitutional & Privacy Law",
    citationRef: "(2017) 10 SCC 1",
    summary: "Unanimous 9-Judge Constitution Bench verdict holding that the Right to Privacy is a protected fundamental right under Article 21 and Part III of the Constitution of India.",
    isSuperseded: false,
    supersededBy: null,
    chunks: [
      {
        id: "chunk-case-002-1",
        section: "Paragraph 310-315 (Chandrachud J.)",
        heading: "Right to Privacy as an Intrinsic Fundamental Right under Article 21",
        content: "The Supreme Court unanimously ruled that privacy is an intrinsic part of the right to life and personal liberty guaranteed under Article 21 and that privacy encompasses informational privacy, bodily privacy, and spatial privacy. Any state encroachment on privacy must satisfy the threefold test: (1) Legality (existence of a valid law); (2) Need / Legitimate State Aim; and (3) Proportionality (rational nexus between means adopted and objective sought).",
        tags: ["puttaswamy", "right to privacy", "article 21", "fundamental right", "proportionality test", "data privacy principles"]
      }
    ]
  },
  {
    id: "doc-case-003",
    title: "Percept D'Mark (India) Pvt. Ltd. v. Zaheer Khan & Anr.",
    docType: "Judgement",
    jurisdiction: "Supreme Court of India",
    court: "Supreme Court of India",
    year: 2006,
    status: "Precedent",
    confidentiality: "Public",
    category: "Commercial & Contract Law",
    citationRef: "(2006) 4 SCC 227",
    summary: "Supreme Court ruling clarifying that negative covenants post-contractual expiration or post-employment termination are completely void under Section 27 of the Indian Contract Act.",
    isSuperseded: false,
    supersededBy: null,
    chunks: [
      {
        id: "chunk-case-003-1",
        section: "Paragraph 56-62",
        heading: "Invalidity of post-contractual non-compete restrictions",
        content: "Under Section 27 of the Indian Contract Act, a restrictive covenant extending beyond the term of the contract is void and not enforceable. While reasonable negative covenants operating during the subsistence of the contract of employment (e.g. employee not taking up second job while employed) are valid, any post-termination non-compete covenant prohibiting the individual from working or providing services to others after employment ends is wholly void.",
        tags: ["percept d'mark", "zaheer khan case", "post termination non compete", "section 27 contract act", "employee freedom to work"]
      }
    ]
  },
  {
    id: "doc-contract-001",
    title: "Master Services Agreement (MSA) - Enterprise Client Standard Template",
    docType: "Contract",
    jurisdiction: "Urbangaon Corporate Legal",
    court: "Arbitration & Conciliation Act 1996 (New Delhi Seat)",
    year: 2024,
    status: "Active Version 2.4",
    confidentiality: "Internal",
    category: "Corporate Contracts & Commercial",
    summary: "Standard master client services agreement governing software development, AI platform delivery, intellectual property assignments, termination clauses, and liability caps.",
    isSuperseded: false,
    supersededBy: null,
    chunks: [
      {
        id: "chunk-contract-001-1",
        section: "Clause 8.2",
        heading: "Termination for Convenience and Notice Period",
        content: "Either Party may terminate this Agreement or any Statement of Work (SOW) without cause (for convenience) by providing at least thirty (30) business days prior written notice to the other Party. Upon receipt of such notice, the Service Provider shall cease work immediately except for transition services agreed in writing.",
        tags: ["msa termination", "30 days notice period", "termination for convenience", "sow termination", "contract notice"]
      },
      {
        id: "chunk-contract-001-2",
        section: "Clause 14.1",
        heading: "Limitation of Liability and Exclusion of Consequential Damages",
        content: "Except in cases of gross negligence, willful misconduct, or breach of confidentiality obligations under Clause 12, the aggregate liability of either party arising out of or related to this Agreement shall not exceed the total fees paid by Client under the applicable SOW in the twelve (12) months preceding the incident giving rise to liability.",
        tags: ["liability cap", "12 months fees limit", "limitation of liability", "indemnification", "gross negligence carve-out"]
      }
    ]
  },
  {
    id: "doc-video-001",
    title: "Labour Law & Termination Masterclass: Retrenchment, Notice Periods & Compliance",
    docType: "YouTube Video",
    jurisdiction: "India (Industrial Law Webinar)",
    court: "Indian Institute of Corporate Law (Expert Panel)",
    year: 2024,
    status: "Active Webcast",
    confidentiality: "Public",
    category: "Video Lecture & Webinar",
    sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoDuration: "18:45",
    summary: "Comprehensive video lecture by senior labour advocates breaking down mandatory notice requirements, retrenchment calculation, and common pitfalls under the Industrial Disputes Act and POSH regulations.",
    isSuperseded: false,
    supersededBy: null,
    chunks: [
      {
        id: "chunk-vid-001-1",
        section: "Timestamp [03:15 - 05:40]",
        heading: "Mandatory 30-Day Notice Period vs Salary in Lieu Under Section 25F",
        content: "In this segment, Adv. Sharma explains: 'Many HR managers mistakenly assume an immediate release with salary is purely optional without notice. Under Section 25F(a) of the Industrial Disputes Act, retrenching a workman with 1+ year service strictly requires either 1 month written notice stating explicit reasons or wages in lieu paid on the exact day of termination. If compensation is delayed even by one day, courts hold the retrenchment void ab initio.'",
        timestampSeconds: 195,
        timestampDisplay: "03:15",
        tags: ["video lecture", "03:15 timestamp", "section 25F explanation", "1 month notice wage in lieu", "void retrenchment"]
      },
      {
        id: "chunk-vid-001-2",
        section: "Timestamp [08:20 - 11:10]",
        heading: "Formula for 15 Days Retrenchment Severance Calculation",
        content: "Explaining the mathematics: 'For each completed year of service, calculate 15 days average pay. If the employee worked 3 years and 7 months, round up to 4 completed years because it exceeds 6 months. Take average of last 3 full calendar months wages including basic + DA.'",
        timestampSeconds: 500,
        timestampDisplay: "08:20",
        tags: ["video lecture", "08:20 timestamp", "15 days severance calculation", "completed year rounding"]
      },
      {
        id: "chunk-vid-001-3",
        section: "Timestamp [14:05 - 16:50]",
        heading: "Handling High Court Writs on ICC POSH Inquiries",
        content: "Key pointers for defending ICC POSH inquiries in High Courts: Ensure respondent is given reasonable time to submit reply, cross-examination through written questionnaire is permitted, and the 90-day inquiry report is shared with both parties before management executes recommendations.",
        timestampSeconds: 845,
        timestampDisplay: "14:05",
        tags: ["video lecture", "14:05 timestamp", "posh icc defense", "90 days report sharing"]
      }
    ]
  },
  {
    id: "doc-video-002",
    title: "Supreme Court of India: Digital Evidence & WhatsApp Chat Admissibility Workshop",
    docType: "YouTube Video",
    jurisdiction: "Supreme Court Bar Association",
    court: "Continuing Legal Education",
    year: 2025,
    status: "Active Webcast",
    confidentiality: "Public",
    category: "Video Lecture & Webinar",
    sourceUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    videoDuration: "24:10",
    summary: "Video workshop on proving electronic contracts, WhatsApp chats, emails, and CCTV recordings in commercial arbitration and court trials.",
    isSuperseded: false,
    supersededBy: null,
    chunks: [
      {
        id: "chunk-vid-002-1",
        section: "Timestamp [06:45 - 09:30]",
        heading: "Mandatory 65B Certificate Requirements for WhatsApp & Email Evidence",
        content: "Senior Advocate explains: 'Merely taking a screenshot and printing it out is inadmissible without the requisite Section 65B certificate. The certificate must describe device details, hash value or custody continuity, and be signed by person in lawful control of the computer/mobile device at the time of export.'",
        timestampSeconds: 405,
        timestampDisplay: "06:45",
        tags: ["video lecture", "06:45 timestamp", "whatsapp screenshot evidence", "section 65B certificate"]
      }
    ]
  }
];

const defaultUnansweredQuestions = [
  {
    id: "unans-001",
    query: "What is the penalty for non-compliance with the new Digital Personal Data Protection Act 2023 for data breaches?",
    askedBy: "Rohan Verma (Employee)",
    frequency: 7,
    firstAskedAt: "2026-08-28T10:15:00Z",
    lastAskedAt: "2026-09-01T14:22:00Z",
    status: "Pending Review",
    reason: "No DPDP Act 2023 document currently indexed in knowledge base",
    category: "Data Privacy",
    adminAnswer: null,
    resolvedAt: null,
    confidenceScore: 0.18
  },
  {
    id: "unans-002",
    query: "Can an employee be forced to serve a 90-day notice period if their offer letter specifies 30 days?",
    askedBy: "Pooja Hegde (Employee)",
    frequency: 4,
    firstAskedAt: "2026-08-29T16:40:00Z",
    lastAskedAt: "2026-09-01T11:05:00Z",
    status: "Pending Review",
    reason: "Employment contract conflict precedence query requires admin clarification",
    category: "Labour & Employment",
    adminAnswer: null,
    resolvedAt: null,
    confidenceScore: 0.32
  },
  {
    id: "unans-003",
    query: "What is the limitation period for filing an appeal before NCLAT against an NCLT order under IBC?",
    askedBy: "Vikas Mehra (Contributor)",
    frequency: 3,
    firstAskedAt: "2026-08-30T09:12:00Z",
    lastAskedAt: "2026-09-02T08:00:00Z",
    status: "Pending Review",
    reason: "Insolvency and Bankruptcy Code (IBC) Section 61 not yet indexed",
    category: "Corporate & Insolvency",
    adminAnswer: null,
    resolvedAt: null,
    confidenceScore: 0.22
  }
];

const defaultAuditLogs = [
  {
    id: "audit-001",
    timestamp: "2026-09-01T10:30:15Z",
    userId: "emp_102",
    userName: "Ananya Sen",
    userRole: "Employee",
    action: "SEARCH_QUERY",
    query: "What is the notice period required to terminate an employee under Industrial Disputes Act?",
    confidenceScore: 0.94,
    confidenceTier: "High",
    citationsCount: 2,
    retrievedDocs: ["Industrial Disputes Act, 1947", "Labour Law Masterclass Video"],
    ipAddress: "192.168.1.45"
  },
  {
    id: "audit-002",
    timestamp: "2026-09-01T11:45:00Z",
    userId: "emp_205",
    userName: "Karan Johar",
    userRole: "Employee",
    action: "SEARCH_QUERY",
    query: "Is Section 66A IT Act still valid in India?",
    confidenceScore: 0.98,
    confidenceTier: "High",
    citationsCount: 2,
    retrievedDocs: ["Information Technology Act, 2000", "Shreya Singhal v. Union of India"],
    ipAddress: "192.168.1.88"
  },
  {
    id: "audit-003",
    timestamp: "2026-09-01T14:22:00Z",
    userId: "emp_310",
    userName: "Rohan Verma",
    userRole: "Employee",
    action: "UNANSWERED_ESCALATION",
    query: "What is the penalty for non-compliance with the new Digital Personal Data Protection Act 2023 for data breaches?",
    confidenceScore: 0.18,
    confidenceTier: "Low (Routed to Admin)",
    citationsCount: 0,
    retrievedDocs: [],
    ipAddress: "192.168.1.112"
  },
  {
    id: "audit-004",
    timestamp: "2026-09-01T15:10:20Z",
    userId: "admin_01",
    userName: "Adv. Rajesh Sharma (Lead Counsel)",
    userRole: "Admin",
    action: "DOCUMENT_UPLOAD",
    query: "Uploaded Master Services Agreement (MSA) v2.4",
    confidenceScore: 1.0,
    confidenceTier: "N/A",
    citationsCount: 0,
    retrievedDocs: ["Master Services Agreement (MSA)"],
    ipAddress: "192.168.1.10"
  }
];

const defaultSavedSearches = [
  {
    id: "saved-001",
    userId: "emp_current",
    query: "Notice period for workman retrenchment",
    savedAt: "2026-09-01T12:00:00Z",
    tags: ["Labour Law", "Section 25F"]
  },
  {
    id: "saved-002",
    userId: "emp_current",
    query: "POSH ICC committee requirements for 10+ employees",
    savedAt: "2026-09-01T14:30:00Z",
    tags: ["Compliance", "POSH"]
  }
];

const defaultBookmarks = [
  {
    id: "bm-001",
    userId: "emp_current",
    title: "Section 25F - Notice Period & 15 Days Retrenchment Pay",
    docTitle: "Industrial Disputes Act, 1947",
    section: "Section 25F",
    excerpt: "No workman employed in any industry who has been in continuous service for not less than one year... shall be retrenched until given one month's notice...",
    bookmarkedAt: "2026-09-01T12:05:00Z"
  }
];

module.exports = {
  defaultDocuments,
  defaultUnansweredQuestions,
  defaultAuditLogs,
  defaultSavedSearches,
  defaultBookmarks
};
