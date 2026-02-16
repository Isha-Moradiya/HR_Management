"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Calendar, TrendingUp } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { UserRole } from "@/app/dashboard/page"

interface DashboardContentProps {
  userRole: UserRole
}

const attendanceData = [
  { month: "Jan", attendance: 85 },
  { month: "Feb", attendance: 92 },
  { month: "Mar", attendance: 78 },
  { month: "Apr", attendance: 88 },
  { month: "May", attendance: 95 },
  { month: "Jun", attendance: 82 },
]

const departmentData = [
  { department: "Engineering", employees: 25 },
  { department: "Marketing", employees: 12 },
  { department: "Sales", employees: 18 },
  { department: "HR", employees: 8 },
  { department: "Finance", employees: 6 },
]

const skillsData = {
  React: 15,
  Node: 12,
  Python: 18,
  AWS: 10,
  PHP: 8,
  Angular: 6,
}

export function DashboardContent({ userRole }: DashboardContentProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["React", "Node"])
  const [skillFilterMode, setSkillFilterMode] = useState<"AND" | "OR">("OR")

  const getSkillChartData = () => {
    if (skillFilterMode === "AND") {
      const combinedCount =
        selectedSkills.length > 0
          ? Math.min(...selectedSkills.map((skill) => skillsData[skill as keyof typeof skillsData]))
          : 0
      return [{ skill: selectedSkills.join(" + "), count: combinedCount }]
    } else {
      return selectedSkills.map((skill) => ({
        skill,
        count: skillsData[skill as keyof typeof skillsData] || 0,
      }))
    }
  }

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      {userRole === "admin" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">69</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">This month average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">Year over year</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Employee Dashboard */}
      {userRole === "employee" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>My Attendance</CardTitle>
              <CardDescription>Your attendance summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">This month attendance rate</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Present Days</span>
                  <Badge variant="outline">23</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Absent Days</span>
                  <Badge variant="destructive">2</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Mark Today's Attendance</p>
                <p className="text-xs text-muted-foreground">Click to mark present/absent</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">View Calendar</p>
                <p className="text-xs text-muted-foreground">Check your attendance history</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts - Admin Only */}
      {userRole === "admin" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance</CardTitle>
              <CardDescription>Attendance trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  attendance: {
                    label: "Attendance %",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="attendance" fill="var(--color-attendance)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department-wise Employees</CardTitle>
              <CardDescription>Employee distribution by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  employees: {
                    label: "Employees",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="employees" fill="var(--color-employees)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Skillset Filter Chart - Admin Only */}
      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Skillset Analysis</CardTitle>
            <CardDescription>Filter employees by skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Skills:</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(skillsData).map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <Label htmlFor={skill} className="text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Filter Mode:</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="filter-mode" className="text-sm">
                      OR
                    </Label>
                    <Switch
                      id="filter-mode"
                      checked={skillFilterMode === "AND"}
                      onCheckedChange={(checked) => setSkillFilterMode(checked ? "AND" : "OR")}
                    />
                    <Label htmlFor="filter-mode" className="text-sm">
                      AND
                    </Label>
                  </div>
                </div>
              </div>

              <ChartContainer
                config={{
                  count: {
                    label: "Employee Count",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getSkillChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
