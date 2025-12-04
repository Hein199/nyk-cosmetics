import DashboardLayoutComponent from "@/components/layouts/DashboardLayout";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardLayoutComponent userRole="salesperson" userName="Thiri">
            {children}
        </DashboardLayoutComponent>
    );
}
