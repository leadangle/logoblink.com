import FileSystemBackend from './implementation'
import AuthenticationPage from './AuthenticationPage'

/**
 * Add extension hooks to global scope.
 */
if (typeof window !== 'undefined') {
  window.FileSystemBackend = FileSystemBackend
}

export { AuthenticationPage }
export default FileSystemBackend
