import { Card, CardContent } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardContent className="p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-6 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-6 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="w-32 h-3 bg-gray-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}
