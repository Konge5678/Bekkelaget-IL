"use client";

import { createMember, deleteMember, updateMember } from "@/app/admin/members/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatOsloDateTime } from "@/lib/date";
import { useState } from "react";

type Member = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  has_paid_contingent: boolean | null;
  due_date: string | null;
  created_at: string | null;
};

type Props = {
  members: Member[];
};

export function MembersPanel({ members }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);

  const formAction = editing ? updateMember : createMember;

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          setEditing(null);
          setOpen(true);
        }}
      >
        Ny medlem
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>E-post</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Kontingent</TableHead>
            <TableHead>Forfallsdato</TableHead>
            <TableHead>Opprettet</TableHead>
            <TableHead className="text-right">Handling</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => {
            const isPaid = Boolean(m.has_paid_contingent);

            return (
              <TableRow key={m.id}>
                <TableCell className="max-w-[260px] truncate">{m.name}</TableCell>
                <TableCell className="max-w-[280px] truncate">{m.email ?? "-"}</TableCell>
                <TableCell>{m.phone ?? "-"}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded-md px-2 py-1 text-xs font-medium",
                      isPaid
                        ? "bg-muted text-foreground"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {isPaid ? "Betalt" : "Ikke betalt"}
                  </span>
                </TableCell>
                <TableCell>
                  {m.due_date
                    ? new Date(m.due_date).toLocaleDateString("nb-NO")
                    : "-"}
                </TableCell>
                <TableCell>{formatOsloDateTime(m.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(m);
                        setOpen(true);
                      }}
                    >
                      Rediger
                    </Button>
                    <form action={deleteMember}>
                      <input type="hidden" name="id" value={m.id} />
                      <Button size="sm" variant="destructive" type="submit">
                        Slett
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                Ingen medlemmer funnet.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Rediger medlem" : "Ny medlem"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Oppdater informasjon og kontingentstatus."
                : "Legg til et nytt medlem i registeret."}
            </DialogDescription>
          </DialogHeader>

          <form
            key={editing?.id ?? "new"}
            action={formAction}
            className="flex flex-col gap-4"
          >
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Navn</span>
                <Input
                  name="name"
                  placeholder="Navn"
                  required
                  defaultValue={editing?.name ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">E-post</span>
                <Input
                  name="email"
                  type="email"
                  placeholder="E-post"
                  required
                  defaultValue={editing?.email ?? ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Telefon</span>
                <Input
                  name="phone"
                  placeholder="Telefon (valgfritt)"
                  defaultValue={editing?.phone ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Forfallsdato</span>
                <Input
                  name="due_date"
                  type="date"
                  defaultValue={editing?.due_date ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Kontingent</span>
                <select
                  name="has_paid_contingent"
                  defaultValue={editing?.has_paid_contingent ? "true" : "false"}
                  className="h-9 rounded-md border-2 border-input bg-background px-3 text-sm"
                >
                  <option value="false">Ikke betalt</option>
                  <option value="true">Betalt</option>
                </select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Avbryt
              </Button>
              <Button type="submit">Lagre</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
