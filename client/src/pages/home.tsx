import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Calendar, Clock, AlertTriangle, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";
import { MatchCard } from "@/components/match-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import type { Match } from "@shared/schema";

interface MatchesResponse {
  matches: Match[];
  count: number;
  lastUpdated: string;
}

export default function Home() {
  const {
    data: response,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<MatchesResponse>({
    queryKey: ["/api/matches"],
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  const matches = response?.matches || [];
  const lastUpdated = response?.lastUpdated;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    refetch();
  };

  const formatLastUpdated = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                <Calendar className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Upcoming Matches</h1>
                <p className="text-sm text-gray-600">Premier League 2024/25</p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isLoading || isRefetching}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${(isLoading || isRefetching) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                error ? 'bg-red-500' : 
                isLoading || isRefetching ? 'bg-blue-500 animate-pulse' : 
                'bg-green-500'
              }`} />
              <span className="text-sm text-gray-600">
                {error ? 'Error loading matches' : 
                 isLoading ? 'Loading matches...' : 
                 isRefetching ? 'Refreshing...' :
                 'Matches loaded successfully'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Last updated: <span>{formatLastUpdated(lastUpdated)}</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span>{matches.length}</span> matches found
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600 h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Matches</h3>
            <p className="text-gray-600 mb-6">
              There was an error fetching the latest match data. Please check your internet connection and try again.
            </p>
            <Button 
              onClick={handleRefresh}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && matches.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarX className="text-gray-400 h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Matches</h3>
            <p className="text-gray-600">There are no scheduled matches at the moment. Check back later for updates.</p>
          </div>
        )}

        {/* Matches List */}
        {!isLoading && !error && matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Data provided by{" "}
              <a 
                href="https://www.football-data.org/" 
                className="text-blue-600 hover:underline" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Football-Data.org
              </a>
            </div>
            <div className="text-sm text-gray-600">
              Last updated: <span>{formatLastUpdated(lastUpdated)}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
