import { Badge } from '@/components/ui/badge';
import { formatEV } from '@/lib/odds-calculator';
import { ConfidenceLevel } from '@/lib/types';

interface EVBadgeProps {
  ev: number;
  confidence: ConfidenceLevel;
  showConfidence?: boolean;
}

export function EVBadge({ ev, confidence, showConfidence = false }: EVBadgeProps) {
  const getVariant = () => {
    if (ev >= 8) return 'success';
    if (ev >= 5) return 'default';
    if (ev >= 3) return 'secondary';
    return 'outline';
  };

  const getConfidenceColor = () => {
    if (confidence === 'High') return 'text-green-600 dark:text-green-400';
    if (confidence === 'Medium') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getVariant()} className="font-mono">
        {formatEV(ev)} EV
      </Badge>
      {showConfidence && (
        <span className={`text-xs font-medium ${getConfidenceColor()}`}>
          {confidence}
        </span>
      )}
    </div>
  );
}
