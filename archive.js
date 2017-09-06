/* globals DatArchive */

const {FSNode, FSContainer} = require('./base')

class FSArchiveContainer extends FSContainer {
  constructor (archiveInfo) {
    super()
    this._archiveInfo = archiveInfo
    this._archive = null
    this._path = ''
    this._files = []
  }

  get isEmpty () { return this._files.length === 0 }
  get children () { return this._files }

  async readData () {
    // load all children
    this._archive = this._archive || new DatArchive(this._archiveInfo.url)
    var fileInfos = await this._archive.readdir(this._path, {stat: true})
    this._files = fileInfos.map(fileInfo => {
      const path = this._path + '/' + fileInfo.name
      if (fileInfo.stat.isDirectory()) {
        return new FSArchiveFolder(this._archiveInfo, this._archive, fileInfo.name, path, fileInfo.stat)
      }
      return new FSArchiveFile(this._archiveInfo, this._archive, fileInfo.name, path, fileInfo.stat)
    })

    // sort
    this._files.sort((a, b) => {
      // directories at top
      if (a.isContainer && !b.isContainer) { return -1 }
      if (!a.isContainer && b.isContainer) { return 1 }
      // by name
      return a.name.localeCompare(b.name)
    })
  }
}

class FSArchive extends FSArchiveContainer {
  get url () { return this._archiveInfo.url }
  get type () { return 'archive' }
  get name () { return (this._archiveInfo.title || '').trim() || 'Untitled' }
}

class FSArchiveFolder extends FSArchiveContainer {
  constructor (archiveInfo, archive, name, path, stat) {
    super(archiveInfo)
    this._archive = archive
    this._name = name
    this._path = path
    this._stat = stat
  }

  get url () { return this._archiveInfo.url + this._path }
  get type () { return 'folder' }
  get name () { return (this._name || '').trim() || 'Untitled' }

}

class FSArchiveFile extends FSNode {
  constructor (archiveInfo, archive, name, path, stat) {
    super()
    this._archiveInfo = archiveInfo
    this._archive = archive
    this._name = name
    this._path = path
    this._stat = stat
  }

  get url () { return this._archiveInfo.url + this._path }
  get type () { return 'file' }
  get name () { return (this._name || '').trim() || 'Untitled' }
  get size () { return this._stat.size }
  get mtime () { return this._stat.mtime }
}

module.exports = {FSArchiveContainer, FSArchive, FSArchiveFolder, FSArchiveFile}