import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PCA</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">PCA Manager</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/features">
            <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
          </Link>
          <Link href="/pricing">
            <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </a>
          </Link>
          <Link href="/about">
            <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
          </Link>
          <Link href="/contact">
            <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contato
            </a>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/contact">
            <Button variant="default" size="sm">
              Começar
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

