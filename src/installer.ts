/* eslint-disable @typescript-eslint/space-before-function-paren */
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import { type Host } from './host'

const BINARY_NAME = 'spin'

export interface Tool {
  name: string
  path: string
}

export class SpinInstaller {
  constructor(private readonly _host: Host) {
  }

  public async download(version: string): Promise<Tool> {
    if (version.length === 0) {
      throw new Error('Failed to download Fermyon Spin: version is required')
    }
    try {
      if (this._isLatest(version)) {
        this._host.debug('latest version requested')
        version = await this._getLatestVersion()
      }
      const v = this._sanitizeVersion(version)
      this._host.debug(`Sanitized version: ${v}`)

      const url = this._buildDownloadUrl(v)
      this._host.debug(`Downloading version ${version} from: ${url}`)
      const dl = await this._host.download(url)
      this._host.debug(`Downloaded to: ${dl}`)

      const folder = await this._extract(dl)
      this._host.debug(`Extracted to: ${folder}`)

      await this._host.chmod(path.join(folder, BINARY_NAME), 0o755)
      this._host.debug(`Set permissions on ${BINARY_NAME}`)

      this._host.addFolderToPath(folder)
      this._host.debug(`Added ${folder} to PATH`)

      return { name: 'spin', path: folder }
    } catch (err: any) {
      throw new Error(`Failed to download release from GitHub: ${err.message}`)
    }
  }

  private _buildDownloadUrl(version: string): string {
    const arch = this._isArm() ? 'arm64' : 'amd64'
    let ext = 'tar.gz'
    let osType = 'linux'
    if (os.type().match(/^Win/) != null) {
      ext = 'zip'
      osType = 'windows'
    } else if (os.type().match(/^Darwin/) != null) {
      osType = 'macos'
    }
    return `https://github.com/fermyon/spin/releases/download/${version}/spin-${version}-${osType}-${arch}.${ext}`
  }

  private _isArm(): boolean {
    return os.arch() === 'arm64' || os.arch() === 'arm'
  }

  private async _extract(archive: string): Promise<string> {
    try {
      if (this._isZip(archive)) {
        return await this._host.extractZip(archive)
      }
      return await this._host.extractTarGz(archive)
    } catch (err: any) {
      throw new Error(`Failed to extract downloaded archive ${archive}: ${err.message}`)
    }
  }

  private _isZip(file: string): boolean {
    return path.extname(file) === '.zip'
  }

  private async _getLatestVersion(): Promise<string> {
    try {
      const url = 'https://api.github.com/repos/fermyon/spin/releases/latest'
      const p = await this._host.download(url)
      const release = JSON.parse(fs.readFileSync(p, 'utf8').toString().trim())
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!release.tag_name) {
        throw new Error(`Failed to determine latest version: ${JSON.stringify(release)}`)
      }
      return release.tag_name
    } catch (err: any) {
      throw new Error(`Failed to get latest version: ${err.message}`)
    }
  }

  private _isLatest(v: string): boolean {
    return v === 'latest'
  }

  private _sanitizeVersion(v: string): string {
    if (this._isLatest(v)) {
      return v
    }
    if (!v.startsWith('v')) {
      return `v${v}`
    }
    return v
  }
}
