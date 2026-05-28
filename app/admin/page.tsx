import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Bekkelaget IL - Redaktørpanelet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Velg hva du ønsker å administrere i oversikten under
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nyheter</CardTitle>
            <CardDescription>Siste:</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/news">Administrer nyheter <ArrowRight className="size-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Artikler</CardTitle>
            <CardDescription>Siste:</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/articles">Administrer artikler <ArrowRight className="size-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Arrangementer</CardTitle>
            <CardDescription>Siste:</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/events">Administrer arrangementer <ArrowRight className="size-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medlemsregister</CardTitle>
            <CardDescription>Oversikt over medlemmer og kontingentstatus.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/members">Gå til medlemsregister <ArrowRight className="size-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

