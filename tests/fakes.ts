import { type Command, type CommandResult, type Host } from '../src/host'

export class FakeHost implements Host {
  private readonly _commands: Command[] = []
  private _folderAddedToPath: string = ''
  private _mode: number = 0
  private _downloadUrl: string = ''

  get commands (): Command[] {
    return this._commands
  }

  get folderAddedToPath (): string {
    return this._folderAddedToPath
  }

  get mode (): number {
    return this._mode
  }

  get downloadUrl (): string {
    return this._downloadUrl
  }

  addFolderToPath (folder: string): void {
    this._folderAddedToPath = folder
  }

  async chmod (file: string, mode: number): Promise<void> {
    this._mode = mode
    await Promise.resolve()
  }

  async execute (command: Command): Promise<CommandResult> {
    this._commands.push(command)
    return await Promise.resolve({ exitCode: 0 })
  }

  async extractZip (path: string): Promise<string> {
    return await Promise.resolve('')
  }

  async extractTarGz (path: string): Promise<string> {
    return await Promise.resolve('/some/spin_folder/')
  }

  async download (url: string): Promise<string> {
    this._downloadUrl = url
    return await Promise.resolve('/some/path/to/file.tar.gz')
  }

  log (message: string): void {

  }

  debug (message: string): void {

  }
}
