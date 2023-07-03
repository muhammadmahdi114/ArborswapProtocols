import { BrowserRouter as Router } from 'react-router-dom'
import { SidebarProvider } from './context/SidebarContext/GlobalProvider'
import WebRouter from './route'
import 'react-datetime/css/react-datetime.css'
import { DAppProvider } from '@usedapp/core'
import { getNetworkConfig, networkConfig } from './config/networks'
import { ModalProvider } from 'react-simple-modal-provider'
import modals from 'components/Modal'
import { useDefaultChainId } from 'config/useDefaultChainId'
import { useEffect } from 'react'

function App() {
  const defaultChainId = useDefaultChainId()
  const config = getNetworkConfig(defaultChainId)

  useEffect(()=> {
    console.log(config)
  }, [config])

  return (
    <div className="">
      <DAppProvider config={config}>
        <ModalProvider value={modals}>
          <SidebarProvider>
            <Router>
              <WebRouter />
            </Router>
          </SidebarProvider>
        </ModalProvider>
      </DAppProvider>
    </div>
  )
}

export default App;