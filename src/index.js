const start = document.getElementById('start')
const stop = document.getElementById('stop')
const video = document.querySelector('video')
let recorder, stream

async function startRecording() {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: 'screen' }
    })
  } catch (err) {
    console.log('Screen selection aborted!')
    return -1
  }

  recorder = new MediaRecorder(stream)

  const chunks = []
  recorder.ondataavailable = (e) => chunks.push(e.data)
  recorder.onstop = (e) => {
    const completeBlob = new Blob(chunks, { type: chunks[0].type })
    video.src = URL.createObjectURL(completeBlob)
  }

  recorder.start()
  return 0
}

start.addEventListener('click', async () => {
  let screenRecordInstance = await startRecording()
  if (screenRecordInstance !== -1) {
    start.setAttribute('disabled', true)
    stop.removeAttribute('disabled')
  }
})

stop.addEventListener('click', () => {
  stop.setAttribute('disabled', true)
  start.removeAttribute('disabled')

  recorder.stop()
  stream.getVideoTracks()[0].stop()
})
