import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import RootLayout from "../layouts/RootLayout";
import Upload from "../components/Upload";

const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </>
  );
};

export default MainRoutes;
