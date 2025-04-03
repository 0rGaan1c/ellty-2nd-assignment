import { Toaster } from "react-hot-toast";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ThreadList from "./components/threads/ThreadList";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <ThreadList />
        </main>
        <Footer />
        <Toaster position="top-center" />
      </div>
    </AuthProvider>
  );
}

export default App;
