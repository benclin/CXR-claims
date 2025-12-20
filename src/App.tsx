import { DocsRoutes } from '@/docs/routes'
import { Toaster } from '@/components/ui/sonner'

/**
 * Main App component
 * Renders the docs site routes
 */
function App() {
  return (
    <>
      <DocsRoutes />
      <Toaster />
    </>
  )
}

export default App
