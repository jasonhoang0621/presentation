import { useEffect, useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Authenticate from "src/auth";
import Login from "src/pages/Login";
import Register from "src/pages/Register";
import Authenticated from "./Authed";
import { getSocket, SocketContext } from "src/socket/context";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { ToastContainer } from "react-toastify";

const createQueryClient = () => {
  const queryCache = new QueryCache();
  return new QueryClient({
    queryCache,
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        notifyOnChangeProps: "tracked",
      },
    },
  });
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const Root = () => {
  const [queryClient] = useState(createQueryClient);
  const [socket, setSocket] = useState(null);

  const connectSocket = async () => {
    setSocket(await getSocket());
  };
  useEffect(() => {
    connectSocket();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="*"
              element={
                <Authenticate>
                  <Authenticated />
                </Authenticate>
              }
            />
            <Route path="*" element={<Navigate to={`/login`} replace />} />
          </Routes>
          <ToastContainer
            position="bottom-left"
            autoClose={1500}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </BrowserRouter>
      </QueryClientProvider>
    </SocketContext.Provider>
  );
};

export default Root;
