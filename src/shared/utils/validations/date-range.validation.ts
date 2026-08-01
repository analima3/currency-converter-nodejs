export function validateDateRange(data: {
  startDate?: Date
  endDate?: Date
}): { code: "custom"; message: string; path: (string | number)[] }[] {
  const issues: Array<{
    code: "custom"
    message: string
    path: (string | number)[]
  }> = []

  const { startDate, endDate } = data
  const now = new Date()

  if (startDate && startDate > now) {
    issues.push({
      code: "custom",
      message: "A data de início não pode ser no futuro.",
      path: ["startDate"],
    })
  }

  if (endDate && endDate > now) {
    issues.push({
      code: "custom",
      message: "A data de fim não pode ser no futuro.",
      path: ["endDate"],
    })
  }

  if (startDate && endDate) {
    if (endDate <= startDate) {
      issues.push({
        code: "custom",
        message: "A data de fim deve ser maior que a data de início.",
        path: ["endDate"],
      })
    }

    const maxRangeDays = 365

    const diffDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)

    if (diffDays > maxRangeDays) {
      issues.push({
        code: "custom",
        message: `O intervalo entre as datas não pode exceder ${maxRangeDays} dias.`,
        path: ["endDate"],
      })
    }
  }

  return issues
}
