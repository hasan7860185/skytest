import { ReactNode } from "react";

interface UserFormContainerProps {
  children: ReactNode;
}

export function UserFormContainer({ children }: UserFormContainerProps) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}