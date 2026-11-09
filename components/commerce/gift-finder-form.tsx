import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GIFT_BUDGETS } from "@/lib/commerce";
import { OCCASION_LABELS, OCCASIONS } from "@/lib/constants";

interface GiftFinderFormProps {
  occasion?: string;
  budget?: string;
}

const SELECT_CLASS =
  "mt-1.5 block h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

export function GiftFinderForm({ occasion, budget }: GiftFinderFormProps) {
  return (
    <form
      method="get"
      action="/gifts"
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
    >
      <label className="block text-sm">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Occasion
        </span>
        <select
          name="occasion"
          defaultValue={occasion ?? ""}
          className={SELECT_CLASS}
        >
          <option value="">Any occasion</option>
          {OCCASIONS.map((value) => (
            <option key={value} value={value}>
              {OCCASION_LABELS[value] ?? value}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Budget
        </span>
        <select
          name="budget"
          defaultValue={budget ?? ""}
          className={SELECT_CLASS}
        >
          <option value="">Any budget</option>
          {GIFT_BUDGETS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} · {option.description}
            </option>
          ))}
        </select>
      </label>

      <Button type="submit" className="h-11 self-end">
        <Search aria-hidden="true" className="size-4" strokeWidth={1.8} />
        Find gifts
      </Button>
    </form>
  );
}
