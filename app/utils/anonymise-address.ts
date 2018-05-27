export default function anonymiseAddress(address: string) {
  return address
    .trim()
    .replace(/^#?(\d+-\d+)/, (dashedNumber) => dashedNumber.split('-')[1])
    .replace(/^(\d+)/, (number) => `${Math.floor(parseInt(number)/100)*100} block`)
    .replace(/ \(.*\)$/, '')
    .replace(/ #\w*$/, '')
    .replace(/ (unit|suite|apt) .*$/i, '')
    .replace(/ building .*$/i, '')
}
