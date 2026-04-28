import { Skeleton } from "@/components/ui/skeleton";

export function TopicsGridShimmer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="glass backdrop-blur-2xl rounded-2xl overflow-hidden">
          {/* Image Skeleton */}
          <div className="aspect-video relative overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Content Skeleton */}
          <div className="p-5 flex flex-col gap-4">
            {/* Stats Skeleton */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-6 w-24 rounded-lg" />
            </div>

            {/* Date Skeleton */}
            <Skeleton className="h-4 w-32" />

            {/* Button Skeleton */}
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TopicsPageShimmer() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Filter Bar Skeleton */}
            <div className="glass backdrop-blur-2xl rounded-2xl p-4">
                <Skeleton className="h-16 w-full" />
            </div>

            <TopicsGridShimmer />
        </div>
    );
}
