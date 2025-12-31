import { ProtectedRoute } from "@/components/auth/protected-route"
import { EmployeeDashboard } from "@/components/dashboard/employee-dashboard"

export default function EmployeePage() {
  return (
    <ProtectedRoute requiredRole="employee">
      <EmployeeDashboard />
    </ProtectedRoute>
  )
}
