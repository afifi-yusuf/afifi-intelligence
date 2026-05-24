export const RESUME_PDF_HREF = '/Yusuf%20Resume.pdf'
export const RESUME_PDF_DOWNLOAD = 'Yusuf_Afifi_Resume.pdf'

export function triggerResumeDownload() {
  if (typeof document === 'undefined') return

  const a = document.createElement('a')
  a.href = RESUME_PDF_HREF
  a.download = RESUME_PDF_DOWNLOAD
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
