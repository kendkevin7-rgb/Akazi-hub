"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Ban,
  RefreshCw,
  FileCheck2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { apiWithCsrf } from "@/lib/auth-client";
import clsx from "clsx";

type Status = "PENDING" | "VERIFIED" | "REJECTED";

interface Application {
  profileId: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  neighborhood: string | null;
  isActive: boolean;
  createdAt: string;
  appliedAt: string | null;
  skill: string | null;
  rateRwf: number | null;
  rateUnit: string | null;
  momoProvider: string | null;
  momoNumber: string | null;
  nidNumber: string | null;
  photoUrl: string | null;
  photoFileName: string | null;
  cvFileName: string | null;
  certFileName: string | null;
  status: Status;
  rejectionReason: string | null;
}

const TABS: { key: Status; label: string }[] = [
  { key: "PENDING", label: "Pending" },
  { key: "VERIFIED", label: "Verified" },
  { key: "REJECTED", label: "Rejected" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<Status>("PENDING");
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/applications?status=${tab}`, { cache: "no-store" });
      if (res.status === 403) {
        setError("FORBIDDEN");
        setItems([]);
        return;
      }
      if (!res.ok) throw new Error("LOAD_FAILED");
      const data = await res.json();
      setItems(data.applications ?? []);
    } catch {
      setError("LOAD_FAILED");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    void load();
  }, [load]);

  async function review(id: string, action: "APPROVE" | "REJECT", reason?: string) {
    setBusyId(id);
    setError(null);
    try {
      const res = await apiWithCsrf(`/api/admin/applications/${id}/review`, {
        body: { action, rejectionReason: reason },
      });
      if (!res.ok) {
        setError(res.status === 403 ? "FORBIDDEN" : "ACTION_FAILED");
        return;
      }
      setRejectingId(null);
      setRejectReason("");
      await load();
    } catch {
      setError("ACTION_FAILED");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(a: Application) {
    setBusyId(a.profileId);
    setError(null);
    try {
      const res = await apiWithCsrf(`/api/admin/users/${a.userId}/status`, {
        body: { isActive: !a.isActive },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === "CANNOT_SUSPEND_SELF" ? "CANNOT_SUSPEND_SELF" : "ACTION_FAILED");
        return;
      }
      await load();
    } catch {
      setError("ACTION_FAILED");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <header className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl2 bg-brand-500 text-white">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-ink-900">Admin Panel</h1>
          <p className="text-xs font-semibold text-ink-500">Review and manage worker applications</p>
        </div>
      </header>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={clsx(
              "tap-target rounded-xl2 border-2 py-2 text-sm font-bold",
              tab === tb.key
                ? "border-brand-500 bg-brand-50 text-brand-600"
                : "border-ink-100 bg-card text-ink-600"
            )}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {error === "FORBIDDEN" && (
        <div className="rounded-xl2 border border-danger/20 bg-danger/10 p-4 text-center text-sm font-semibold text-danger">
          Access denied.
        </div>
      )}

      {error && error !== "FORBIDDEN" && (
        <div className="mb-4 flex items-center gap-2 rounded-xl2 border border-danger/20 bg-danger/10 p-3 text-sm font-semibold text-danger">
          <XCircle size={16} />
          {error === "CANNOT_SUSPEND_SELF" ? "You cannot suspend yourself." : "Action failed. Try again."}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-ink-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-sm font-semibold text-ink-400">
          No {tab.toLowerCase()} applications.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.profileId} className="rounded-2xl border border-ink-100 bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                {a.photoUrl && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl2 bg-ink-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.photoUrl} alt={a.fullName} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-base font-extrabold text-ink-900">{a.fullName}</h2>
                    {a.status === "PENDING" && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        NEW
                      </span>
                    )}
                    {!a.isActive && (
                      <span className="flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-bold text-danger">
                        <Ban size={10} /> SUSPENDED
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-ink-500">
                    {a.phoneNumber}
                    {a.neighborhood ? ` · ${a.neighborhood}` : ""}
                  </p>
                </div>
                <span className="shrink-0 rounded-xl2 bg-ink-100 px-2.5 py-1 text-xs font-bold text-ink-700">
                  {a.skill ?? "—"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <Info label="Rate" value={a.rateRwf ? `${a.rateRwf.toLocaleString()} RWF / ${a.rateUnit ?? ""}` : "—"} />
                <Info label="MoMo" value={a.momoNumber ? `${a.momoProvider ?? ""} ${a.momoNumber}` : "—"} />
                <Info label="NID" value={a.nidNumber ?? "—"} />
                <Info label="Applied" value={a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : "—"} />
              </div>

              {(a.photoFileName || a.cvFileName || a.certFileName) && (
                <div className="mt-3 space-y-1.5">
                  {[
                    ["Photo", a.photoFileName],
                    ["CV", a.cvFileName],
                    ["Certificate", a.certFileName],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, v]) => (
                      <div key={label as string} className="flex items-center gap-2 text-xs font-semibold text-ink-600">
                        <FileCheck2 size={14} className="text-brand-500" />
                        <span className="text-ink-400">{label}:</span>
                        <span className="truncate">{v as string}</span>
                      </div>
                    ))}
                </div>
              )}

              {a.status === "REJECTED" && a.rejectionReason && (
                <p className="mt-3 rounded-xl2 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger">
                  Reason: {a.rejectionReason}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {a.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => review(a.profileId, "APPROVE")}
                      disabled={busyId === a.profileId}
                      className="tap-target flex items-center gap-1.5 rounded-xl2 bg-brand-500 px-3 py-2 text-xs font-bold text-white active:bg-brand-600 disabled:opacity-50"
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button
                      onClick={() => setRejectingId(a.profileId)}
                      disabled={busyId === a.profileId}
                      className="tap-target flex items-center gap-1.5 rounded-xl2 border border-danger/30 px-3 py-2 text-xs font-bold text-danger active:bg-danger/10 disabled:opacity-50"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
                {a.status === "VERIFIED" && (
                  <button
                    onClick={() => toggleActive(a)}
                    disabled={busyId === a.profileId}
                    className="tap-target flex items-center gap-1.5 rounded-xl2 border border-danger/30 px-3 py-2 text-xs font-bold text-danger active:bg-danger/10 disabled:opacity-50"
                  >
                    <Ban size={14} /> {a.isActive ? "Suspend" : "Reactivate"}
                  </button>
                )}
                {a.status === "VERIFIED" && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-ink-400">
                    <UserRound size={14} /> {a.isActive ? "Active" : "Suspended"}
                  </span>
                )}
              </div>

              {rejectingId === a.profileId && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection…"
                    rows={2}
                    className="w-full rounded-xl2 border border-ink-100 bg-surface px-3 py-2 text-xs text-ink-900 outline-none focus:border-danger/50"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => review(a.profileId, "REJECT", rejectReason)}
                      disabled={busyId === a.profileId}
                      className="tap-target rounded-xl2 bg-danger px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                    >
                      Confirm rejection
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason("");
                      }}
                      className="tap-target rounded-xl2 border border-ink-100 px-3 py-2 text-xs font-bold text-ink-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => void load()}
          className="tap-target flex items-center gap-1.5 rounded-xl2 border border-ink-100 px-4 py-2 text-xs font-bold text-ink-600 active:bg-ink-100"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl2 bg-surface px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-ink-400">{label}</p>
      <p className="truncate text-xs font-semibold text-ink-800">{value}</p>
    </div>
  );
}
