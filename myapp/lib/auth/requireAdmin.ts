import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function requireAdmin() {
    const session = await getServerSession(authOptions);

    const user = session?.user as {
      email?: string | null;
      role?: string;
    };

    if (!session || user?.role !== "admin") {
      return null;
    }

    return session;
}