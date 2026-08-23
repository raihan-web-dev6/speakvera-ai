"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CreditCard,
  ExternalLink,
  FileText,
  Loader2,
  ReceiptText,
  RefreshCcw,
} from "lucide-react";

import {
  format,
} from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

type Transaction = {
  id:
    string;

  status:
    string;

  origin:
    string;

  currencyCode:
    string;

  total:
    string;

  createdAt:
    string;

  billedAt:
    string | null;

  subscriptionId:
    string | null;

  canDownloadInvoice:
    boolean;
};

function formatMoney(
  amount: string,
  currencyCode: string
) {
  const value =
    Number(amount) /
    100;

  return new Intl.NumberFormat(
    undefined,
    {
      style:
        "currency",

      currency:
        currencyCode,
    }
  ).format(value);
}

function formatDate(
  value: string
) {
  return format(
    new Date(value),
    "MMM d, yyyy"
  );
}

function statusName(
  status: string
) {
  switch (status) {
    case "completed":
      return "Paid";

    case "paid":
      return "Paid";

    case "past_due":
      return "Past due";

    case "canceled":
      return "Canceled";

    case "billed":
      return "Billed";

    default:
      return status;
  }
}

export default function BillingHistory() {
  const [
    transactions,
    setTransactions,
  ] =
    useState<Transaction[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  async function loadHistory() {
    try {
      setLoading(true);

      setError("");

      const response =
        await fetch(
          "/api/billing/transactions",
          {
            cache:
              "no-store",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load payment history."
        );
      }

      setTransactions(
        data.transactions ??
          []
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load payment history."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="h-5 w-5" />

              Payment history
            </CardTitle>

            <CardDescription className="mt-1">
              View your Speakvera
              payments and download
              available invoices.
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={
              loadHistory
            }
            disabled={
              loading
            }
          >
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex min-h-40 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {!loading &&
          error && (
            <div className="rounded-xl border p-4 text-sm">
              {error}
            </div>
          )}

        {!loading &&
          !error &&
          transactions.length ===
            0 && (
            <div className="flex min-h-40 flex-col items-center justify-center text-center">
              <CreditCard className="mb-3 h-6 w-6 text-muted-foreground" />

              <p className="font-medium">
                No payments yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your Paddle
                transactions will
                appear here.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          transactions.length >
            0 && (
            <div className="space-y-3">
              {transactions.map(
                (
                  transaction
                ) => (
                  <div
                    key={
                      transaction.id
                    }
                    className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">
                          {formatMoney(
                            transaction.total,
                            transaction.currencyCode
                          )}
                        </p>

                        <Badge
                          variant={
                            transaction.status ===
                            "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {statusName(
                            transaction.status
                          )}
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(
                          transaction.createdAt
                        )}
                      </p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {
                          transaction.id
                        }
                      </p>
                    </div>

                    {transaction.canDownloadInvoice && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.open(
                            `/api/billing/transactions/${transaction.id}/invoice`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />

                        Invoice

                        <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                )
              )}
            </div>
          )}
      </CardContent>
    </Card>
  );
}