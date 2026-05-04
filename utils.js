export const sanitizeHtml = (value) => {
    return value.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}
