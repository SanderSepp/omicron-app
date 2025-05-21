import React from 'react';
import {MapPoint} from '@/lib/types';
import {Card, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

interface PointCardProps {
  point: MapPoint;
  onClose: () => void;
}

const PointCard: React.FC<PointCardProps> = ({ point, onClose }) => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{point.name}</CardTitle>
            <CardDescription className="text-sm">{point.address}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PointCard;
