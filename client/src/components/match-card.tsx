import { Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Match } from "@shared/schema";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getTeamInitials = (teamName: string) => {
    return teamName
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 3)
      .toUpperCase();
  };

  const getTeamColor = (teamName: string) => {
    // Simple hash function to generate consistent colors
    let hash = 0;
    for (let i = 0; i < teamName.length; i++) {
      hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-red-100 text-red-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-yellow-100 text-yellow-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600',
      'bg-orange-100 text-orange-600',
      'bg-teal-100 text-teal-600',
      'bg-cyan-100 text-cyan-600',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-700 rounded-full flex items-center justify-center">
              <Calendar className="text-white h-3 w-3" />
            </div>
            <Badge 
              variant="secondary" 
              className="text-xs font-medium text-blue-600 bg-blue-50"
            >
              {match.status}
            </Badge>
          </div>
          {match.matchday && (
            <span className="text-xs text-gray-600">Matchday {match.matchday}</span>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTeamColor(match.homeTeam.name)}`}>
                <span className="text-xs font-bold">
                  {match.homeTeam.tla || getTeamInitials(match.homeTeam.name)}
                </span>
              </div>
              <span className="font-medium text-gray-900 truncate">
                {match.homeTeam.name}
              </span>
            </div>
            <span className="text-sm text-gray-600">vs</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTeamColor(match.awayTeam.name)}`}>
                <span className="text-xs font-bold">
                  {match.awayTeam.tla || getTeamInitials(match.awayTeam.name)}
                </span>
              </div>
              <span className="font-medium text-gray-900 truncate">
                {match.awayTeam.name}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-600 h-4 w-4" />
              <span className="text-sm text-gray-600">
                {formatDate(match.utcDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-gray-600 h-4 w-4" />
              <span className="text-sm font-medium text-gray-900">
                {formatTime(match.utcDate)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
