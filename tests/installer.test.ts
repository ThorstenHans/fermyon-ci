import { SpinInstaller } from '../src'
import { FakeHost } from './fakes'
import * as os from 'os'

test('SpinInstaller.download() should throw an error when version is empty', async () => {
  const host = new FakeHost()
  const installer = new SpinInstaller(host)

  await expect(installer.download('')).rejects.toThrow('Failed to download Fermyon Spin: version is required')
})

test('SpinInstaller.download() should add folder to path', async () => {
  const host = new FakeHost()
  const installer = new SpinInstaller(host)

  await installer.download('2.0.0')

  expect(host.folderAddedToPath).toBe('/some/spin_folder/')
})

test('SpinInstaller.downoad() should set mode on binary', async () => {
  const host = new FakeHost()
  const installer = new SpinInstaller(host)

  await installer.download('2.0.0')

  expect(host.mode).toBe(0o755)
})

test('SpinInstaller.downlaod() should construct proper download url', async () => {
  const host = new FakeHost()
  const installer = new SpinInstaller(host)

  const arch = os.arch() === 'arm' || os.arch() === 'arm64' ? 'arm64' : 'amd64'
  const version = '2.0.0'

  let ext = 'tar.gz'
  let osType = 'linux'

  if (os.type().match(/^Win/)) {
    ext = 'zip'
    osType = 'windows'
  } else if (os.type().match(/^Darwin/)) {
    osType = 'macos'
  }

  const expected = `https://github.com/fermyon/spin/releases/download/v${version}/spin-v${version}-${osType}-${arch}.${ext}`
  await installer.download(version)

  expect(host.downloadUrl).toBe(expected)
})
