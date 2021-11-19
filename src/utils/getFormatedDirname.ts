export default function getFormatedDirname(dirname: string): string {
  return dirname.endsWith('\\')
    ? dirname.replace(/\\/g, '/')
    : dirname.replace(/\\/g, '/') + '/'
}
