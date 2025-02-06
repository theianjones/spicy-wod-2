import { Form, Link } from 'react-router';

import { Button } from './ui/button';

interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black uppercase">
          Spicy WOD
        </Link>

        <nav>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/workouts" className="text-sm font-medium hover:text-gray-600">
                Workouts
              </Link>
              <Form action="/logout" method="post">
                <Button
                  type="submit"
                  variant="ghost"
                  className="text-sm font-medium hover:text-gray-600"
                >
                  Logout
                </Button>
              </Form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium hover:text-gray-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-9 items-center justify-center bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
