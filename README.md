# beaker-virtual-fs

This module wraps a number of different APIs in generic "file" objects. The generic objects can be used to simplify rendering.

The generic interface is used on *all objects*. It is defined as follows:

```js
class FSNode {
  get url () { return false }
  get type () { return 'node' }
  get name () { return '' }
  get size () { return 0 }
  get mtime () { return 0 }
  get isContainer () { return false } // is folder-like?
  get isEmpty () { return true } // has children?
  get children () { return [] }

  // load any data needed to display the node in the sidebar or in the expanded state
  async readData () {}
}
```

The following classes are exported by this module:

```js
const {
  FSNode, // root interface for all objects, should be subclassed
  FSContainer, // root interface for all folder-like objects, should be subclassed

  FSVirtualRoot, // the root of the FS
  FSVirtualFolder, // a base class for virtually-defined folders
  FSVirtualFolderWithTypes, // a base class for virtually-defined folders that have type-filters as their children
  FSVirtualFolder_TypeFilter, // the children of FSVirtualFolderWithTypes, applies a type filter to its parent's children
  FSVirtualFolder_User, // contains a single user's folders
  FSVirtualFolder_Network, // contains network folders
  FSVirtualFolder_Saved, // contains the local user's saved archives
  FSVirtualFolder_Rehosting, // contains the local user's rehosted archives
  FSVirtualFolder_Trash, // contains the local user's deleted archives
  
  FSArchiveContainer, // root interface for all folder-like archive objects, should be subclassed
  FSArchive, // an archive
  FSArchiveFolder, // a folder within an archive
  FSArchiveFile // a file within an archive
} = require('beaker-virtual-fs')
```

Currently the only two classes you'll want to instantiate directly are `FSVirtualRoot` and `FSArchive`. Here are their usages:

```js
var root = new FSVirtualRoot()
var archive = new FSArchive(archiveInfo) // archiveInfo is provided from beaker.archives or DatArchive#getInfo()
```