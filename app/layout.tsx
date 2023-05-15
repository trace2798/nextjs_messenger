import ActiveStatus from "./components/ActiveStatus";
import AuthContext from "./context/AuthContext";
import ToasterContext from "./context/ToasterContext";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight:['100', '200', '300', '400', '500', '600', '700'] });

export const metadata = {
  title: "Private Channel",
  description: "Contacting Trace has never been easier.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta
        name="google-site-verification"
        content="NoOsOcXBBQtuh7XngLA9yhKLQ5xucECGvRqZjrtHal0"
      />
      <body className={poppins.className}>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
