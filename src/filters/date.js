export default (value) => {
  // eslint-disable-next-line
  const date = new Date(value)
  return date.toLocaleDateString(
    ['vi-VI'],
    {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  )
} // eslint-disable-line