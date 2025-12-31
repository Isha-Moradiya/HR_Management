"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import type { Department } from "@/components/admin/department-list"

interface DepartmentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (department: Omit<Department, "id" | "createdDate">) => void
  department?: Department | null
}

export function DepartmentFormModal({ isOpen, onClose, onSave, department }: DepartmentFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    logo: "/placeholder.svg?height=40&width=40",
    status: "Active" as "Active" | "Inactive",
  })
  const [logoPreview, setLogoPreview] = useState<string>("")

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        logo: department.logo,
        status: department.status,
      })
      setLogoPreview(department.logo)
    } else {
      setFormData({
        name: "",
        logo: "/placeholder.svg?height=40&width=40",
        status: "Active",
      })
      setLogoPreview("")
    }
  }, [department, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setFormData((prev) => ({ ...prev, logo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoPreview("")
    setFormData((prev) => ({ ...prev, logo: "/placeholder.svg?height=40&width=40" }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{department ? "Edit Department" : "Add Department"}</DialogTitle>
          <DialogDescription>
            {department ? "Update department information" : "Create a new department"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter department name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Department Logo</Label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <div className="relative">
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo preview"
                    className="h-16 w-16 rounded-lg object-cover border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex-1">
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-lg hover:bg-muted/50">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Upload Logo</span>
                  </div>
                </Label>
                <Input 
                  id="logo-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                  className="hidden"
                  required={!department} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "Active" | "Inactive") => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {department && (
            <div className="space-y-2">
              <Label>Created Date</Label>
              <Input value={new Date(department.createdDate).toLocaleDateString()} disabled className="bg-muted" />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{department ? "Update" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
