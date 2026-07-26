import { TooltipProvider } from "@/components/ui/tooltip"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-full flex flex-col">
    <TooltipProvider>
      {children}
    </TooltipProvider>
    </div>
  )
}