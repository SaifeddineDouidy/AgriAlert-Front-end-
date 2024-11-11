import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { authOptions } from "../utils/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/NavBar"; // Uncomment if you want to use the Navbar
import Sidebar, { SidebarItem } from "../components/SideBar";
import { Home, Settings, User, FileText, HelpCircle } from "lucide-react"; // Import icons from lucide-react

export default async function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const userName = session.user?.name || "Guest"; // Get user's name from session
  const userEmail = session.user?.email || "example@example.com"; // Get user's email from session

  return (
    <div className="flex h-screen"> {/* Use flexbox to layout sidebar and main content */}
      {/*<Navbar />*/} {/* Uncomment if you want to include the Navbar */}
      <Sidebar name={userName} email={userEmail}>
        {/* Add Sidebar Items */}
        <SidebarItem icon={<Home />} text={"Home"} />
        <SidebarItem icon={<User />} text={"Profile"} />
        <SidebarItem icon={<FileText />} text={"Documents"} />
        <SidebarItem icon={<Settings />} text={"Settings"} />
        <SidebarItem icon={<HelpCircle />} text={"Help"} />
      </Sidebar>
      <main className="flex-1 p-4 overflow-y-auto"> {/* Main content area */}
        {children}
      </main>
    </div>
  );
}
