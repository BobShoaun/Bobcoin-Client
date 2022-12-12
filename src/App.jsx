import { useState, useEffect, Suspense, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NewTransactionAction from "./components/NewTransactionAction";
import Loading from "./components/Loading";

import io from "socket.io-client";

import SocketContext from "./socket/SocketContext";
import { initializeSocket } from "./socket/socket";

import { reset as resetBlockchain } from "./store/blockchainSlice";
import { reset as resetParams } from "./store/consensusSlice";

import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const OverviewPage = lazy(() => import("./pages/OverviewPage"));
const GenerateKeysPage = lazy(() => import("./pages/GenerateKeysPage"));
const MinePage = lazy(() => import("./pages/MinePage"));
const AddressPage = lazy(() => import("./pages/AddressPage/"));
const NewTransactionPage = lazy(() => import("./pages/NewTransactionPage"));
const BlockPage = lazy(() => import("./pages/BlockPage"));
const TransactionPage = lazy(() => import("./pages/TransactionPage"));
const BlockchainPage = lazy(() => import("./pages/BlockchainPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const ParametersPage = lazy(() => import("./pages/ParametersPage"));
const ReceivePage = lazy(() => import("./pages/ReceivePage"));
const FaucetPage = lazy(() => import("./pages/FaucetPage"));
const NodePage = lazy(() => import("./pages/NodePage"));
const DeveloperPage = lazy(() => import("./pages/DeveloperPage"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const WalletImportPage = lazy(() => import("./pages/WalletImportPage"));
const WalletCreatePage = lazy(() => import("./pages/WalletCreatePage"));
const WalletOnboardingPage = lazy(() => import("./pages/WalletOnboardingPage"));

const App = () => {
  const dispatch = useDispatch();
  const nodeUrl = useSelector(state => state.network.nodeUrl);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    socket?.disconnect();
    const soc = io(nodeUrl);
    dispatch(resetBlockchain());
    dispatch(resetParams());
    initializeSocket(soc);
    setSocket(soc);

    // set axios apiUrl
    axios.defaults.baseURL = nodeUrl;
  }, [nodeUrl]);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <Router>
        <main className="is-flex is-flex-direction-column" style={{ height: "100%" }}>
          <Navbar />
          <div className="is-flex is-flex-direction-column" style={{ overflow: "auto", flex: 1 }}>
            <div className="container" style={{ width: "100%" }}>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/generate-keys" element={<GenerateKeysPage />} />
                  <Route path="/receive" element={<ReceivePage />} />
                  <Route path="/mine" element={<MinePage />} />
                  <Route path="/blockchain" element={<BlockchainPage />} />
                  <Route path="/block/height/:height" element={<BlockPage />} />
                  <Route path="/block/:hash" element={<BlockPage />} />
                  <Route path="/transaction/create" element={<NewTransactionPage />} />
                  <Route path="/transaction/:hash" element={<TransactionPage />} />
                  <Route path="/address/:address" element={<AddressPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/parameters" element={<ParametersPage />} />
                  <Route path="/overview" element={<OverviewPage />} />
                  <Route path="/faucet" element={<FaucetPage />} />
                  <Route path="/node" element={<NodePage />} />
                  <Route path="/developer" element={<DeveloperPage />} />
                  <Route path="/wallet/onboarding" element={<WalletOnboardingPage />} />
                  <Route path="/wallet/import" element={<WalletImportPage />} />
                  <Route path="/wallet/create" element={<WalletCreatePage />} />
                  <Route path="/wallet" element={<WalletPage />} />
                  <Route path="/" element={<LandingPage />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </div>

          <div className="is-hidden-touch">
            <NewTransactionAction />
          </div>
          <Toaster />
        </main>
      </Router>
    </SocketContext.Provider>
  );
};

export default App;
