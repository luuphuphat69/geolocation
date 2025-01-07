import { useState } from "react"
import { LogIn, UserPlus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rePassword, setRePassword] = useState("")
  const [error, setError] = useState("")
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [user, setUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (!isLoginMode && password !== rePassword) {
      setError("Passwords do not match")
      return
    }

    try {
      // Add your login/signup logic here
      if (isLoginMode) {
        // Login logic
        console.log("Logging in with:", email, password)
        // Simulate successful login
        setUser({ email })
        setIsDialogOpen(false)
      } else {
        // Signup logic
        console.log("Signing up with:", email, password)
        // Simulate successful signup
        setUser({ email })
        setIsDialogOpen(false)
      }
    } catch (err) {
      setError(isLoginMode ? "Invalid email or password" : "Signup failed")
    }
  }

  const handleLogout = () => {
    setUser(null)
    setEmail("")
    setPassword("")
    setRePassword("")
  }

  const handleModeChange = (mode) => {
    setIsLoginMode(mode)
    setError("")
    setEmail("")
    setPassword("")
    setRePassword("")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
            Geolocation 🌍
            </span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/about"
            >
              About
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/pricing"
            >
              Pricing
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/contact"
            >
              Contact
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-4">
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <div className="flex gap-2">
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-4"
                    onClick={() => handleModeChange(true)}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-4"
                    onClick={() => handleModeChange(false)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </DialogTrigger>
              </div>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{isLoginMode ? "Login" : "Sign Up"}</DialogTitle>
                  <DialogDescription>
                    {isLoginMode 
                      ? "Enter your credentials to access your account"
                      : "Create a new account to get started"
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {!isLoginMode && (
                    <div className="space-y-2">
                      <Label htmlFor="re-password">Confirm Password</Label>
                      <Input
                        id="re-password"
                        type="password"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isLoginMode ? "Login" : "Sign Up"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  )
}