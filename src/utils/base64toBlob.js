/* eslint-disable no-plusplus */
import { baseBase64 } from './decodeBase64'

function base64toBlob({ base64Data, mimeType }) {
  const sliceSize = 1024
  const byteCharacters = atob(baseBase64(base64Data))
  const bytesLength = byteCharacters.length
  const slicesCount = Math.ceil(bytesLength / sliceSize)
  const byteArrays = new Array(slicesCount)

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize
    const end = Math.min(begin + sliceSize, bytesLength)

    const bytes = new Array(end - begin)
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0)
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes)
  }
  return new Blob(byteArrays, { type: mimeType })
}

export default base64toBlob
