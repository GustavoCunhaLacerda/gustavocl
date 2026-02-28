import { jsPDF } from 'jspdf'
import type { ResumeData, PDFConfig } from './types'
import { formatContactLine } from './ResumeDataService'

const MAX_PAGES = 2
const SECTION_SPACING = 10
const ITEM_SPACING = 5
const LINE_HEIGHT_FACTOR = 1.4
const SEPARATOR_THICKNESS = 0.5

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '')
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  }
}

export function buildResumePDF(data: ResumeData, config: PDFConfig): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  doc.setFont('Helvetica')

  const contentWidth = config.pageWidth - config.marginLeft - config.marginRight
  const maxY = config.pageHeight - config.marginBottom
  let cursorY = config.marginTop

  function canFit(height: number): boolean {
    return cursorY + height <= maxY
  }

  function addPageIfNeeded(height: number): boolean {
    if (canFit(height)) return true
    const currentPage = doc.getNumberOfPages()
    if (currentPage >= MAX_PAGES) return false
    doc.addPage()
    cursorY = config.marginTop
    return true
  }

  function getLineHeight(fontSize: number): number {
    return (fontSize * LINE_HEIGHT_FACTOR) / 2.835
  }

  function drawSeparatorLine(): void {
    const accent = hexToRgb(config.accentColor)
    doc.setDrawColor(accent.r, accent.g, accent.b)
    doc.setLineWidth(SEPARATOR_THICKNESS)
    doc.line(config.marginLeft, cursorY, config.pageWidth - config.marginRight, cursorY)
    cursorY += 4
  }

  function renderSectionTitle(title: string): boolean {
    const lineH = getLineHeight(config.fontSizes.sectionTitle)
    const needed = lineH + 6
    if (!addPageIfNeeded(needed)) return false

    const accent = hexToRgb(config.accentColor)
    doc.setFontSize(config.fontSizes.sectionTitle)
    doc.setFont('Helvetica', 'bold')
    doc.setTextColor(accent.r, accent.g, accent.b)
    doc.text(title, config.marginLeft, cursorY)
    cursorY += lineH
    drawSeparatorLine()

    doc.setTextColor(0, 0, 0)
    doc.setFont('Helvetica', 'normal')
    return true
  }

  function renderWrappedText(text: string, fontSize: number, fontStyle: string = 'normal'): boolean {
    doc.setFontSize(fontSize)
    doc.setFont('Helvetica', fontStyle)
    const lineH = getLineHeight(fontSize)
    const lines: string[] = doc.splitTextToSize(text, contentWidth)

    for (const line of lines) {
      if (!addPageIfNeeded(lineH)) return false
      doc.text(line, config.marginLeft, cursorY)
      cursorY += lineH
    }
    return true
  }

  // --- 3.2: Header (name + contact) ---
  function renderHeader(): void {
    doc.setFontSize(config.fontSizes.name)
    doc.setFont('Helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const centerX = config.pageWidth / 2
    doc.text(data.name, centerX, cursorY, { align: 'center' })
    cursorY += getLineHeight(config.fontSizes.name)

    const contactLine = formatContactLine(data.contact)
    doc.setFontSize(config.fontSizes.small)
    doc.setFont('Helvetica', 'normal')
    const contactLines: string[] = doc.splitTextToSize(contactLine, contentWidth)
    const contactLineH = getLineHeight(config.fontSizes.small)
    for (const cl of contactLines) {
      doc.text(cl, centerX, cursorY, { align: 'center' })
      cursorY += contactLineH
    }
    cursorY += 2
  }

  // --- 3.3: Summary ---
  function renderSummary(): boolean {
    if (!data.summary) return true
    if (!renderSectionTitle(data.sectionTitles?.summary ?? 'Professional Summary')) return false
    doc.setFontSize(config.fontSizes.body)
    doc.setFont('Helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    if (!renderWrappedText(data.summary, config.fontSizes.body)) return false
    cursorY += SECTION_SPACING
    return true
  }

  // --- 3.4: Experience ---
  function renderExperience(): boolean {
    if (!data.experience || data.experience.length === 0) return true
    if (!renderSectionTitle(data.sectionTitles?.experience ?? 'Professional Experience')) return false

    for (let i = 0; i < data.experience.length; i++) {
      const entry = data.experience[i]!
      const lineH = getLineHeight(config.fontSizes.body)

      // Title (bold) + period aligned right on same line
      if (!addPageIfNeeded(lineH)) return false
      doc.setFontSize(config.fontSizes.body)
      doc.setFont('Helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(entry.title, config.marginLeft, cursorY)

      const period = `${entry.startDate} - ${entry.endDate}`
      doc.setFont('Helvetica', 'normal')
      doc.text(period, config.pageWidth - config.marginRight, cursorY, { align: 'right' })
      cursorY += lineH

      // Company name
      if (!addPageIfNeeded(lineH)) return false
      doc.setFont('Helvetica', 'normal')
      doc.text(entry.company, config.marginLeft, cursorY)
      cursorY += lineH

      // Employment type
      if (entry.employmentType) {
        if (!addPageIfNeeded(lineH)) return false
        doc.setFontSize(config.fontSizes.small)
        doc.text(entry.employmentType, config.marginLeft, cursorY)
        cursorY += getLineHeight(config.fontSizes.small)
      }

      // Bullet points
      const bulletIndent = config.marginLeft + 4
      const bulletContentWidth = contentWidth - 4
      for (const item of entry.description) {
        doc.setFontSize(config.fontSizes.body)
        doc.setFont('Helvetica', 'normal')
        const bulletLines: string[] = doc.splitTextToSize(item, bulletContentWidth)
        for (let j = 0; j < bulletLines.length; j++) {
          if (!addPageIfNeeded(lineH)) return false
          if (j === 0) {
            doc.text(`•  ${bulletLines[j]}`, bulletIndent, cursorY)
          } else {
            doc.text(`   ${bulletLines[j]}`, bulletIndent, cursorY)
          }
          cursorY += lineH
        }
      }

      // Spacing between entries
      if (i < data.experience.length - 1) {
        cursorY += ITEM_SPACING
      }
    }

    cursorY += SECTION_SPACING
    return true
  }

  // --- 3.5: Skills ---
  function renderSkills(): boolean {
    if (!data.skills || data.skills.length === 0) return true
    if (!renderSectionTitle(data.sectionTitles?.skills ?? 'Technical Skills')) return false
    const skillsText = data.skills.join(', ')
    if (!renderWrappedText(skillsText, config.fontSizes.body)) return false
    cursorY += SECTION_SPACING
    return true
  }

  // --- 3.6: Education ---
  function renderEducation(): boolean {
    if (!data.education || data.education.length === 0) return true
    if (!renderSectionTitle(data.sectionTitles?.education ?? 'Education')) return false

    const lineH = getLineHeight(config.fontSizes.body)

    for (let i = 0; i < data.education.length; i++) {
      const entry = data.education[i]!

      if (!addPageIfNeeded(lineH)) return false
      doc.setFontSize(config.fontSizes.body)
      doc.setFont('Helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(entry.institution, config.marginLeft, cursorY)
      cursorY += lineH

      if (!addPageIfNeeded(lineH)) return false
      doc.setFont('Helvetica', 'normal')
      const degreeLine = `${entry.degree} — ${entry.fieldOfStudy}`
      doc.text(degreeLine, config.marginLeft, cursorY)

      const period = `${entry.startYear} - ${entry.endYear}`
      doc.text(period, config.pageWidth - config.marginRight, cursorY, { align: 'right' })
      cursorY += lineH

      if (entry.grade) {
        if (!addPageIfNeeded(lineH)) return false
        doc.setFontSize(config.fontSizes.small)
        doc.text(entry.grade, config.marginLeft, cursorY)
        cursorY += getLineHeight(config.fontSizes.small)
      }

      if (i < data.education.length - 1) {
        cursorY += ITEM_SPACING
      }
    }

    cursorY += SECTION_SPACING
    return true
  }

  // --- 3.6: Certifications ---
  function renderCertifications(): boolean {
    if (!data.certifications || data.certifications.length === 0) return true
    if (!renderSectionTitle(data.sectionTitles?.certifications ?? 'Certifications')) return false

    const lineH = getLineHeight(config.fontSizes.body)

    for (let i = 0; i < data.certifications.length; i++) {
      const entry = data.certifications[i]!

      if (!addPageIfNeeded(lineH)) return false
      doc.setFontSize(config.fontSizes.body)
      doc.setFont('Helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(entry.name, config.marginLeft, cursorY)
      cursorY += lineH

      if (!addPageIfNeeded(lineH)) return false
      doc.setFont('Helvetica', 'normal')
      doc.text(`${entry.authority} — ${entry.date}`, config.marginLeft, cursorY)
      cursorY += lineH

      if (i < data.certifications.length - 1) {
        cursorY += ITEM_SPACING
      }
    }

    cursorY += SECTION_SPACING
    return true
  }

  // --- 3.6: Projects ---
  function renderProjects(): boolean {
    if (!data.projects || data.projects.length === 0) return true
    if (!renderSectionTitle(data.sectionTitles?.projects ?? 'Featured Projects')) return false

    const lineH = getLineHeight(config.fontSizes.body)

    for (let i = 0; i < data.projects.length; i++) {
      const entry = data.projects[i]!

      if (!addPageIfNeeded(lineH)) return false
      doc.setFontSize(config.fontSizes.body)
      doc.setFont('Helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(entry.name, config.marginLeft, cursorY)
      cursorY += lineH

      doc.setFont('Helvetica', 'normal')
      if (!renderWrappedText(entry.description, config.fontSizes.body)) return false

      if (entry.techs && entry.techs.length > 0) {
        if (!addPageIfNeeded(lineH)) return false
        doc.setFontSize(config.fontSizes.small)
        doc.setFont('Helvetica', 'italic')
        doc.text(entry.techs.join(', '), config.marginLeft, cursorY)
        cursorY += getLineHeight(config.fontSizes.small)
        doc.setFont('Helvetica', 'normal')
      }

      if (i < data.projects.length - 1) {
        cursorY += ITEM_SPACING
      }
    }

    return true
  }

  // --- Render all sections in order ---
  renderHeader()
  renderSummary()
  renderExperience()
  renderSkills()
  renderEducation()
  renderCertifications()
  renderProjects()

  return doc
}
