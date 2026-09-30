import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <EmptyState
        icon={Compass}
        title="Página não encontrada"
        description="A página que você procura não existe ou foi movida."
        action={
          <Button size="sm" nativeButton={false} render={<Link href="/" />}>
            Voltar para o início
          </Button>
        }
      />
    </div>
  );
}
