import linkedinProfile from '~/data/linkedin_profile.json'
import featuredProjects from '~/data/featured_projects.json'
import type {
  ResumeData,
  ContactInfo,
  ExperienceEntry,
  EducationEntry,
  CertificationEntry,
  ProjectEntry,
  SectionTitles,
} from './types'

const COMPANY_KEY_MAP: Record<string, string> = {
  'DATAPREV': 'dataprev',
  'Medware Sistemas Médicos': 'medware',
  'Xpbox Digital': 'xpbox',
  'Tribunal de Contas da União': 'tcu',
  'IFB - Instituto Federal de Brasília (Oficial)': 'ifb',
}

const PROJECT_KEY_MAP: Record<string, string> = {
  'Calculadoras Medware': 'calculadoras-medware',
  'MoneySuite': 'moneysuite',
  'SIMP — TCU': 'simp-tcu',
  'Deep Fake Detection': 'deep-fake-detection',
}

export function formatDate(
  year: number,
  month: number,
  locale: string,
  t: (key: string) => string
): string {
  if (year === 0) {
    return t('resume.present')
  }
  const monthName = t(`experience.months.${month - 1}`)
  return `${monthName} ${year}`
}

export function formatContactLine(contact: ContactInfo): string {
  return [contact.location, contact.email, contact.linkedin, contact.github]
    .filter((v) => v !== '')
    .join(' | ')
}

function parseDescription(description: string): string[] {
  return description
    .split('\n')
    .map((line) => line.replace(/^- /, '').trim())
    .filter((line) => line.length > 0)
}

function getCompanyKey(companyName: string): string | undefined {
  return COMPANY_KEY_MAP[companyName]
}

function getProjectKey(projectName: string): string | undefined {
  return PROJECT_KEY_MAP[projectName]
}

export function collectResumeData(
  locale: string,
  t: (key: string) => string
): ResumeData {
  const profile = linkedinProfile
  const projects = featuredProjects

  const name = `${profile.firstName} ${profile.lastName}`
  const headline = profile.headline

  const summary = t('data.summary')

  const contact: ContactInfo = {
    location: profile.geo.full,
    email: 'gustavolacerda.dev@gmail.com',
    linkedin: `https://linkedin.com/in/${profile.username}`,
    github: 'https://github.com/GustavoCunhaLacerda',
  }

  const experience: ExperienceEntry[] = profile.position.map((pos) => {
    const companyKey = getCompanyKey(pos.companyName)

    let title = pos.title
    let descriptionItems = parseDescription(pos.description)

    if (companyKey) {
      const translatedTitle = t(`data.positions.${companyKey}.title`)
      if (translatedTitle && !translatedTitle.startsWith('data.positions.')) {
        title = translatedTitle
      }

      const translatedDesc = t(`data.positions.${companyKey}.description`)
      if (translatedDesc && !translatedDesc.startsWith('data.positions.')) {
        descriptionItems = parseDescription(translatedDesc)
      }
    }

    const employmentTypeKey = pos.employmentType
    const translatedEmploymentType = t(`experience.employmentType.${employmentTypeKey}`)
    const employmentType =
      translatedEmploymentType && !translatedEmploymentType.startsWith('experience.employmentType.')
        ? translatedEmploymentType
        : pos.employmentType

    return {
      title,
      company: pos.companyName,
      location: pos.location,
      startDate: formatDate(pos.start.year, pos.start.month, locale, t),
      endDate: formatDate(pos.end.year, pos.end.month, locale, t),
      employmentType,
      description: descriptionItems,
    }
  })

  const skills: string[] = profile.skills.map((s) => s.name)

  const education: EducationEntry[] = profile.educations.map((edu) => ({
    institution: edu.schoolName,
    degree: edu.degree,
    fieldOfStudy: edu.fieldOfStudy,
    startYear: edu.start.year,
    endYear: edu.end.year,
    ...(edu.grade ? { grade: edu.grade } : {}),
  }))

  const certifications: CertificationEntry[] = profile.certifications.map((cert) => ({
    name: cert.name,
    authority: cert.authority,
    date: formatDate(cert.start.year, cert.start.month, locale, t),
  }))

  const projectEntries: ProjectEntry[] = projects.map((proj) => {
    const projectKey = getProjectKey(proj.name)

    let projectName = proj.name
    let projectDescription = proj.description

    if (projectKey) {
      const translatedName = t(`data.featuredProjects.${projectKey}.name`)
      if (translatedName && !translatedName.startsWith('data.featuredProjects.')) {
        projectName = translatedName
      }

      const translatedDesc = t(`data.featuredProjects.${projectKey}.description`)
      if (translatedDesc && !translatedDesc.startsWith('data.featuredProjects.')) {
        projectDescription = translatedDesc
      }
    }

    return {
      name: projectName,
      description: projectDescription,
      techs: proj.techs,
    }
  })

  const sectionTitles: SectionTitles = {
    summary: t('resume.sections.summary'),
    experience: t('resume.sections.experience'),
    skills: t('resume.sections.skills'),
    education: t('resume.sections.education'),
    certifications: t('resume.sections.certifications'),
    projects: t('resume.sections.projects'),
  }

  return {
    name,
    headline,
    summary,
    contact,
    experience,
    skills,
    education,
    certifications,
    projects: projectEntries,
    sectionTitles,
  }
}
