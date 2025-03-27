import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
  change?: {
    value: number;
    isPositive: boolean;
    text: string;
    showPositiveAsNegative?: boolean;
  };
  hint?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  valueColor = "",
  change,
  hint,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className={cn("text-2xl font-bold mt-1", valueColor)}>
            {value}
          </h2>
        </div>
        <div className={cn("p-2 rounded-lg", iconBg)}>
          <i className={cn(`${icon} text-xl`, iconColor)}></i>
        </div>
      </div>
      <div className="mt-3 flex items-center text-xs">
        {change ? (
          <>
            <span
              className={cn(
                "flex items-center",
                change.isPositive
                  ? change.showPositiveAsNegative
                    ? "text-red-500"
                    : "text-green-500"
                  : change.showPositiveAsNegative
                  ? "text-green-500"
                  : "text-red-500"
              )}
            >
              <i
                className={cn(
                  change.isPositive ? "ri-arrow-up-line" : "ri-arrow-down-line",
                  "mr-1"
                )}
              ></i>
              {change.value}%
            </span>
            <span className="text-slate-500 ml-2">{change.text}</span>
          </>
        ) : (
          hint && <span className="text-slate-500">{hint}</span>
        )}
      </div>
    </div>
  );
}
