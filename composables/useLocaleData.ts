export function useLocaleData() {
  const { t, locale } = useI18n()

  const getProjectDescription = (projectKey: string): string => {
    return t(`data.featuredProjects.${projectKey}.description`)
  }

  const getPositionTitle = (positionKey: string): string => {
    return t(`data.positions.${positionKey}.title`)
  }

  const getPositionDescription = (positionKey: string): string => {
    return t(`data.positions.${positionKey}.description`)
  }

  const getSummary = (): string => {
    return t('data.summary')
  }

  return { getProjectDescription, getPositionTitle, getPositionDescription, getSummary, locale }
}
