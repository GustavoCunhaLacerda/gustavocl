import { collectResumeData } from '~/utils/resume/ResumeDataService'
import { buildResumePDF } from '~/utils/resume/ResumePDFBuilder'
import type { PDFConfig } from '~/utils/resume/types'

const DEFAULT_CONFIG: PDFConfig = {
  pageWidth: 210,
  pageHeight: 297,
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 20,
  marginRight: 20,
  accentColor: '#2563eb',
  fontSizes: {
    name: 20,
    sectionTitle: 13,
    body: 10,
    small: 9,
  },
}

export function useResumeGenerator() {
  const isGenerating = ref(false)
  const error = ref<string | null>(null)
  const { locale, t } = useI18n()

  async function generateResume() {
    isGenerating.value = true
    error.value = null
    try {
      const data = collectResumeData(locale.value, t)
      const pdf = buildResumePDF(data, DEFAULT_CONFIG)
      pdf.save('Gustavo_Cunha_Lacerda_CV.pdf')
    } catch (e) {
      error.value = t('resume.error')
    } finally {
      isGenerating.value = false
    }
  }

  return {
    isGenerating,
    error,
    generateResume,
  }
}
