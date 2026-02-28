export interface ContactInfo {
  location: string
  email: string
  linkedin: string
  github: string
}

export interface ExperienceEntry {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  employmentType: string
  description: string[]
}

export interface EducationEntry {
  institution: string
  degree: string
  fieldOfStudy: string
  startYear: number
  endYear: number
  grade?: string
}

export interface CertificationEntry {
  name: string
  authority: string
  date: string
}

export interface ProjectEntry {
  name: string
  description: string
  techs: string[]
}

export interface SectionTitles {
  summary: string
  experience: string
  skills: string
  education: string
  certifications: string
  projects: string
}

export interface ResumeData {
  name: string
  headline: string
  summary: string
  contact: ContactInfo
  experience: ExperienceEntry[]
  skills: string[]
  education: EducationEntry[]
  certifications: CertificationEntry[]
  projects: ProjectEntry[]
  sectionTitles?: SectionTitles
}

export interface PDFConfig {
  pageWidth: number
  pageHeight: number
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
  accentColor: string
  fontSizes: {
    name: number
    sectionTitle: number
    body: number
    small: number
  }
}
